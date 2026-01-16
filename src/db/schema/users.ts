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
 * Defines the available user roles in the system.
 * - admin: Full system access, can manage users and settings
 * - user: Base free tier user
 * - paid_user: User with active paid subscription
 * - donor: User who has made a one-time donation
 */
export const userRoleEnum = pgEnum("user_role", [
  "admin",
  "user",
  "paid_user",
  "donor",
]);

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

  // Role and access
  role: userRoleEnum("role").notNull().default("user"),

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
 * User Role Type
 */
export type UserRole = "admin" | "user" | "paid_user" | "donor";

// Type inference helpers
export type UserProfile = typeof userProfile.$inferSelect;
export type NewUserProfile = typeof userProfile.$inferInsert;
