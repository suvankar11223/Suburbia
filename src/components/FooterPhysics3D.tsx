"use client";

import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { Skateboard } from "./Skateboard";
import gsap from "gsap";
import * as THREE from "three";

type FooterPhysics3DProps = {
  className?: string;
};

function FallingSkateboard() {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!groupRef.current) return;

    // Random starting position above the view
    const startX = (Math.random() - 0.5) * 20;
    const startY = 10 + Math.random() * 5;
    const startZ = (Math.random() - 0.5) * 10;

    // Random rotation
    const rotX = Math.random() * Math.PI * 2;
    const rotY = Math.random() * Math.PI * 2;
    const rotZ = Math.random() * Math.PI * 2;

    // Set initial position and rotation
    groupRef.current.position.set(startX, startY, startZ);
    groupRef.current.rotation.set(rotX, rotY, rotZ);

    // Animate falling
    gsap.to(groupRef.current.position, {
      y: -5,
      duration: 3 + Math.random() * 2,
      ease: "power1.in",
      delay: Math.random() * 2,
      onComplete: () => {
        // Reset to top when it reaches bottom
        groupRef.current!.position.y = 15;
        groupRef.current!.position.x = (Math.random() - 0.5) * 20;
        groupRef.current!.position.z = (Math.random() - 0.5) * 10;
      }
    });

    // Continuous falling loop
    const tl = gsap.timeline({ repeat: -1 });
    tl.to(groupRef.current.position, {
      y: -5,
      duration: 3 + Math.random() * 2,
      ease: "power1.in"
    })
    .set(groupRef.current.position, {
      y: 15,
      x: (Math.random() - 0.5) * 20,
      z: (Math.random() - 0.5) * 10
    });
  }, []);

  return (
    <group ref={groupRef}>
      <Skateboard
        wheelTextureURL="/skateboard/SkateWheel1.png"
        wheelTextureURLs={["/skateboard/SkateWheel1.png"]}
        deckTextureURL="/skateboard/Deck.webp"
        deckTextureURLs={["/skateboard/Deck.webp"]}
        truckColor="#333333"
        boltColor="#666666"
        constantWheelSpin={true}
      />
    </group>
  );
}

function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 5, 10]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      {/* Render multiple falling skateboards */}
      {Array.from({ length: 9 }, (_, i) => (
        <FallingSkateboard key={i} />
      ))}
    </>
  );
}

export function FooterPhysics3D({ className }: FooterPhysics3DProps) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector('.footer-physics-container');
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!inView || prefersReducedMotion) {
    return <div className={className} style={{ minHeight: '400px' }} />;
  }

  return (
    <div className={`footer-physics-container ${className}`} style={{ position: 'relative', minHeight: '400px' }}>
      <Canvas
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'transparent' }}
        gl={{ alpha: true }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}