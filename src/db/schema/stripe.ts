import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

/**
 * Stripe Schema
 *
 * Database tables for Stripe integration.
 * Supports both subscriptions (recurring) and donations (one-time).
 *
 * @see https://docs.stripe.com/billing/subscriptions/build-subscriptions
 */

/**
 * Payment Type Enum
 */
export const paymentTypeEnum = pgEnum("payment_type", [
  "subscription", // Recurring subscription payment
  "donation", // One-time donation
  "one_time", // One-time purchase
]);

/**
 * Stripe Customers
 *
 * Links your app users to Stripe customers.
 * One-to-one relationship with the user table.
 */
export const stripeCustomer = pgTable("stripe_customer", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  stripeCustomerId: text("stripe_customer_id").notNull().unique(),
  email: text("email"),
  name: text("name"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Stripe Products
 *
 * Synced from Stripe. Represents your product catalog.
 * Can be subscriptions, one-time purchases, or donation tiers.
 */
export const stripeProduct = pgTable("stripe_product", {
  id: text("id").primaryKey(),
  stripeProductId: text("stripe_product_id").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  active: boolean("active").notNull().default(true),
  metadata: jsonb("metadata").$type<Record<string, string>>(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Stripe Prices
 *
 * Synced from Stripe. Pricing tiers for your products.
 * type: "recurring" for subscriptions, "one_time" for donations/purchases.
 */
export const stripePrice = pgTable("stripe_price", {
  id: text("id").primaryKey(),
  stripePriceId: text("stripe_price_id").notNull().unique(),
  stripeProductId: text("stripe_product_id")
    .notNull()
    .references(() => stripeProduct.stripeProductId, { onDelete: "cascade" }),
  active: boolean("active").notNull().default(true),
  currency: text("currency").notNull(),
  unitAmount: integer("unit_amount"), // Amount in cents
  type: text("type").notNull().$type<"one_time" | "recurring">(),
  interval: text("interval").$type<"day" | "week" | "month" | "year">(),
  intervalCount: integer("interval_count"),
  trialPeriodDays: integer("trial_period_days"),
  metadata: jsonb("metadata").$type<Record<string, string>>(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Stripe Subscriptions
 *
 * Tracks active subscriptions for users.
 * Users with active subscriptions should have role = "paid_user".
 */
export const stripeSubscription = pgTable("stripe_subscription", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(),
  stripeCustomerId: text("stripe_customer_id").notNull(),
  stripePriceId: text("stripe_price_id").notNull(),
  status: text("status")
    .notNull()
    .$type<
      | "active"
      | "canceled"
      | "incomplete"
      | "incomplete_expired"
      | "past_due"
      | "paused"
      | "trialing"
      | "unpaid"
    >(),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
  currentPeriodStart: timestamp("current_period_start", { withTimezone: true }),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
  canceledAt: timestamp("canceled_at", { withTimezone: true }),
  trialStart: timestamp("trial_start", { withTimezone: true }),
  trialEnd: timestamp("trial_end", { withTimezone: true }),
  metadata: jsonb("metadata").$type<Record<string, string>>(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Stripe Payments
 *
 * Records of one-time payments including donations.
 * Use paymentType to distinguish between donations and purchases.
 */
export const stripePayment = pgTable("stripe_payment", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  stripePaymentIntentId: text("stripe_payment_intent_id").notNull().unique(),
  stripeCustomerId: text("stripe_customer_id"),
  amount: integer("amount").notNull(), // Amount in cents
  currency: text("currency").notNull(),
  status: text("status")
    .notNull()
    .$type<
      | "canceled"
      | "processing"
      | "requires_action"
      | "requires_capture"
      | "requires_confirmation"
      | "requires_payment_method"
      | "succeeded"
    >(),
  paymentType: paymentTypeEnum("payment_type").notNull().default("one_time"),
  description: text("description"), // e.g., "Thank you donation", "Pro upgrade"
  metadata: jsonb("metadata").$type<Record<string, string>>(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// Type inference helpers
export type StripeCustomer = typeof stripeCustomer.$inferSelect;
export type NewStripeCustomer = typeof stripeCustomer.$inferInsert;
export type StripeProduct = typeof stripeProduct.$inferSelect;
export type NewStripeProduct = typeof stripeProduct.$inferInsert;
export type StripePrice = typeof stripePrice.$inferSelect;
export type NewStripePrice = typeof stripePrice.$inferInsert;
export type StripeSubscription = typeof stripeSubscription.$inferSelect;
export type NewStripeSubscription = typeof stripeSubscription.$inferInsert;
export type StripePayment = typeof stripePayment.$inferSelect;
export type NewStripePayment = typeof stripePayment.$inferInsert;
export type PaymentType = "subscription" | "donation" | "one_time";
