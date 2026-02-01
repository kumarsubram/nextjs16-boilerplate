"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { eq, sum } from "drizzle-orm";

import { db } from "@/db";
import { stripeCustomer, stripeSubscription, stripePayment } from "@/db/schema";
import { auth } from "@/lib/auth";
import {
  createCheckoutSession,
  createPortalSession,
  getOrCreateCustomer,
  cancelSubscription,
  resumeSubscription,
  isStripeConfigured,
} from "@/lib/stripe/server";
import type { ActionResult } from "@/types";

import { ensureUserProfile } from "./roles";

/**
 * Stripe Server Actions
 *
 * Server actions for Stripe operations.
 * All actions require authentication.
 * Stripe integration is optional - actions will fail gracefully if not configured.
 */

/**
 * Check if Stripe is available
 */
export async function isStripeAvailable(): Promise<boolean> {
  return isStripeConfigured();
}

/**
 * Create a subscription checkout session and redirect to Stripe Checkout
 */
export async function createSubscriptionCheckout(
  priceId: string
): Promise<never> {
  if (!isStripeConfigured()) {
    throw new Error("Stripe is not configured");
  }

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/login");
  }

  // Ensure user profile exists
  await ensureUserProfile(session.user.id);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const customerId = await getOrCreateStripeCustomer(session.user);

  const checkoutSession = await createCheckoutSession({
    priceId,
    customerId,
    mode: "subscription",
    successUrl: `${appUrl}/checkout/success`,
    cancelUrl: `${appUrl}/pricing`,
    metadata: {
      userId: session.user.id,
      type: "subscription",
    },
  });

  if (!checkoutSession.url) {
    throw new Error("Failed to create checkout session");
  }

  redirect(checkoutSession.url);
}

/**
 * Create a donation checkout session and redirect to Stripe Checkout
 *
 * @param priceId - The Stripe price ID for the donation amount
 * @param customAmount - Optional custom amount in cents (if using custom donation amounts)
 */
export async function createDonationCheckout(priceId: string): Promise<never> {
  if (!isStripeConfigured()) {
    throw new Error("Stripe is not configured");
  }

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/login");
  }

  // Ensure user profile exists
  await ensureUserProfile(session.user.id);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const customerId = await getOrCreateStripeCustomer(session.user);

  const checkoutSession = await createCheckoutSession({
    priceId,
    customerId,
    mode: "payment", // One-time payment for donations
    successUrl: `${appUrl}/donate/thank-you`,
    cancelUrl: `${appUrl}/donate`,
    metadata: {
      userId: session.user.id,
      type: "donation",
    },
  });

  if (!checkoutSession.url) {
    throw new Error("Failed to create checkout session");
  }

  redirect(checkoutSession.url);
}

/**
 * Create a portal session and redirect to Stripe Customer Portal
 */
export async function openCustomerPortal(): Promise<never> {
  if (!isStripeConfigured()) {
    throw new Error("Stripe is not configured");
  }

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/login");
  }

  const [customer] = await db
    .select()
    .from(stripeCustomer)
    .where(eq(stripeCustomer.userId, session.user.id))
    .limit(1);

  if (!customer) {
    redirect("/pricing");
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const portalSession = await createPortalSession({
    customerId: customer.stripeCustomerId,
    returnUrl: `${appUrl}/account`,
  });

  redirect(portalSession.url);
}

/**
 * Get the current user's subscription
 */
export async function getMySubscription(): Promise<
  ActionResult<typeof stripeSubscription.$inferSelect | null>
> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    const [subscription] = await db
      .select()
      .from(stripeSubscription)
      .where(eq(stripeSubscription.userId, session.user.id))
      .limit(1);

    return { success: true, data: subscription ?? null };
  } catch (error) {
    console.error("Failed to get subscription:", error);
    return { success: false, error: "Failed to get subscription" };
  }
}

/**
 * Get the current user's donation history
 */
export async function getMyDonations(): Promise<
  ActionResult<(typeof stripePayment.$inferSelect)[]>
> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    const donations = await db
      .select()
      .from(stripePayment)
      .where(eq(stripePayment.userId, session.user.id));

    return { success: true, data: donations };
  } catch (error) {
    console.error("Failed to get donations:", error);
    return { success: false, error: "Failed to get donations" };
  }
}

/**
 * Get the current user's total donation amount
 */
export async function getMyTotalDonations(): Promise<ActionResult<number>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    const [result] = await db
      .select({ total: sum(stripePayment.amount) })
      .from(stripePayment)
      .where(eq(stripePayment.userId, session.user.id));

    return { success: true, data: Number(result?.total ?? 0) };
  } catch (error) {
    console.error("Failed to get total donations:", error);
    return { success: false, error: "Failed to get total donations" };
  }
}

/**
 * Cancel the current user's subscription
 *
 * By default, cancels at period end (user keeps access until paid period ends).
 */
export async function cancelMySubscription(
  immediately = false
): Promise<ActionResult<null>> {
  if (!isStripeConfigured()) {
    return { success: false, error: "Stripe is not configured" };
  }

  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    const [subscription] = await db
      .select()
      .from(stripeSubscription)
      .where(eq(stripeSubscription.userId, session.user.id))
      .limit(1);

    if (!subscription) {
      return { success: false, error: "No subscription found" };
    }

    await cancelSubscription(subscription.stripeSubscriptionId, immediately);

    return { success: true, data: null };
  } catch (error) {
    console.error("Failed to cancel subscription:", error);
    return { success: false, error: "Failed to cancel subscription" };
  }
}

/**
 * Resume a subscription that was set to cancel
 */
export async function resumeMySubscription(): Promise<ActionResult<null>> {
  if (!isStripeConfigured()) {
    return { success: false, error: "Stripe is not configured" };
  }

  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    const [subscription] = await db
      .select()
      .from(stripeSubscription)
      .where(eq(stripeSubscription.userId, session.user.id))
      .limit(1);

    if (!subscription) {
      return { success: false, error: "No subscription found" };
    }

    if (!subscription.cancelAtPeriodEnd) {
      return { success: false, error: "Subscription is not set to cancel" };
    }

    await resumeSubscription(subscription.stripeSubscriptionId);

    return { success: true, data: null };
  } catch (error) {
    console.error("Failed to resume subscription:", error);
    return { success: false, error: "Failed to resume subscription" };
  }
}

/**
 * Check if current user has an active subscription
 */
export async function hasActiveSubscription(): Promise<boolean> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return false;
  }

  const [subscription] = await db
    .select()
    .from(stripeSubscription)
    .where(eq(stripeSubscription.userId, session.user.id))
    .limit(1);

  if (!subscription) {
    return false;
  }

  return ["active", "trialing"].includes(subscription.status);
}

/**
 * Helper: Get or create Stripe customer for user
 */
async function getOrCreateStripeCustomer(user: {
  id: string;
  email: string;
  name: string;
}): Promise<string> {
  const [existingCustomer] = await db
    .select()
    .from(stripeCustomer)
    .where(eq(stripeCustomer.userId, user.id))
    .limit(1);

  if (existingCustomer) {
    return existingCustomer.stripeCustomerId;
  }

  // Create new customer in Stripe
  const customer = await getOrCreateCustomer(user.email, user.name);

  // Store in database
  await db.insert(stripeCustomer).values({
    id: crypto.randomUUID(),
    userId: user.id,
    stripeCustomerId: customer.id,
    email: user.email,
    name: user.name,
  });

  return customer.id;
}
