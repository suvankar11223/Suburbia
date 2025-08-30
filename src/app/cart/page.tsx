"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { ButtonLink } from "@/components/ButtonLink";
import { Heading } from "@/components/Heading";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <Heading as="h1" size="lg" className="mb-8 text-center">
            Your Cart
          </Heading>
          <div className="text-center">
            <p className="mb-8 text-xl">Your cart is empty</p>
            <ButtonLink href="/build" color="lime" icon="plus">
              Build Your Board
            </ButtonLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="mx-auto max-w-4xl px-4 py-16">
        <Heading as="h1" size="lg" className="mb-8">
          Your Cart
        </Heading>

        <div className="space-y-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-6 rounded-lg bg-zinc-800 p-6"
            >
              <div className="flex-1">
                <h3 className="text-lg font-bold">Custom Skateboard</h3>
                <div className="mt-2 space-y-1 text-sm text-zinc-400">
                  <p>Wheel: {item.wheel.uid}</p>
                  <p>Deck: {item.deck.uid}</p>
                  <p>Truck: {item.truck.uid}</p>
                  <p>Bolt: {item.bolt.uid}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="rounded bg-zinc-700 px-3 py-1 hover:bg-zinc-600"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="rounded bg-zinc-700 px-3 py-1 hover:bg-zinc-600"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-sm text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-lg bg-zinc-800 p-6">
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold">Total: ${totalPrice.toFixed(2)}</span>
            <div className="flex gap-4">
              <button
                onClick={clearCart}
                className="rounded bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-500"
              >
                Clear Cart
              </button>
              <ButtonLink href="/checkout" color="lime">
                Proceed to Checkout
              </ButtonLink>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/build"
            className="text-lime-400 hover:text-lime-300 underline"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}