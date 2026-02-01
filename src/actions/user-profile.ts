"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { userProfile } from "@/db/schema";
import { auth } from "@/lib/auth";
import {
  validateInput,
  updateProfileSchema,
  type UpdateProfileInput,
} from "@/lib/validations";
import type { ActionResult } from "@/types";

/**
 * User Profile Server Actions
 *
 * Server actions for managing user profiles.
 * These run on the server and can be called directly from client components.
 *
 * Pattern:
 * 1. Authenticate the user
 * 2. Validate input with Zod
 * 3. Perform database operation
 * 4. Revalidate cache if needed
 * 5. Return result
 */

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
 *
 * @param data - Profile data to update (validated with Zod)
 */
export async function updateMyProfile(
  data: UpdateProfileInput
): Promise<ActionResult<typeof userProfile.$inferSelect>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    // Validate input
    const validation = validateInput(updateProfileSchema, data);
    if (!validation.success) {
      return { success: false, error: validation.error };
    }
    const validatedData = validation.data;

    // Clean up empty strings to null for optional URL fields
    const cleanedData = {
      bio: validatedData.bio || null,
      location: validatedData.location || null,
      website: validatedData.website || null,
    };

    // Upsert profile (insert or update if userId already exists)
    const [profile] = await db
      .insert(userProfile)
      .values({
        userId: session.user.id,
        ...cleanedData,
      })
      .onConflictDoUpdate({
        target: userProfile.userId,
        set: {
          ...cleanedData,
          updatedAt: new Date(),
        },
      })
      .returning();

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
