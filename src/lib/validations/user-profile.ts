/**
 * User Profile Validation Schemas
 *
 * Zod schemas for validating user profile data.
 */

import { z } from "zod";

/**
 * Schema for updating user profile
 *
 * All fields are optional - only provided fields will be updated.
 */
export const updateProfileSchema = z.object({
  bio: z
    .string()
    .max(500, "Bio must be 500 characters or less")
    .nullable()
    .optional(),
  location: z
    .string()
    .max(100, "Location must be 100 characters or less")
    .nullable()
    .optional(),
  website: z
    .string()
    .url("Must be a valid URL")
    .max(255, "URL must be 255 characters or less")
    .nullable()
    .optional()
    .or(z.literal("")), // Allow empty string for clearing
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

/**
 * Schema for creating a new user profile
 */
export const createProfileSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  bio: z.string().max(500).nullable().optional(),
  location: z.string().max(100).nullable().optional(),
  website: z.string().url().max(255).nullable().optional(),
});

export type CreateProfileInput = z.infer<typeof createProfileSchema>;
