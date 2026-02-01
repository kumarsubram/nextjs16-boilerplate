"use server";

import { headers } from "next/headers";

import { eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { userProfile, type UserRole, type UserPlan } from "@/db/schema";
import { auth } from "@/lib/auth";
import {
  validateInput,
  updateUserRoleSchema,
  recordDonationSchema,
  userRoleSchema,
  userPlanSchema,
  patterns,
} from "@/lib/validations";
import type { ActionResult } from "@/types";

/**
 * Role & Plan Server Actions
 *
 * Role = permissions (admin vs user)
 * Plan = subscription tier (free, pro, enterprise)
 *
 * All user inputs are validated with Zod schemas.
 */

// ── Role Actions (permissions) ──────────────────────────────

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
 * Update a user's role (admin only)
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

// ── Plan Actions (subscription tiers) ───────────────────────

/**
 * Get the current user's plan
 */
export async function getMyPlan(): Promise<ActionResult<UserPlan>> {
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

    return { success: true, data: profile?.plan ?? "free" };
  } catch (error) {
    console.error("Failed to get plan:", error);
    return { success: false, error: "Failed to get plan" };
  }
}

/**
 * Check if current user has paid access (any paid plan or admin)
 */
export async function hasPaidAccess(): Promise<boolean> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return false;

    const [profile] = await db
      .select()
      .from(userProfile)
      .where(eq(userProfile.userId, session.user.id))
      .limit(1);

    if (!profile) return false;
    return profile.role === "admin" || profile.plan !== "free";
  } catch {
    return false;
  }
}

/**
 * Check if current user is a donor (has made any donation)
 */
export async function isDonor(): Promise<boolean> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return false;

    const [profile] = await db
      .select()
      .from(userProfile)
      .where(eq(userProfile.userId, session.user.id))
      .limit(1);

    if (!profile) return false;
    return profile.role === "admin" || (profile.totalDonations ?? 0) > 0;
  } catch {
    return false;
  }
}

/**
 * Upgrade user's plan (called after successful subscription)
 * This is called internally from the webhook, not directly by users.
 */
export async function upgradePlan(
  userId: string,
  plan: UserPlan
): Promise<void> {
  const userValidation = validateInput(patterns.nonEmptyString, userId);
  if (!userValidation.success) throw new Error("Invalid user ID");

  const planValidation = validateInput(userPlanSchema, plan);
  if (!planValidation.success) throw new Error("Invalid plan");

  await db
    .update(userProfile)
    .set({ plan: planValidation.data, updatedAt: new Date() })
    .where(eq(userProfile.userId, userValidation.data));
}

/**
 * Downgrade user's plan to free (called when subscription ends)
 * This is called internally from the webhook, not directly by users.
 */
export async function downgradePlan(userId: string): Promise<void> {
  const validation = validateInput(patterns.nonEmptyString, userId);
  if (!validation.success) throw new Error("Invalid user ID");

  // Don't downgrade admins
  const [profile] = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.userId, validation.data))
    .limit(1);

  if (profile?.role === "admin") return;

  await db
    .update(userProfile)
    .set({ plan: "free", updatedAt: new Date() })
    .where(eq(userProfile.userId, validation.data));
}

/**
 * Update donation stats (called after successful donation)
 * This is called internally from the webhook, not directly by users.
 */
export async function recordDonation(
  userId: string,
  amountInCents: number
): Promise<void> {
  const validation = validateInput(recordDonationSchema, {
    userId,
    amountInCents,
  });
  if (!validation.success) throw new Error(validation.error);
  const { userId: validUserId, amountInCents: validAmount } = validation.data;

  await db
    .update(userProfile)
    .set({
      totalDonations: sql`${userProfile.totalDonations} + ${validAmount}`,
      lifetimeValue: sql`${userProfile.lifetimeValue} + ${validAmount}`,
      updatedAt: new Date(),
    })
    .where(eq(userProfile.userId, validUserId));
}

/**
 * Ensure user profile exists (creates one if not)
 */
export async function ensureUserProfile(userId: string): Promise<void> {
  const validation = validateInput(patterns.nonEmptyString, userId);
  if (!validation.success) throw new Error("Invalid user ID");

  const [existing] = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.userId, validation.data))
    .limit(1);

  if (!existing) {
    await db
      .insert(userProfile)
      .values({
        userId: validation.data,
        role: "user",
        plan: "free",
      })
      .onConflictDoNothing();
  }
}
