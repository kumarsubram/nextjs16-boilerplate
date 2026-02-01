/**
 * Database Seed Script
 *
 * Populates the database with sample data for development.
 * Safe to run multiple times — uses ON CONFLICT DO NOTHING.
 *
 * Usage:
 *   npm run db:seed
 *
 * Prerequisites:
 *   - DATABASE_URL set in .env.local
 *   - Schema applied first: npm run db:push (dev) or npm run db:migrate (prod)
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Load .env.local for standalone execution (Next.js convention)
try {
  const envFile = readFileSync(resolve(process.cwd(), ".env.local"), "utf-8");
  for (const line of envFile.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex);
    const value = trimmed.slice(eqIndex + 1).replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
} catch {
  // .env.local not found — rely on existing environment variables
}

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error(
    "DATABASE_URL is not set. Add it to .env.local or export it in your shell."
  );
  process.exit(1);
}

const connection = postgres(DATABASE_URL, { max: 1 });
const db = drizzle(connection, { schema });

// ── Deterministic IDs for idempotent seeding ────────────────
const IDS = {
  // Users (text PKs)
  adminUser: "seed_user_admin",
  regularUser: "seed_user_regular",
  paidUser: "seed_user_paid",
  // User profiles (UUID PKs)
  adminProfile: "00000000-0000-4000-8000-000000000001",
  regularProfile: "00000000-0000-4000-8000-000000000002",
  paidProfile: "00000000-0000-4000-8000-000000000003",
  // Stripe products (text PKs)
  proPlan: "seed_product_pro",
  enterprisePlan: "seed_product_enterprise",
  // Stripe prices (text PKs)
  proMonthly: "seed_price_pro_monthly",
  proYearly: "seed_price_pro_yearly",
  enterpriseMonthly: "seed_price_enterprise_monthly",
  // Stripe customer / subscription / payment (text PKs)
  stripeCustomer: "seed_stripe_customer",
  subscription: "seed_subscription",
  payment: "seed_payment",
};

async function seed() {
  console.log("Seeding database...\n");

  // ── 1. Users (Better Auth table) ──────────────────────────
  console.log("  Users");
  await db
    .insert(schema.user)
    .values([
      {
        id: IDS.adminUser,
        name: "Admin User",
        email: "admin@example.com",
        emailVerified: true,
      },
      {
        id: IDS.regularUser,
        name: "Jane Doe",
        email: "jane@example.com",
        emailVerified: true,
      },
      {
        id: IDS.paidUser,
        name: "Pro User",
        email: "pro@example.com",
        emailVerified: true,
      },
    ])
    .onConflictDoNothing();

  // ── 2. User Profiles ──────────────────────────────────────
  console.log("  User profiles");
  await db
    .insert(schema.userProfile)
    .values([
      {
        id: IDS.adminProfile,
        userId: IDS.adminUser,
        role: "admin",
        plan: "free",
        bio: "System administrator",
      },
      {
        id: IDS.regularProfile,
        userId: IDS.regularUser,
        role: "user",
        plan: "free",
        bio: "Regular user account",
        location: "San Francisco, CA",
        totalDonations: 500, // matches seeded $5.00 donation
        lifetimeValue: 500,
      },
      {
        id: IDS.paidProfile,
        userId: IDS.paidUser,
        role: "user",
        plan: "pro",
        bio: "Pro plan subscriber",
        lifetimeValue: 999, // $9.99
      },
    ])
    .onConflictDoNothing();

  // ── 3. Stripe Products ────────────────────────────────────
  console.log("  Stripe products");
  await db
    .insert(schema.stripeProduct)
    .values([
      {
        id: IDS.proPlan,
        stripeProductId: "prod_seed_pro",
        name: "Pro Plan",
        description: "Full access to all features",
        active: true,
        metadata: { plan: "pro" },
      },
      {
        id: IDS.enterprisePlan,
        stripeProductId: "prod_seed_enterprise",
        name: "Enterprise Plan",
        description: "Priority support and custom integrations",
        active: true,
        metadata: { plan: "enterprise" },
      },
    ])
    .onConflictDoNothing();

  // ── 4. Stripe Prices ──────────────────────────────────────
  console.log("  Stripe prices");
  await db
    .insert(schema.stripePrice)
    .values([
      {
        id: IDS.proMonthly,
        stripePriceId: "price_seed_pro_monthly",
        stripeProductId: "prod_seed_pro",
        active: true,
        currency: "usd",
        unitAmount: 999, // $9.99
        type: "recurring",
        interval: "month",
        intervalCount: 1,
      },
      {
        id: IDS.proYearly,
        stripePriceId: "price_seed_pro_yearly",
        stripeProductId: "prod_seed_pro",
        active: true,
        currency: "usd",
        unitAmount: 9999, // $99.99
        type: "recurring",
        interval: "year",
        intervalCount: 1,
      },
      {
        id: IDS.enterpriseMonthly,
        stripePriceId: "price_seed_enterprise_monthly",
        stripeProductId: "prod_seed_enterprise",
        active: true,
        currency: "usd",
        unitAmount: 2999, // $29.99
        type: "recurring",
        interval: "month",
        intervalCount: 1,
      },
    ])
    .onConflictDoNothing();

  // ── 5. Stripe Customer ────────────────────────────────────
  console.log("  Stripe customers");
  await db
    .insert(schema.stripeCustomer)
    .values([
      {
        id: IDS.stripeCustomer,
        userId: IDS.paidUser,
        stripeCustomerId: "cus_seed_001",
        email: "pro@example.com",
        name: "Pro User",
      },
    ])
    .onConflictDoNothing();

  // ── 6. Stripe Subscription ────────────────────────────────
  console.log("  Stripe subscriptions");
  const now = new Date();
  const nextMonth = new Date(now);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  await db
    .insert(schema.stripeSubscription)
    .values([
      {
        id: IDS.subscription,
        userId: IDS.paidUser,
        stripeSubscriptionId: "sub_seed_001",
        stripeCustomerId: "cus_seed_001",
        stripePriceId: "price_seed_pro_monthly",
        status: "active",
        cancelAtPeriodEnd: false,
        currentPeriodStart: now,
        currentPeriodEnd: nextMonth,
      },
    ])
    .onConflictDoNothing();

  // ── 7. Stripe Payment (donation) ──────────────────────────
  console.log("  Stripe payments");
  await db
    .insert(schema.stripePayment)
    .values([
      {
        id: IDS.payment,
        userId: IDS.regularUser,
        stripePaymentIntentId: "pi_seed_donation_001",
        amount: 500, // $5.00
        currency: "usd",
        status: "succeeded",
        paymentType: "donation",
        description: "Thank you donation",
      },
    ])
    .onConflictDoNothing();

  console.log("\nSeed complete!");
  console.log(
    "\nSeeded: 3 users, 3 profiles, 2 products, 3 prices, 1 customer, 1 subscription, 1 payment"
  );
}

seed()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await connection.end();
  });
