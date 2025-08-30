"use client";

import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import React, { useEffect, useState } from "react";
import { asImageSrc } from "@prismicio/client";

import { createClient } from "@/prismicio";
import { Logo } from "@/components/Logo";
import { Bounded } from "./Bounded";
import { FooterPhysics3D } from "./FooterPhysics3D";
import { Content } from "@prismicio/client";

export function Footer() {
  const [settings, setSettings] = useState<Content.SettingsDocument | null>(null);
  const [loading, setLoading] = useState(true);

  // Use static skateboard images from public/images
  const boardTextureURLs = [
    '/images/black-yellow-complete.png',
    '/images/gray-black-complete.png',
    '/images/green-navy-complete.png',
    '/images/grid-streaks-complete.png',
    '/images/onimask-complete.png',
    '/images/pink-drop-complete.png',
    '/images/red-black-complete.png',
    '/images/red-white-complete.png',
    '/images/yellow-black-complete.png',
  ];

  useEffect(() => {
    const fetchSettings = () => {
      const client = createClient();
      client.getSingle("settings")
        .then((settingsData) => {
          setSettings(settingsData);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch settings:", error);
          setLoading(false);
        });
    };

    fetchSettings();
  }, []);

  if (loading || !settings) {
    return (
      <footer className="bg-texture bg-zinc-900 text-white overflow-hidden">
        <div className="relative h-[75vh] ~p-10/16 md:aspect-auto">
          <FooterPhysics3D className="absolute inset-0 overflow-hidden" />
          <Logo className="pointer-events-none relative h-20 mix-blend-exclusion md:h-28" />
        </div>
        <Bounded as="nav">
          <ul className="flex flex-wrap justify-center gap-8 ~text-lg/xl">
            <li>Loading...</li>
          </ul>
        </Bounded>
      </footer>
    );
  }

  console.log('Footer boardTextureURLs:', boardTextureURLs);
  console.log('Footer image field:', settings.data.footer_image);
  console.log('Footer image URL:', asImageSrc(settings.data.footer_image));

  return (
    <footer className="bg-texture bg-zinc-900 text-white overflow-hidden">
      <div className="relative h-[75vh] ~p-10/16 md:aspect-auto">
        <PrismicNextImage
          field={settings.data.footer_image}
          alt=""
          fill
          className="object-cover"
          width={1200}
        />
        <FooterPhysics3D
          className="absolute inset-0 overflow-hidden"
        />
        <Logo className="pointer-events-none relative h-20 mix-blend-exclusion md:h-28" />
      </div>
      <Bounded as="nav">
        <ul className="flex flex-wrap justify-center gap-8 ~text-lg/xl">
          {settings.data.navigation?.map((item) => (
            <li key={item.link.text} className="hover:underline">
              <PrismicNextLink field={item.link} />
            </li>
          ))}
        </ul>
      </Bounded>
      {/* List of links */}
    </footer>
  );
}

