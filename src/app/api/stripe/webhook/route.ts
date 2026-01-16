import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe, constructWebhookEvent } from "@/lib/stripe/server";
import { db } from "@/db";
import {
  stripeCustomer,
  stripeSubscription,
  stripeProduct,
  stripePrice,
} from "@/db/schema";
import { eq } from "drizzle-orm";

// Force dynamic rendering - webhooks require runtime environment variables
export const dynamic = "force-dynamic";

/**
 * Stripe Webhook Handler
 *
 * Handles webhook events from Stripe.
 * Configure this URL in your Stripe Dashboard: /api/stripe/webhook
 *
 * Required events to enable in Stripe Dashboard:
 * - checkout.session.completed
 * - customer.subscription.created
 * - customer.subscription.updated
 * - customer.subscription.deleted
 * - invoice.paid
 * - invoice.payment_failed
 * - product.created
 * - product.updated
 * - price.created
 * - price.updated
 *
 * @see https://docs.stripe.com/webhooks
 */

export async function POST(request: Request) {
  // Check if Stripe is configured
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 503 }
    );
  }
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = constructWebhookEvent(body, signature);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionUpsert(
          event.data.object as Stripe.Subscription
        );
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription
        );
        break;

      case "invoice.paid":
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case "product.created":
      case "product.updated":
        await handleProductUpsert(event.data.object as Stripe.Product);
        break;

      case "price.created":
      case "price.updated":
        await handlePriceUpsert(event.data.object as Stripe.Price);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`Error processing webhook ${event.type}:`, error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

/**
 * Handle checkout.session.completed
 *
 * Called when a customer completes checkout.
 * Creates/updates customer and subscription records.
 */
async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  // Get customer details from Stripe
  const customer = await stripe.customers.retrieve(customerId);
  if (customer.deleted) return;

  // Get user ID from metadata (you should set this when creating the checkout session)
  const userId = session.metadata?.userId;
  if (!userId) {
    console.error("No userId in checkout session metadata");
    return;
  }

  // Upsert customer
  await db
    .insert(stripeCustomer)
    .values({
      id: crypto.randomUUID(),
      userId,
      stripeCustomerId: customerId,
      email: customer.email,
      name: customer.name,
    })
    .onConflictDoUpdate({
      target: stripeCustomer.userId,
      set: {
        stripeCustomerId: customerId,
        email: customer.email,
        name: customer.name,
        updatedAt: new Date(),
      },
    });

  // If subscription, fetch and store it
  if (subscriptionId) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    await handleSubscriptionUpsert(subscription, userId);
  }
}

/**
 * Handle subscription created/updated
 */
async function handleSubscriptionUpsert(
  subscription: Stripe.Subscription,
  userId?: string
) {
  // If no userId provided, look it up from the customer
  if (!userId) {
    const [customer] = await db
      .select()
      .from(stripeCustomer)
      .where(
        eq(stripeCustomer.stripeCustomerId, subscription.customer as string)
      )
      .limit(1);

    userId = customer?.userId;
    if (!userId) {
      console.error("No user found for subscription:", subscription.id);
      return;
    }
  }

  const priceId = subscription.items.data[0]?.price.id;
  if (!priceId) return;

  // Access subscription period from items (Stripe API v2025)
  const subscriptionItem = subscription.items.data[0];
  const currentPeriodStart = subscriptionItem?.current_period_start
    ? new Date(subscriptionItem.current_period_start * 1000)
    : null;
  const currentPeriodEnd = subscriptionItem?.current_period_end
    ? new Date(subscriptionItem.current_period_end * 1000)
    : null;

  await db
    .insert(stripeSubscription)
    .values({
      id: crypto.randomUUID(),
      userId,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      stripePriceId: priceId,
      status: subscription.status,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      currentPeriodStart,
      currentPeriodEnd,
      canceledAt: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000)
        : null,
      trialStart: subscription.trial_start
        ? new Date(subscription.trial_start * 1000)
        : null,
      trialEnd: subscription.trial_end
        ? new Date(subscription.trial_end * 1000)
        : null,
      metadata: subscription.metadata as Record<string, string>,
    })
    .onConflictDoUpdate({
      target: stripeSubscription.stripeSubscriptionId,
      set: {
        stripePriceId: priceId,
        status: subscription.status,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        currentPeriodStart,
        currentPeriodEnd,
        canceledAt: subscription.canceled_at
          ? new Date(subscription.canceled_at * 1000)
          : null,
        trialStart: subscription.trial_start
          ? new Date(subscription.trial_start * 1000)
          : null,
        trialEnd: subscription.trial_end
          ? new Date(subscription.trial_end * 1000)
          : null,
        metadata: subscription.metadata as Record<string, string>,
        updatedAt: new Date(),
      },
    });
}

/**
 * Handle subscription deleted
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await db
    .update(stripeSubscription)
    .set({
      status: "canceled",
      canceledAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(stripeSubscription.stripeSubscriptionId, subscription.id));
}

/**
 * Handle invoice paid
 *
 * Continues to provision access for recurring payments.
 */
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  // Get subscription ID from parent field (Stripe API v2025)
  const subscriptionId =
    typeof invoice.parent?.subscription_details?.subscription === "string"
      ? invoice.parent.subscription_details.subscription
      : null;

  if (!subscriptionId) return;

  // Update subscription status to active
  await db
    .update(stripeSubscription)
    .set({
      status: "active",
      updatedAt: new Date(),
    })
    .where(eq(stripeSubscription.stripeSubscriptionId, subscriptionId));
}

/**
 * Handle invoice payment failed
 *
 * Notifies user to update payment method.
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  // Get subscription ID from parent field (Stripe API v2025)
  const subscriptionId =
    typeof invoice.parent?.subscription_details?.subscription === "string"
      ? invoice.parent.subscription_details.subscription
      : null;

  if (!subscriptionId) return;

  // Update subscription status
  await db
    .update(stripeSubscription)
    .set({
      status: "past_due",
      updatedAt: new Date(),
    })
    .where(eq(stripeSubscription.stripeSubscriptionId, subscriptionId));

  // TODO: Send email notification to customer
  // const customer = await db.select().from(stripeCustomer)...
  // await sendEmail({ to: customer.email, template: "payment-failed" });
}

/**
 * Handle product created/updated
 *
 * Syncs product data from Stripe to database.
 */
async function handleProductUpsert(product: Stripe.Product) {
  await db
    .insert(stripeProduct)
    .values({
      id: crypto.randomUUID(),
      stripeProductId: product.id,
      name: product.name,
      description: product.description,
      active: product.active,
      metadata: product.metadata as Record<string, string>,
    })
    .onConflictDoUpdate({
      target: stripeProduct.stripeProductId,
      set: {
        name: product.name,
        description: product.description,
        active: product.active,
        metadata: product.metadata as Record<string, string>,
        updatedAt: new Date(),
      },
    });
}

/**
 * Handle price created/updated
 *
 * Syncs price data from Stripe to database.
 */
async function handlePriceUpsert(price: Stripe.Price) {
  await db
    .insert(stripePrice)
    .values({
      id: crypto.randomUUID(),
      stripePriceId: price.id,
      stripeProductId: price.product as string,
      active: price.active,
      currency: price.currency,
      unitAmount: price.unit_amount,
      type: price.type,
      interval: price.recurring?.interval,
      intervalCount: price.recurring?.interval_count,
      trialPeriodDays: price.recurring?.trial_period_days,
      metadata: price.metadata as Record<string, string>,
    })
    .onConflictDoUpdate({
      target: stripePrice.stripePriceId,
      set: {
        active: price.active,
        currency: price.currency,
        unitAmount: price.unit_amount,
        type: price.type,
        interval: price.recurring?.interval,
        intervalCount: price.recurring?.interval_count,
        trialPeriodDays: price.recurring?.trial_period_days,
        metadata: price.metadata as Record<string, string>,
        updatedAt: new Date(),
      },
    });
}
