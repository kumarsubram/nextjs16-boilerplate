/**
 * Role & Plan Validation Schemas
 *
 * Zod schemas for validating role and plan data.
 */

import { z } from "zod";

/**
 * Valid user roles (permissions)
 */
export const userRoles = ["admin", "user"] as const;

/**
 * Valid user plans (subscription tiers)
 */
export const userPlans = ["free", "pro", "enterprise"] as const;

/**
 * Schema for user role
 */
export const userRoleSchema = z.enum(userRoles, {
  message: "Invalid role",
});

export type UserRoleInput = z.infer<typeof userRoleSchema>;

/**
 * Schema for user plan
 */
export const userPlanSchema = z.enum(userPlans, {
  message: "Invalid plan",
});

export type UserPlanInput = z.infer<typeof userPlanSchema>;

/**
 * Schema for updating a user's role (admin action)
 */
export const updateUserRoleSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  role: userRoleSchema,
});

export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;

/**
 * Schema for recording a donation (internal)
 */
export const recordDonationSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  amountInCents: z.number().int().positive("Amount must be positive"),
});

export type RecordDonationInput = z.infer<typeof recordDonationSchema>;
