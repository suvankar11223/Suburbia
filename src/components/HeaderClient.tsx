"use client";

import Link from "next/link";
import React from "react";
import { ButtonLink } from "./ButtonLink";
import { Logo } from "./Logo";
import { PrismicNextLink } from "@prismicio/next";
import { useCart } from "@/lib/cart-context";
import { Content } from "@prismicio/client";
import { useSession, signOut } from "next-auth/react";

type HeaderClientProps = {
  settings: Content.SettingsDocument | null;
};

export function HeaderClient({ settings }: HeaderClientProps) {
  const { totalItems } = useCart();
  const { data: session } = useSession();

  return (
    <header className="header absolute left-0 right-0 top-0 z-50 ~h-32/48 ~px-4/6 ~py-4/6 hd:h-32">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-[auto,auto] items-center gap-6 md:grid-cols-[1fr,auto,1fr]">
        <Link href="/" className="justify-self-start">
          <Logo className="text-brand-purple ~h-12/20" />
        </Link>
        <nav
          aria-label="Main"
          className="col-span-full row-start-2 md:col-span-1 md:col-start-2 md:row-start-1"
        >
          <ul className="flex flex-wrap items-center justify-center gap-8">
            {settings?.data.navigation?.map((item) => (
              <li key={item.link.text}>
                <PrismicNextLink field={item.link} className="~text-lg/xl" />
              </li>
            )) || []}
          </ul>
        </nav>
        <div className="justify-self-end flex items-center gap-4">
          {session ? (
            <button
              onClick={() => signOut()}
              className="button-cutout group inline-flex items-center bg-gradient-to-b from-25% to-75% bg-[length:100%_400%] font-bold transition-[filter,background-position] duration-300 hover:bg-bottom from-brand-purple to-brand-lime text-white hover:text-black ~text-lg/xl ~px-1/2 ~py-2.5/3"
              aria-label="Logout"
            >
              <span className="md:hidden">Logout</span>
              <span className="hidden md:inline">Logout</span>
            </button>
          ) : (
            <ButtonLink href="/login" icon="user" color="purple" aria-label="Login">
              <span className="md:hidden">Login</span>
              <span className="hidden md:inline">Login</span>
            </ButtonLink>
          )}
          <ButtonLink href="/cart" icon="cart" color="purple" aria-label={`Cart (${totalItems})`}>
            <span className="md:hidden">{totalItems}</span>
            <span className="hidden md:inline">Cart ({totalItems})</span>
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}