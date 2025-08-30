"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bodies,
  Engine,
  Mouse,
  MouseConstraint,
  Render,
  Runner,
  World,
} from "matter-js";

type FooterPhysicsProps = {
  boardTextureURLs: string[];
  className?: string;
};

export function FooterPhysics({
  boardTextureURLs = [],
  className,
}: FooterPhysicsProps) {
  // The div we'll inject our canvas into
  const scene = useRef<HTMLDivElement>(null);
  // Engine handles the physics simulations
  const engine = useRef(Engine.create());
  // Intersection Observer state
  const [inView, setInView] = useState(false);
  // We show fewer boards on mobile
  const [isMobile, setIsMobile] = useState(false);

  // Handle mobile detection
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.matchMedia("(max-width: 768px)").matches);
      }
    };

    handleResize(); // Run on mount
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Fewer boards on mobile
  const limitedBoardTextures = isMobile
    ? boardTextureURLs.slice(0, 3)
    : boardTextureURLs;

  // Intersection Observer to start/stop the physics simulation
  useEffect(() => {
    const currentScene = scene.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        console.log('Intersection observer:', entry.isIntersecting, entry.intersectionRatio, 'boundingClientRect:', entry.boundingClientRect, 'rootBounds:', entry.rootBounds);
        setInView(entry.isIntersecting);
      },
      { threshold: 0.1 } // Lower threshold to trigger earlier
    );

    if (currentScene) {
      console.log('Observing element:', currentScene, 'with threshold 0.1');
      observer.observe(currentScene);

      // Check initial intersection since IO doesn't trigger for initial state
      setTimeout(() => {
        const rect = currentScene.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const isIntersecting = rect.top < windowHeight && rect.bottom > 0 && rect.height > 0;
        const intersectionRatio = Math.max(0, Math.min(1, (windowHeight - rect.top) / rect.height));
        console.log('Initial intersection check:', isIntersecting, intersectionRatio, rect);
        if (isIntersecting && intersectionRatio >= 0.1) {
          console.log('Initial intersection: setting inView to true');
          setInView(true);
        }
      }, 100);
    } else {
      console.log('No scene element to observe');
    }

    return () => {
      if (currentScene) observer.unobserve(currentScene);
    };
  }, []);

  useEffect(() => {
    if (!scene.current || !inView) return;

    console.log('Setting up physics engine, inView:', inView);

    // If the user prefers reduced motion, don't run the physics simulation
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    console.log('Prefers reduced motion:', prefersReducedMotion);
    if (prefersReducedMotion) return;

    const cw = scene.current.clientWidth;
    const ch = scene.current.clientHeight;

    console.log('Canvas dimensions:', cw, ch);

    engine.current.gravity.y = 0.8; // Stronger gravity to make boards fall faster
    engine.current.gravity.x = 0; // No horizontal gravity

    // Create Matter.js renderer
    const render = Render.create({
      element: scene.current, // attach to our scene div
      engine: engine.current,
      options: {
        width: cw,
        height: ch,
        pixelRatio: window.devicePixelRatio,
        wireframes: false,
        background: "transparent",
      },
    });

    console.log('Renderer created:', render.canvas);
    console.log('Canvas dimensions set to:', cw, 'x', ch);

    // Set canvas style dimensions
    render.canvas.style.width = cw + 'px';
    render.canvas.style.height = ch + 'px';

    // Add boundaries to the scene
    let boundaries = createBoundaries(cw, ch);
    World.add(engine.current.world, boundaries);

    // Add mouse interaction for dragging boards
    const mouse = Mouse.create(render.canvas);
    // @ts-expect-error - matter.js has incorrect types
    mouse.element.removeEventListener("wheel", mouse.mousewheel);

    const mouseConstraint = MouseConstraint.create(engine.current, {
      mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });
    World.add(engine.current.world, mouseConstraint);

    window.addEventListener("resize", onResize);

    function onResize() {
      if (!scene.current) return;

      const cw = scene.current.clientWidth;
      const ch = scene.current.clientHeight;

      // Update canvas and renderer dimensions
      render.canvas.width = cw;
      render.canvas.height = ch;
      render.canvas.style.width = cw + 'px';
      render.canvas.style.height = ch + 'px';
      render.options.width = cw;
      render.options.height = ch;
      Render.setPixelRatio(render, window.devicePixelRatio);

      World.remove(engine.current.world, boundaries);
      boundaries = createBoundaries(cw, ch);
      World.add(engine.current.world, boundaries);
    }

    // Create walls/boundaries around the scene to keep boards in
    function createBoundaries(width: number, height: number) {
      return [
        Bodies.rectangle(width / 2, -10, width, 20, {
          isStatic: true,
          restitution: 0.8,
          friction: 0.1
        }), // Top - bouncy
        Bodies.rectangle(-10, height / 2, 20, height, {
          isStatic: true,
          restitution: 0.8,
          friction: 0.1
        }), // Left - bouncy
        Bodies.rectangle(width / 2, height + 10, width, 20, {
          isStatic: true,
          restitution: 0.8,
          friction: 0.1
        }), // Bottom - bouncy
        Bodies.rectangle(width + 10, height / 2, 20, height, {
          isStatic: true,
          restitution: 0.8,
          friction: 0.1
        }), // Right - bouncy
      ];
    }

    // Runner manages the animation loop and updates engine 60 times per second
    const runner = Runner.create();
    Runner.run(runner, engine.current);
    Render.run(render);

    const currentEngine = engine.current;

    // Clean up
    return () => {
      window.removeEventListener("resize", onResize);

      Render.stop(render);
      Runner.stop(runner);
      if (currentEngine) {
        World.clear(currentEngine.world, false);
        Engine.clear(currentEngine);
      }
      render.canvas.remove();
      render.textures = {};
    };
  }, [inView]);

  // Add boards to the scene
  useEffect(() => {
    if (!scene.current || !inView) return;

    console.log('Adding boards to physics world, textures available:', limitedBoardTextures.length);

    const world = engine.current.world;
    const cw = scene.current.clientWidth;

    // Clear any existing bodies first
    World.clear(world, false);

    // Create at least 3 boards even if no textures
    const numBoards = Math.max(limitedBoardTextures.length, 3);

    const boards = Array.from({ length: numBoards }, (_, index) => {
      // Position boards at the top so they fall down
      const x = (cw / (numBoards + 1)) * (index + 1);
      const y = -150; // Start even higher above the visible area
      const rotation = ((Math.random() * 60 - 30) * Math.PI) / 180;

      console.log(`Creating board ${index} at position:`, x, y);

      const texture = limitedBoardTextures[index];
      console.log('Board texture:', texture);

      // If texture is available, use it; otherwise use a colored rectangle
      const renderOptions = texture ? {
        sprite: {
          texture,
          xScale: 0.5,
          yScale: 0.5,
        },
      } : {
        fillStyle: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'][index % 5],
      };

      return Bodies.rectangle(x, y, 80, 285, {
        chamfer: { radius: 40 },
        angle: rotation,
        restitution: 0.6,
        friction: 0.1,
        frictionAir: 0.01,
        density: 0.001,
        render: renderOptions,
      });
    });

    // Add all boards immediately
    World.add(engine.current.world, boards);
    console.log('Boards added to world:', boards.length);

    return () => {
      // Don't remove boards here as they should persist while in view
    };
  }, [limitedBoardTextures, inView]);

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div ref={scene} className={className} style={{ position: 'relative', minHeight: '400px' }}>
      {/* Debug indicator */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        background: 'rgba(255, 0, 0, 0.8)',
        color: 'white',
        padding: '5px',
        fontSize: '12px',
        zIndex: 1000
      }}>
        Physics: {inView && !prefersReducedMotion ? 'Active' : 'Inactive'} | Boards: {limitedBoardTextures.length} | Reduced Motion: {prefersReducedMotion ? 'Yes' : 'No'}
      </div>
    </div>
  );
}

