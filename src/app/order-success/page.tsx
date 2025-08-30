"use client";

import React, { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ButtonLink";
import { Heading } from "@/components/Heading";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface OrderDetails {
  orderId: string;
  items: unknown[];
  totalAmount: number;
  paymentId: string;
}

export default function OrderSuccessPage() {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    // In a real app, you'd fetch the order details from the database
    // For now, we'll just show a success message
    const mockOrderDetails = {
      orderId: `ORDER_${Date.now()}`,
      items: [],
      totalAmount: 0,
      paymentId: "PAY_" + Math.random().toString(36).substr(2, 9).toUpperCase(),
    };
    setOrderDetails(mockOrderDetails);
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-zinc-900 text-white py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-600">
            <svg
              className="h-12 w-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <Heading as="h1" size="lg" className="mb-4 text-green-400">
            Order Successful!
          </Heading>

          <p className="mb-8 text-xl text-zinc-300">
            Thank you for your purchase. Your custom skateboard is being prepared!
          </p>

          {/* Order Details */}
          <div className="mx-auto mb-8 max-w-md rounded-lg bg-zinc-800 p-6">
            <h2 className="mb-4 text-lg font-bold">Order Details</h2>
            <div className="space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-zinc-400">Order ID:</span>
                <span className="font-mono text-sm">{orderDetails?.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Payment ID:</span>
                <span className="font-mono text-sm">{orderDetails?.paymentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Status:</span>
                <span className="text-green-400">Completed</span>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="mb-8 rounded-lg bg-zinc-800 p-6">
            <h3 className="mb-4 text-lg font-bold">What Next?</h3>
            <div className="grid gap-4 text-left md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-brand-purple">
                  <span className="text-lg font-bold">1</span>
                </div>
                <p className="text-sm text-zinc-400">Order Processing</p>
                <p className="text-xs text-zinc-500">2-3 business days</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-brand-lime">
                  <span className="text-lg font-bold text-black">2</span>
                </div>
                <p className="text-sm text-zinc-400">Quality Check</p>
                <p className="text-xs text-zinc-500">Assembly & testing</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-600">
                  <span className="text-lg font-bold">3</span>
                </div>
                <p className="text-sm text-zinc-400">Shipping</p>
                <p className="text-xs text-zinc-500">Fast delivery</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <ButtonLink href="/build" color="lime" icon="plus">
              Build Another Board
            </ButtonLink>
            <Link
              href="/"
              className="rounded-lg bg-zinc-700 px-6 py-3 text-center font-bold hover:bg-zinc-600 transition-colors"
            >
              Back to Home
            </Link>
          </div>

          {/* Contact Info */}
          <div className="mt-8 text-center text-sm text-zinc-400">
            <p>Questions about your order?</p>
            <p>
              Contact us at{" "}
              <a
                href="mailto:support@suburbia.com"
                className="text-brand-lime hover:underline"
              >
                support@suburbia.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}