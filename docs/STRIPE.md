# Stripe Integration Guide

This guide explains how to set up and use Stripe payments in this boilerplate. **Stripe is optional** - if you don't need payments, simply skip the Stripe environment variables and the integration won't be loaded.

## Table of Contents

1. [Overview](#overview)
2. [When to Use Stripe](#when-to-use-stripe)
3. [Setup](#setup)
4. [Payment Types](#payment-types)
5. [User Roles](#user-roles)
6. [Database Schema](#database-schema)
7. [Server Actions](#server-actions)
8. [Webhook Events](#webhook-events)
9. [Building a Pricing Page](#building-a-pricing-page)
10. [Building a Donation Page](#building-a-donation-page)
11. [Protecting Premium Content](#protecting-premium-content)
12. [Testing](#testing)
13. [Going to Production](#going-to-production)
14. [Common Patterns](#common-patterns)
15. [Troubleshooting](#troubleshooting)

---

## Overview

This boilerplate includes a complete Stripe integration that supports:

- **Subscriptions** - Recurring payments for SaaS products
- **One-time Donations** - Support/tip jar functionality
- **User Roles** - Automatic role management based on payment status
- **Customer Portal** - Let users manage their subscriptions
- **Webhook Handling** - Automatic database sync with Stripe

### Key Files

| File                                  | Purpose                                   |
| ------------------------------------- | ----------------------------------------- |
| `src/lib/stripe/server.ts`            | Server-side Stripe SDK wrapper            |
| `src/lib/stripe/client.ts`            | Client-side Stripe.js loader              |
| `src/db/schema/stripe.ts`             | Database tables for Stripe data           |
| `src/db/schema/users.ts`              | User roles and payment tracking           |
| `src/actions/stripe.ts`               | Server actions for checkout, portal, etc. |
| `src/actions/roles.ts`                | Role management actions                   |
| `src/app/api/stripe/webhook/route.ts` | Webhook handler                           |

---

## When to Use Stripe

### Use Stripe If You Need:

- ✅ **SaaS subscriptions** - Monthly/yearly plans
- ✅ **One-time purchases** - Digital products, courses
- ✅ **Donations/Tips** - Support your project
- ✅ **Premium features** - Gated content for paying users
- ✅ **Multiple pricing tiers** - Free, Pro, Enterprise

### Skip Stripe If:

- ❌ Your app is free with no paid features
- ❌ You're building an internal tool
- ❌ You handle payments through another provider

To skip Stripe, simply don't set the `STRIPE_SECRET_KEY` environment variable. The app will work normally without payment features.

---

## Setup

### 1. Create a Stripe Account

1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete business verification (for production)

### 2. Get API Keys

1. Go to [Stripe Dashboard > Developers > API Keys](https://dashboard.stripe.com/apikeys)
2. Copy your keys:
   - **Publishable key** (`pk_test_...`) - Safe for client-side
   - **Secret key** (`sk_test_...`) - Server-side only, never expose!

### 3. Configure Environment Variables

Add to `.env.local`:

```bash
# Stripe API Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here

# Webhook Secret (get from step 5)
STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
```

### 4. Create Products in Stripe

#### For Subscriptions:

1. Go to [Products](https://dashboard.stripe.com/products)
2. Click "Add product"
3. Fill in name, description
4. Add a **recurring** price (e.g., $10/month)
5. Copy the **Price ID** (`price_xxx`)

#### For Donations:

1. Create a product called "Donation" or "Support"
2. Add **one-time** prices for different amounts ($5, $10, $25, custom)
3. Copy the **Price IDs**

### 5. Set Up Webhooks

#### For Local Development:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the webhook signing secret that's displayed and add it to `.env.local`.

#### For Production:

1. Go to [Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. URL: `https://your-domain.com/api/stripe/webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
   - `product.created`
   - `product.updated`
   - `price.created`
   - `price.updated`
5. Copy the signing secret to your production environment

### 6. Push Database Schema

```bash
npm run db:push
```

---

## Payment Types

### Subscriptions

Recurring payments that automatically renew. Best for:

- SaaS products
- Membership sites
- Premium content access

```typescript
// In a client component
import { createSubscriptionCheckout } from "@/actions";

<form action={() => createSubscriptionCheckout("price_xxx")}>
  <button type="submit">Subscribe - $10/month</button>
</form>
```

### One-Time Donations

Single payments that don't recur. Best for:

- Support/tip jars
- Open source funding
- One-time purchases

```typescript
// In a client component
import { createDonationCheckout } from "@/actions";

<form action={() => createDonationCheckout("price_xxx")}>
  <button type="submit">Donate $10</button>
</form>
```

---

## User Roles

The boilerplate includes a role system that integrates with Stripe:

| Role        | Description               | How to Get                    |
| ----------- | ------------------------- | ----------------------------- |
| `admin`     | Full access to everything | Manually assigned in database |
| `paid_user` | Active subscription       | Automatic via webhook         |
| `donor`     | Made a donation           | Automatic via webhook         |
| `user`      | Free tier (default)       | Default for new users         |

### Role Hierarchy

```
admin > paid_user > donor > user
```

### Checking Roles

```typescript
import { isAdmin, hasPaidAccess, isDonor, getMyRole } from "@/actions";

// Check specific access levels
const isAdminUser = await isAdmin();
const canAccessPremium = await hasPaidAccess(); // admin OR paid_user
const hasSupported = await isDonor(); // admin, paid_user, OR donor

// Get the exact role
const result = await getMyRole();
if (result.success) {
  console.log(result.data); // "admin" | "paid_user" | "donor" | "user"
}
```

### Role Changes

Roles are updated automatically by webhooks:

- **Subscription created/paid** → Role set to `paid_user`
- **Subscription canceled** → Role downgraded to `donor` (if they donated) or `user`
- **Donation completed** → Role upgraded to `donor` (if currently `user`)

---

## Database Schema

### User Profile (`user_profile`)

```sql
- id              UUID PRIMARY KEY
- user_id         TEXT (references auth user)
- role            user_role ENUM ('admin', 'user', 'paid_user', 'donor')
- total_donations INTEGER (cents, for tracking)
- lifetime_value  INTEGER (cents, total spent)
- bio, location, website (profile fields)
- created_at, updated_at
```

### Stripe Customer (`stripe_customer`)

Links app users to Stripe customers.

```sql
- id                  TEXT PRIMARY KEY
- user_id             TEXT (references auth user)
- stripe_customer_id  TEXT UNIQUE
- email, name
- created_at, updated_at
```

### Stripe Subscription (`stripe_subscription`)

Tracks active subscriptions.

```sql
- id                      TEXT PRIMARY KEY
- user_id                 TEXT
- stripe_subscription_id  TEXT UNIQUE
- stripe_customer_id      TEXT
- stripe_price_id         TEXT
- status                  TEXT ('active', 'canceled', 'past_due', etc.)
- cancel_at_period_end    BOOLEAN
- current_period_start    TIMESTAMP
- current_period_end      TIMESTAMP
- canceled_at             TIMESTAMP
- trial_start, trial_end  TIMESTAMP
- metadata                JSONB
```

### Stripe Payment (`stripe_payment`)

Records one-time payments (donations).

```sql
- id                      TEXT PRIMARY KEY
- user_id                 TEXT
- stripe_payment_intent_id TEXT UNIQUE
- amount                  INTEGER (cents)
- currency                TEXT
- status                  TEXT
- payment_type            ENUM ('subscription', 'donation', 'one_time')
- description             TEXT
- metadata                JSONB
```

### Stripe Product & Price

Synced from Stripe for local queries.

---

## Server Actions

### Subscription Actions

```typescript
import {
  createSubscriptionCheckout, // Redirect to Stripe Checkout for subscription
  getMySubscription, // Get current subscription
  cancelMySubscription, // Cancel (at period end by default)
  resumeMySubscription, // Resume a pending cancellation
  hasActiveSubscription, // Quick check for active status
} from "@/actions";
```

### Donation Actions

```typescript
import {
  createDonationCheckout, // Redirect to Stripe Checkout for donation
  getMyDonations, // Get all donations
  getMyTotalDonations, // Get total amount donated
} from "@/actions";
```

### Portal Action

```typescript
import { openCustomerPortal } from "@/actions";

// Let users manage their subscriptions
<form action={openCustomerPortal}>
  <button type="submit">Manage Subscription</button>
</form>
```

### Availability Check

```typescript
import { isStripeAvailable } from "@/actions";

// Check if Stripe is configured before showing payment options
const stripeEnabled = await isStripeAvailable();
```

---

## Webhook Events

The webhook handler (`/api/stripe/webhook`) processes these events:

| Event                           | What Happens                                        |
| ------------------------------- | --------------------------------------------------- |
| `checkout.session.completed`    | Creates customer record, subscription, updates role |
| `customer.subscription.created` | Stores subscription, sets role to `paid_user`       |
| `customer.subscription.updated` | Updates subscription status                         |
| `customer.subscription.deleted` | Marks canceled, downgrades role                     |
| `invoice.paid`                  | Confirms subscription active                        |
| `invoice.payment_failed`        | Marks subscription `past_due`                       |
| `product.created/updated`       | Syncs product catalog                               |
| `price.created/updated`         | Syncs pricing                                       |

---

## Building a Pricing Page

```tsx
// app/pricing/page.tsx
import { hasActiveSubscription, isStripeAvailable } from "@/actions";
import { redirect } from "next/navigation";
import { PricingCards } from "./pricing-cards";

export default async function PricingPage() {
  // Check if already subscribed
  const isSubscribed = await hasActiveSubscription();
  if (isSubscribed) {
    redirect("/dashboard");
  }

  // Check if Stripe is configured
  const stripeEnabled = await isStripeAvailable();

  if (!stripeEnabled) {
    return <div>Payments are not configured.</div>;
  }

  return <PricingCards />;
}
```

```tsx
// app/pricing/pricing-cards.tsx
"use client";

import { createSubscriptionCheckout } from "@/actions";
import { Button } from "@/components/ui/button";

const plans = [
  { name: "Free", price: "$0", priceId: null },
  { name: "Pro", price: "$10/mo", priceId: "price_pro_monthly" },
  { name: "Enterprise", price: "$50/mo", priceId: "price_enterprise_monthly" },
];

export function PricingCards() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {plans.map((plan) => (
        <div key={plan.name} className="rounded-lg border p-6">
          <h3 className="text-xl font-bold">{plan.name}</h3>
          <p className="mt-2 text-3xl font-bold">{plan.price}</p>

          {plan.priceId ? (
            <form action={() => createSubscriptionCheckout(plan.priceId!)}>
              <Button type="submit" className="mt-4 w-full">
                Subscribe
              </Button>
            </form>
          ) : (
            <Button variant="outline" className="mt-4 w-full">
              Current Plan
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
```

---

## Building a Donation Page

```tsx
// app/donate/page.tsx
"use client";

import { createDonationCheckout } from "@/actions";
import { Button } from "@/components/ui/button";

const donationAmounts = [
  { amount: "$5", priceId: "price_donate_5" },
  { amount: "$10", priceId: "price_donate_10" },
  { amount: "$25", priceId: "price_donate_25" },
  { amount: "$50", priceId: "price_donate_50" },
];

export default function DonatePage() {
  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-2xl font-bold">Support Our Project</h1>
      <p className="text-muted-foreground mb-6">
        Your donation helps us keep this project running.
      </p>

      <div className="grid grid-cols-2 gap-4">
        {donationAmounts.map((donation) => (
          <form
            key={donation.priceId}
            action={() => createDonationCheckout(donation.priceId)}
          >
            <Button type="submit" variant="outline" className="w-full">
              {donation.amount}
            </Button>
          </form>
        ))}
      </div>
    </div>
  );
}
```

---

## Protecting Premium Content

### In Server Components

```tsx
import { hasPaidAccess } from "@/actions";
import { redirect } from "next/navigation";

export default async function PremiumPage() {
  const hasAccess = await hasPaidAccess();

  if (!hasAccess) {
    redirect("/pricing");
  }

  return (
    <div>
      <h1>Premium Content</h1>
      {/* Your premium content here */}
    </div>
  );
}
```

### In Client Components

```tsx
"use client";

import { useEffect, useState } from "react";
import { hasPaidAccess } from "@/actions";

export function PremiumFeature() {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hasPaidAccess().then((access) => {
      setHasAccess(access);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!hasAccess) {
    return <div>Upgrade to access this feature.</div>;
  }

  return <div>Premium feature content</div>;
}
```

### With Middleware (for multiple routes)

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check cookie/session for subscription status
  // Redirect to pricing if not subscribed
  // Note: For proper auth checking, you'd need to verify
  // the session server-side. This is a simplified example.
}

export const config = {
  matcher: ["/premium/:path*", "/dashboard/:path*"],
};
```

---

## Testing

### Test Mode vs Live Mode

- **Test mode**: Use `pk_test_` and `sk_test_` keys
- **Live mode**: Use `pk_live_` and `sk_live_` keys

### Test Card Numbers

| Scenario                | Card Number           |
| ----------------------- | --------------------- |
| Successful payment      | `4242 4242 4242 4242` |
| Requires authentication | `4000 0025 0000 3155` |
| Declined                | `4000 0000 0000 0002` |

Use any future expiry date and any 3-digit CVC.

### Testing Webhooks Locally

```bash
# Terminal 1: Run your dev server
npm run dev

# Terminal 2: Forward Stripe webhooks
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Terminal 3: Trigger test events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.created
stripe trigger invoice.paid
```

---

## Going to Production

### Checklist

1. [ ] Switch to live API keys (`pk_live_`, `sk_live_`)
2. [ ] Set up production webhook endpoint in Stripe Dashboard
3. [ ] Enable required webhook events
4. [ ] Configure Customer Portal in Stripe Dashboard
5. [ ] Complete Stripe business verification
6. [ ] Test with real (small) transactions
7. [ ] Set up monitoring/alerting for webhook failures

### Environment Variables (Production)

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

### Customer Portal Configuration

1. Go to [Settings > Billing > Customer Portal](https://dashboard.stripe.com/settings/billing/portal)
2. Enable features you want:
   - Update payment method
   - View invoices
   - Cancel subscription
   - Pause subscription (optional)
3. Save changes

---

## Common Patterns

### Show Different UI Based on Subscription

```tsx
import { getMySubscription, hasActiveSubscription } from "@/actions";

export default async function AccountPage() {
  const subscription = await getMySubscription();
  const isActive = await hasActiveSubscription();

  return (
    <div>
      {isActive ? (
        <div>
          <p>Plan: Pro</p>
          <p>
            Renews: {subscription.data?.currentPeriodEnd?.toLocaleDateString()}
          </p>
          <form action={openCustomerPortal}>
            <button>Manage Subscription</button>
          </form>
        </div>
      ) : (
        <div>
          <p>Plan: Free</p>
          <a href="/pricing">Upgrade to Pro</a>
        </div>
      )}
    </div>
  );
}
```

### Handle Subscription Cancellation

```tsx
"use client";

import { cancelMySubscription, resumeMySubscription } from "@/actions";
import { useState } from "react";

export function CancelButton({
  cancelAtPeriodEnd,
}: {
  cancelAtPeriodEnd: boolean;
}) {
  const [loading, setLoading] = useState(false);

  async function handleCancel() {
    setLoading(true);
    const result = await cancelMySubscription();
    if (!result.success) {
      alert(result.error);
    }
    setLoading(false);
  }

  async function handleResume() {
    setLoading(true);
    const result = await resumeMySubscription();
    if (!result.success) {
      alert(result.error);
    }
    setLoading(false);
  }

  if (cancelAtPeriodEnd) {
    return (
      <button onClick={handleResume} disabled={loading}>
        Resume Subscription
      </button>
    );
  }

  return (
    <button onClick={handleCancel} disabled={loading}>
      Cancel Subscription
    </button>
  );
}
```

---

## Troubleshooting

### "Stripe is not configured" Error

Make sure `STRIPE_SECRET_KEY` is set in `.env.local` and restart the dev server.

### Webhooks Not Working Locally

1. Make sure Stripe CLI is running: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
2. Check the webhook signing secret matches
3. Look for errors in the terminal

### Subscription Not Updating

1. Check webhook logs in Stripe Dashboard
2. Verify the webhook URL is correct
3. Check server logs for errors

### Customer Portal Not Working

1. Configure the portal in Stripe Dashboard first
2. Make sure the customer has been created in Stripe

### Role Not Updating After Payment

1. Check webhook is being received
2. Look at server logs for errors
3. Verify the `userId` is in the checkout session metadata

---

## Further Reading

- [Stripe Documentation](https://docs.stripe.com/)
- [Stripe Node.js SDK](https://github.com/stripe/stripe-node)
- [Stripe Checkout](https://docs.stripe.com/payments/checkout)
- [Stripe Subscriptions](https://docs.stripe.com/billing/subscriptions/overview)
- [Stripe Webhooks](https://docs.stripe.com/webhooks)
- [Stripe Testing](https://docs.stripe.com/testing)
