"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { userProfile, type NewUserProfile } from "@/db/schema";
import { auth } from "@/lib/auth";

/**
 * User Profile Server Actions
 *
 * Server actions for managing user profiles.
 * These run on the server and can be called directly from client components.
 *
 * Pattern:
 * 1. Authenticate the user
 * 2. Validate input
 * 3. Perform database operation
 * 4. Revalidate cache if needed
 * 5. Return result or throw error
 */

// Result type for actions
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Get the current user's profile
 */
export async function getMyProfile(): Promise<
  ActionResult<typeof userProfile.$inferSelect | null>
> {
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

    return { success: true, data: profile ?? null };
  } catch (error) {
    console.error("Failed to get profile:", error);
    return { success: false, error: "Failed to get profile" };
  }
}

/**
 * Update the current user's profile
 */
export async function updateMyProfile(
  data: Pick<NewUserProfile, "bio" | "location" | "website">
): Promise<ActionResult<typeof userProfile.$inferSelect>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    // Check if profile exists
    const [existing] = await db
      .select()
      .from(userProfile)
      .where(eq(userProfile.userId, session.user.id))
      .limit(1);

    let profile;

    if (existing) {
      // Update existing profile
      [profile] = await db
        .update(userProfile)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(userProfile.userId, session.user.id))
        .returning();
    } else {
      // Create new profile
      [profile] = await db
        .insert(userProfile)
        .values({
          userId: session.user.id,
          ...data,
        })
        .returning();
    }

    // Revalidate any pages that show profile data
    revalidatePath("/profile");

    return { success: true, data: profile! };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

/**
 * Delete the current user's profile
 */
export async function deleteMyProfile(): Promise<ActionResult<null>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    await db.delete(userProfile).where(eq(userProfile.userId, session.user.id));

    revalidatePath("/profile");

    return { success: true, data: null };
  } catch (error) {
    console.error("Failed to delete profile:", error);
    return { success: false, error: "Failed to delete profile" };
  }
}
