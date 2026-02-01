import {
  pgTable,
  text,
  timestamp,
  uuid,
  pgEnum,
  integer,
} from "drizzle-orm/pg-core";

import { user } from "./auth";

/**
 * User Roles Enum
 *
 * Defines permission levels in the system.
 * - admin: Full system access, can manage users and settings
 * - user: Regular user (default)
 */
export const userRoleEnum = pgEnum("user_role", ["admin", "user"]);

/**
 * User Plan Enum
 *
 * Defines subscription tiers. Synced from Stripe product metadata.
 * Add new tiers here and set metadata.plan on your Stripe products.
 * - free: No active subscription (default)
 * - pro: Pro plan subscriber
 * - enterprise: Enterprise plan subscriber
 */
export const userPlanEnum = pgEnum("user_plan", ["free", "pro", "enterprise"]);

/**
 * User Profile Table
 *
 * Extended user data beyond what Better Auth stores.
 * Links to the auth user table via userId.
 *
 * Includes role-based access control and payment tracking.
 */
export const userProfile = pgTable("user_profile", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),

  // Profile info
  bio: text("bio"),
  location: text("location"),
  website: text("website"),

  // Role (permissions) and plan (subscription tier)
  role: userRoleEnum("role").notNull().default("user"),
  plan: userPlanEnum("plan").notNull().default("free"),

  // Payment tracking (for quick access without joining stripe tables)
  totalDonations: integer("total_donations").notNull().default(0), // in cents
  lifetimeValue: integer("lifetime_value").notNull().default(0), // total spent in cents

  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * User Role Type (permissions)
 */
export type UserRole = "admin" | "user";

/**
 * User Plan Type (subscription tier)
 */
export type UserPlan = "free" | "pro" | "enterprise";

// Type inference helpers
export type UserProfile = typeof userProfile.$inferSelect;
export type NewUserProfile = typeof userProfile.$inferInsert;
