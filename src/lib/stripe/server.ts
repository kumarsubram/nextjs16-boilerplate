import Stripe from "stripe";

/**
 * Server-side Stripe client
 *
 * Use this for all server-side Stripe operations.
 * Never expose the secret key to the client.
 *
 * IMPORTANT: Stripe is optional. Check isStripeConfigured() before using.
 */

// Lazy-loaded Stripe instance
let stripeInstance: Stripe | null = null;

/**
 * Check if Stripe is configured
 *
 * Returns true if the required environment variables are set.
 * Use this to conditionally show/hide payment features.
 */
export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

/**
 * Get the Stripe instance
 *
 * Throws if Stripe is not configured.
 * Use isStripeConfigured() first to check availability.
 */
export function getStripe(): Stripe {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error(
        "Stripe is not configured. Set STRIPE_SECRET_KEY environment variable."
      );
    }
    stripeInstance = new Stripe(key, {
      apiVersion: "2025-12-15.clover",
      typescript: true,
    });
  }
  return stripeInstance;
}

/**
 * Legacy export for backwards compatibility
 * @deprecated Use getStripe() instead for proper error handling
 */
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return (getStripe() as Record<string | symbol, unknown>)[prop];
  },
});

/**
 * Checkout Session Options
 */
export interface StripeCheckoutOptions {
  priceId: string;
  customerId?: string;
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
  mode?: "payment" | "subscription";
  metadata?: Record<string, string>;
  trialPeriodDays?: number;
}

/**
 * Create a Checkout Session
 *
 * Use this to redirect users to Stripe Checkout.
 *
 * @example
 * const session = await createCheckoutSession({
 *   priceId: "price_xxx",
 *   customerEmail: user.email,
 *   successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
 *   cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
 * });
 * redirect(session.url);
 */
export async function createCheckoutSession(
  options: StripeCheckoutOptions
): Promise<Stripe.Checkout.Session> {
  const stripe = getStripe();
  const {
    priceId,
    customerId,
    customerEmail,
    successUrl,
    cancelUrl,
    mode = "subscription",
    metadata,
    trialPeriodDays,
  } = options;

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl,
    metadata,
  };

  // Set customer or email
  if (customerId) {
    sessionParams.customer = customerId;
  } else if (customerEmail) {
    sessionParams.customer_email = customerEmail;
  }

  // Add trial period for subscriptions
  if (mode === "subscription" && trialPeriodDays) {
    sessionParams.subscription_data = {
      trial_period_days: trialPeriodDays,
    };
  }

  return stripe.checkout.sessions.create(sessionParams);
}

/**
 * Customer Portal Options
 */
export interface StripePortalOptions {
  customerId: string;
  returnUrl: string;
}

/**
 * Create a Customer Portal Session
 *
 * Use this to let customers manage their subscriptions.
 *
 * @example
 * const portal = await createPortalSession({
 *   customerId: customer.stripeCustomerId,
 *   returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/account`,
 * });
 * redirect(portal.url);
 */
export async function createPortalSession(
  options: StripePortalOptions
): Promise<Stripe.BillingPortal.Session> {
  const stripe = getStripe();
  return stripe.billingPortal.sessions.create({
    customer: options.customerId,
    return_url: options.returnUrl,
  });
}

/**
 * Create or Retrieve a Stripe Customer
 *
 * Creates a new Stripe customer or retrieves existing one by email.
 */
export async function getOrCreateCustomer(
  email: string,
  name?: string
): Promise<Stripe.Customer> {
  const stripe = getStripe();

  // Search for existing customer
  const existingCustomers = await stripe.customers.list({
    email,
    limit: 1,
  });

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0]!;
  }

  // Create new customer
  return stripe.customers.create({
    email,
    name,
  });
}

/**
 * Cancel a Subscription
 *
 * Cancels at period end by default (lets user keep access until paid period ends).
 */
export async function cancelSubscription(
  subscriptionId: string,
  immediately = false
): Promise<Stripe.Subscription> {
  const stripe = getStripe();

  if (immediately) {
    return stripe.subscriptions.cancel(subscriptionId);
  }

  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
}

/**
 * Resume a Subscription
 *
 * Resumes a subscription that was set to cancel at period end.
 */
export async function resumeSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  const stripe = getStripe();
  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });
}

/**
 * Verify Webhook Signature
 *
 * Use this in your webhook handler to verify the request is from Stripe.
 */
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error("Missing STRIPE_WEBHOOK_SECRET environment variable");
  }

  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}
