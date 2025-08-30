"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/prismicio";
import { HeaderClient } from "./HeaderClient";
import { Content } from "@prismicio/client";

export function Header() {
  const [settings, setSettings] = useState<Content.SettingsDocument | null>(null);

  useEffect(() => {
    const fetchSettings = () => {
      const client = createClient();
      client.getSingle("settings")
        .then((settingsData) => {
          setSettings(settingsData);
        })
        .catch((error) => {
          console.error("Failed to fetch settings:", error);
        });
    };

    fetchSettings();
  }, []);

  return <HeaderClient settings={settings} />;
}
