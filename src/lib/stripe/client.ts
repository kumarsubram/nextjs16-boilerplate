"use client";

import { loadStripe, type Stripe } from "@stripe/stripe-js";

/**
 * Client-side Stripe loader
 *
 * Lazy loads Stripe.js for optimal performance.
 * Only loads when first called (e.g., when user reaches checkout).
 */

let stripePromise: Promise<Stripe | null> | null = null;

function getPublishableKey(): string {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!key) {
    throw new Error(
      "Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable"
    );
  }
  return key;
}

/**
 * Get Stripe instance (client-side)
 *
 * @example
 * const stripe = await getStripe();
 * await stripe.redirectToCheckout({ sessionId });
 */
export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    stripePromise = loadStripe(getPublishableKey());
  }
  return stripePromise;
}
