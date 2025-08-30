"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { ButtonLink } from "@/components/ButtonLink";
import { Heading } from "@/components/Heading";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}


export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  // All hooks must be called before any early returns
  useEffect(() => {
    // Check if Razorpay is loaded (it should be loaded from layout)
    const checkRazorpay = () => {
      if (typeof window.Razorpay !== 'undefined') {
        console.log('Razorpay is available');
        setIsRazorpayLoaded(true);
      } else {
        console.log('Razorpay not yet available, checking again...');
        setTimeout(checkRazorpay, 1000);
      }
    };

    checkRazorpay();
  }, []);

  // Check authentication
  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }
  }, [session, status, router]);

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-white text-xl">Checking authentication...</div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!session) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-white text-xl">Redirecting to login...</div>
      </div>
    );
  }

  const handlePayment = () => {
    console.log('Payment button clicked');
    console.log('isRazorpayLoaded:', isRazorpayLoaded);
    console.log('window.Razorpay:', typeof window.Razorpay);

    setIsProcessing(true);

    // Check if Razorpay is loaded first
    if (!isRazorpayLoaded || typeof window.Razorpay === 'undefined') {
      console.error('Razorpay not available');
      alert('Razorpay SDK not loaded. Please wait a moment and try again.');
      setIsProcessing(false);
      return;
    }

    // Create order on the server
fetch("/api/payment/create-order", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    items,
    totalAmount: totalPrice,
  }),
})
  .then((response) => response.json())
  .then((orderData) => {
    if (!orderData.id) {
      throw new Error(orderData.error || "Failed to create order");
    }

    // Convert USD to INR for display (same rate as API)
    const exchangeRate = 83;
    const amountInINR = totalPrice * exchangeRate;

    // Initialize Razorpay
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Suburbia Skateboards",
      description: `Custom Skateboard Purchase - $${totalPrice.toFixed(2)} USD (₹${amountInINR.toFixed(2)} INR)`,
      order_id: orderData.id,
          handler: function (response: RazorpayResponse) {
            // Handle successful payment
            fetch("/api/payment/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                items,
                totalAmount: totalPrice,
              }),
            })
              .then((verifyResponse) => {
                if (verifyResponse.ok) {
                  clearCart();
                  window.location.href = "/order-success";
                } else {
                  alert("Payment verification failed. Please contact support.");
                }
              })
              .catch((error) => {
                console.error("Payment verification error:", error);
                alert("Payment verification failed. Please contact support.");
              });
          },
          prefill: {
            name: "Customer Name",
            email: "customer@example.com",
            contact: "9999999999",
          },
          theme: {
            color: "#d9f154",
          },
        };

        console.log('Creating Razorpay instance with options:', options);
        const rzp = new window.Razorpay(options);
        console.log('Razorpay instance created:', rzp);
        rzp.open();
      })
      .catch((error) => {
        console.error("Payment error:", error);
        alert("Failed to initiate payment. Please try again.");
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };

  if (items.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-zinc-900 text-white py-16">
          <div className="mx-auto max-w-4xl px-4">
            <Heading as="h1" size="lg" className="mb-8 text-center">
              Checkout
            </Heading>
            <div className="text-center">
              <p className="mb-8 text-xl">Your cart is empty</p>
              <ButtonLink href="/build" color="lime" icon="plus">
                Build Your Board
              </ButtonLink>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-zinc-900 text-white py-16">
        <div className="mx-auto max-w-4xl px-4">
          <Heading as="h1" size="lg" className="mb-8">
            Checkout
          </Heading>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Order Summary */}
          <div className="space-y-6">
            <div className="rounded-lg bg-zinc-800 p-6">
              <h2 className="mb-4 text-xl font-bold">Order Summary</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 border-b border-zinc-700 pb-4">
                    <div className="flex-1">
                      <h3 className="font-bold">Custom Skateboard</h3>
                      <div className="mt-1 space-y-1 text-sm text-zinc-400">
                        <p>Wheel: {item.wheel.uid}</p>
                        <p>Deck: {item.deck.uid}</p>
                        <p>Truck: {item.truck.uid}</p>
                        <p>Bolt: {item.bolt.uid}</p>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t border-zinc-700 pt-4">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="space-y-6">
            <div className="rounded-lg bg-zinc-800 p-6">
              <h2 className="mb-4 text-xl font-bold">Payment Details</h2>
              <div className="space-y-4">
                <div className="rounded-lg bg-zinc-700 p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center">
                      <span className="text-sm font-bold text-white">₹</span>
                    </div>
                    <div>
                      <p className="font-medium">Razorpay</p>
                      <p className="text-sm text-zinc-400">Secure payment gateway</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-zinc-700 p-4">
                  <h3 className="mb-2 font-medium">Amount Breakdown</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Total in USD:</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total in INR:</span>
                      <span>₹{(totalPrice * 83).toFixed(2)}</span>
                    </div>
                    <div className="text-xs text-zinc-400 mt-2">
                      Exchange rate: 1 USD = 83 INR (approximate)
                    </div>
                  </div>
                </div>

                <div className="text-sm text-zinc-400">
                  <p>• Secure SSL encryption</p>
                  <p>• Multiple payment options</p>
                  <p>• Instant confirmation</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Link
                href="/cart"
                className="flex-1 rounded-lg bg-zinc-700 px-6 py-3 text-center font-bold hover:bg-zinc-600 transition-colors"
              >
                Back to Cart
              </Link>
              <button
                onClick={handlePayment}
                disabled={isProcessing || !isRazorpayLoaded}
                className="flex-1 rounded-lg bg-gradient-to-r from-brand-purple to-brand-lime px-6 py-3 font-bold text-black hover:from-brand-purple/80 hover:to-brand-lime/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Processing..." : !isRazorpayLoaded ? "Loading Payment Gateway..." : `Pay $${totalPrice.toFixed(2)}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </>
);
    }