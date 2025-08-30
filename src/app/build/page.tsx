"use client";

import { Heading } from "@/components/Heading";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import React, { useEffect, useState, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { CustomizerControlsProvider, useCustomizerControls } from "./context";
import { createClient } from "@/prismicio";
import Preview from "./Preview";
import { asImageSrc } from "@prismicio/client";
import Controls from "./Controls";
import Loading from "./Loading";
import { useCart } from "@/lib/cart-context";
import { Content } from "@prismicio/client";

type SearchParams = {
  wheel?: string;
  deck?: string;
  truck?: string;
  bolt?: string;
};

export default function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const [customizerSettings, setCustomizerSettings] = useState<Content.BoardCustomizerDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const params = use(searchParams);
  const { data: session, status } = useSession();
  const router = useRouter();

  // All hooks must be called before any early returns
  useEffect(() => {
    if (status === "loading") return; // Still loading

    if (!session) {
      router.push("/login");
      return;
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchData = () => {
      const client = createClient();
      client.getSingle("board_customizer")
        .then((settings) => {
          setCustomizerSettings(settings);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch customizer settings:", error);
          setLoading(false);
        });
    };

    fetchData();
  }, []);

  // Early return only after all hooks are called
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-white text-xl">Checking authentication...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-white text-xl">Redirecting to login...</div>
      </div>
    );
  }

  if (loading || !customizerSettings) {
    return <Loading />;
  }

  const { wheels, decks, metals } = customizerSettings.data;

  const defaultWheel =
    wheels.find((wheel) => wheel.uid === params.wheel) ?? wheels[0];
  const defaultDeck =
    decks.find((deck) => deck.uid === params.deck) ?? decks[0];
  const defaultTruck =
    metals.find((metal) => metal.uid === params.truck) ?? metals[0];
  const defaultBolt =
    metals.find((metal) => metal.uid === params.bolt) ?? metals[0];

  const wheelTextureURLs = wheels
    .map((texture) => asImageSrc(texture.texture))
    .filter((url): url is string => Boolean(url));
  const deckTextureURLs = decks
    .map((texture) => asImageSrc(texture.texture))
    .filter((url): url is string => Boolean(url));

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <CustomizerControlsProvider
        defaultWheel={defaultWheel}
        defaultDeck={defaultDeck}
        defaultTruck={defaultTruck}
        defaultBolt={defaultBolt}
      >
        <div className="relative aspect-square shrink-0 bg-[#3a414a] lg:aspect-auto lg:grow">
          <div className="absolute inset-0">
            <Preview
              deckTextureURLs={deckTextureURLs}
              wheelTextureURLs={wheelTextureURLs}
            />
          </div>

          <Link href="/" className="absolute left-6 top-6">
            <Logo className="h-12 text-white" />
          </Link>
        </div>
        <div className="grow bg-texture bg-zinc-900 text-white ~p-4/6 lg:w-96 lg:shrink-0 lg:grow-0">
          <Heading as="h1" size="sm" className="mb-6 mt-0">
            Build your board
          </Heading>
          <Controls
            wheels={wheels}
            decks={decks}
            metals={metals}
            className="mb-6"
          />
          <AddToCartButton />
        </div>
      </CustomizerControlsProvider>
    </div>
  );
}

function AddToCartButton() {
  const { selectedWheel, selectedDeck, selectedTruck, selectedBolt } = useCustomizerControls();
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (!selectedWheel || !selectedDeck || !selectedTruck || !selectedBolt) {
      return;
    }

    addItem({
      wheel: selectedWheel,
      deck: selectedDeck,
      truck: selectedTruck,
      bolt: selectedBolt,
      price: 150, // Default price, can be customized later
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      className="inline-flex items-center gap-2 rounded-full bg-lime-400 px-6 py-3 font-bold text-black transition-colors hover:bg-lime-300"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
      Add to cart
    </button>
  );
}
