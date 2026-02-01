/**
 * Shared TypeScript type definitions
 */

export type ApiResponse<T> =
  | {
      data: T;
      error: null;
    }
  | {
      data: null;
      error: string;
    };

/**
 * Server action result type
 *
 * Discriminated union for server action return values.
 * Used across all server action files.
 */
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };
