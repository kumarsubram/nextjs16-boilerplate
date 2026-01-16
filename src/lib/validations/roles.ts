/**
 * Role Validation Schemas
 *
 * Zod schemas for validating role-related data.
 */

import { z } from "zod";

/**
 * Valid user roles
 */
export const userRoles = ["admin", "user", "paid_user", "donor"] as const;

/**
 * Schema for user role
 */
export const userRoleSchema = z.enum(userRoles, {
  message: "Invalid role",
});

export type UserRoleInput = z.infer<typeof userRoleSchema>;

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
