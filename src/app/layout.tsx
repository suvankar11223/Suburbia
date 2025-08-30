import type { Metadata } from "next";
import { Bowlby_One_SC, DM_Mono } from "next/font/google";
import { Suspense } from "react";

import "./globals.css";
import { SVGFilters } from "@/components/SVGFilters";
import { createClient } from "@/prismicio";
import { Providers } from "@/components/Providers";

const bowlby = Bowlby_One_SC({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bowlby-sc",
  weight: "400",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-mono",
  weight: "500",
});

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const settings = await client.getSingle("settings");

  return {
    title: settings.data.site_title,
    description: settings.data.meta_description,
    openGraph: {
      images: settings.data.fallback_og_image.url ?? undefined,
    },
  };
}

function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Providers>{children}</Providers>
    </Suspense>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          src="https://checkout.razorpay.com/v1/checkout.js"
          async
        />
      </head>
      <body
        className={`${bowlby.variable} ${dmMono.variable} antialiased font-mono font-medium text-zinc-800`}
      >
        <ClientProviders>
          <main>{children}</main>
        </ClientProviders>
        <SVGFilters />
      </body>
    </html>
  );
}
