"use server";

import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { userProfile, type UserRole } from "@/db/schema";

/**
 * Role-based Server Actions
 *
 * Server actions for managing user roles and access control.
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
  const result = await getMyRole();
  if (!result.success) return false;
  return result.data === role;
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
    if (userId === session.user.id && newRole !== "admin") {
      return { success: false, error: "Cannot demote yourself from admin" };
    }

    // Update the user's role
    await db
      .update(userProfile)
      .set({ role: newRole, updatedAt: new Date() })
      .where(eq(userProfile.userId, userId));

    return { success: true, data: null };
  } catch (error) {
    console.error("Failed to update role:", error);
    return { success: false, error: "Failed to update role" };
  }
}

/**
 * Upgrade user to paid_user (called after successful subscription)
 * This is called internally, not directly by users.
 */
export async function upgradeToPayedUser(userId: string): Promise<void> {
  await db
    .update(userProfile)
    .set({ role: "paid_user", updatedAt: new Date() })
    .where(eq(userProfile.userId, userId));
}

/**
 * Downgrade user from paid_user (called when subscription ends)
 * This is called internally, not directly by users.
 */
export async function downgradeFromPaidUser(userId: string): Promise<void> {
  const [profile] = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.userId, userId))
    .limit(1);

  // Don't downgrade admins or if they've donated before
  if (profile?.role === "admin") return;

  // If they have donations, make them a donor, otherwise basic user
  const newRole: UserRole =
    profile?.totalDonations && profile.totalDonations > 0 ? "donor" : "user";

  await db
    .update(userProfile)
    .set({ role: newRole, updatedAt: new Date() })
    .where(eq(userProfile.userId, userId));
}

/**
 * Update donation stats and role (called after successful donation)
 * This is called internally, not directly by users.
 */
export async function recordDonation(
  userId: string,
  amountInCents: number
): Promise<void> {
  const [profile] = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.userId, userId))
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
      totalDonations: currentDonations + amountInCents,
      lifetimeValue: currentLTV + amountInCents,
      updatedAt: new Date(),
    })
    .where(eq(userProfile.userId, userId));
}

/**
 * Ensure user profile exists (creates one if not)
 */
export async function ensureUserProfile(userId: string): Promise<void> {
  const [existing] = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.userId, userId))
    .limit(1);

  if (!existing) {
    await db.insert(userProfile).values({
      userId,
      role: "user",
    });
  }
}
