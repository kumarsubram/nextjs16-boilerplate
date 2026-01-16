"use server";

import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { userProfile, type UserRole } from "@/db/schema";
import {
  validateInput,
  updateUserRoleSchema,
  recordDonationSchema,
  userRoleSchema,
  patterns,
} from "@/lib/validations";

/**
 * Role-based Server Actions
 *
 * Server actions for managing user roles and access control.
 * All user inputs are validated with Zod schemas.
 */

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Get the current user's role
 */
export async function getMyRole(): Promise<ActionResult<UserRole>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    const [profile] = await db
      .select()
      .from(userProfile)
      .where(eq(userProfile.userId, session.user.id))
      .limit(1);

    // Default to "user" if no profile exists
    return { success: true, data: profile?.role ?? "user" };
  } catch (error) {
    console.error("Failed to get role:", error);
    return { success: false, error: "Failed to get role" };
  }
}

/**
 * Check if current user has a specific role
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  // Validate the role input
  const validation = validateInput(userRoleSchema, role);
  if (!validation.success) return false;

  const result = await getMyRole();
  if (!result.success) return false;
  return result.data === validation.data;
}

/**
 * Check if current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole("admin");
}

/**
 * Check if current user has paid access (paid_user or admin)
 */
export async function hasPaidAccess(): Promise<boolean> {
  const result = await getMyRole();
  if (!result.success) return false;
  return ["admin", "paid_user"].includes(result.data);
}

/**
 * Check if current user has donated
 */
export async function isDonor(): Promise<boolean> {
  const result = await getMyRole();
  if (!result.success) return false;
  return ["admin", "paid_user", "donor"].includes(result.data);
}

/**
 * Update a user's role (admin only)
 *
 * @param userId - The user ID to update
 * @param newRole - The new role to assign
 */
export async function updateUserRole(
  userId: string,
  newRole: UserRole
): Promise<ActionResult<null>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    // Validate input
    const validation = validateInput(updateUserRoleSchema, {
      userId,
      role: newRole,
    });
    if (!validation.success) {
      return { success: false, error: validation.error };
    }
    const { userId: validUserId, role: validRole } = validation.data;

    // Check if current user is admin
    const [adminProfile] = await db
      .select()
      .from(userProfile)
      .where(eq(userProfile.userId, session.user.id))
      .limit(1);

    if (adminProfile?.role !== "admin") {
      return { success: false, error: "Unauthorized - admin access required" };
    }

    // Prevent self-demotion from admin
    if (validUserId === session.user.id && validRole !== "admin") {
      return { success: false, error: "Cannot demote yourself from admin" };
    }

    // Update the user's role
    await db
      .update(userProfile)
      .set({ role: validRole, updatedAt: new Date() })
      .where(eq(userProfile.userId, validUserId));

    return { success: true, data: null };
  } catch (error) {
    console.error("Failed to update role:", error);
    return { success: false, error: "Failed to update role" };
  }
}

/**
 * Upgrade user to paid_user (called after successful subscription)
 * This is called internally, not directly by users.
 *
 * @param userId - The user ID to upgrade
 */
export async function upgradeToPayedUser(userId: string): Promise<void> {
  // Validate userId
  const validation = validateInput(patterns.nonEmptyString, userId);
  if (!validation.success) {
    throw new Error("Invalid user ID");
  }

  await db
    .update(userProfile)
    .set({ role: "paid_user", updatedAt: new Date() })
    .where(eq(userProfile.userId, validation.data));
}

/**
 * Downgrade user from paid_user (called when subscription ends)
 * This is called internally, not directly by users.
 *
 * @param userId - The user ID to downgrade
 */
export async function downgradeFromPaidUser(userId: string): Promise<void> {
  // Validate userId
  const validation = validateInput(patterns.nonEmptyString, userId);
  if (!validation.success) {
    throw new Error("Invalid user ID");
  }

  const [profile] = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.userId, validation.data))
    .limit(1);

  // Don't downgrade admins or if they've donated before
  if (profile?.role === "admin") return;

  // If they have donations, make them a donor, otherwise basic user
  const newRole: UserRole =
    profile?.totalDonations && profile.totalDonations > 0 ? "donor" : "user";

  await db
    .update(userProfile)
    .set({ role: newRole, updatedAt: new Date() })
    .where(eq(userProfile.userId, validation.data));
}

/**
 * Update donation stats and role (called after successful donation)
 * This is called internally, not directly by users.
 *
 * @param userId - The user ID
 * @param amountInCents - The donation amount in cents
 */
export async function recordDonation(
  userId: string,
  amountInCents: number
): Promise<void> {
  // Validate input
  const validation = validateInput(recordDonationSchema, {
    userId,
    amountInCents,
  });
  if (!validation.success) {
    throw new Error(validation.error);
  }
  const { userId: validUserId, amountInCents: validAmount } = validation.data;

  const [profile] = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.userId, validUserId))
    .limit(1);

  const currentDonations = profile?.totalDonations ?? 0;
  const currentLTV = profile?.lifetimeValue ?? 0;

  // Determine new role - keep paid_user or admin, upgrade to donor if basic user
  let newRole: UserRole = profile?.role ?? "user";
  if (newRole === "user") {
    newRole = "donor";
  }

  await db
    .update(userProfile)
    .set({
      role: newRole,
      totalDonations: currentDonations + validAmount,
      lifetimeValue: currentLTV + validAmount,
      updatedAt: new Date(),
    })
    .where(eq(userProfile.userId, validUserId));
}

/**
 * Ensure user profile exists (creates one if not)
 *
 * @param userId - The user ID to ensure has a profile
 */
export async function ensureUserProfile(userId: string): Promise<void> {
  // Validate userId
  const validation = validateInput(patterns.nonEmptyString, userId);
  if (!validation.success) {
    throw new Error("Invalid user ID");
  }

  const [existing] = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.userId, validation.data))
    .limit(1);

  if (!existing) {
    await db.insert(userProfile).values({
      userId: validation.data,
      role: "user",
    });
  }
}
