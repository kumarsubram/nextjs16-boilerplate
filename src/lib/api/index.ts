/**
 * API Module
 *
 * Export API client and error types.
 */

export {
  createApiClient,
  type RequestConfig,
  type ApiClientConfig,
} from "./client";
export { ApiException, type ApiError, type ApiErrorCode } from "./errors";

/**
 * Pre-configured API client example
 *
 * Create your own instances for different APIs:
 *
 * // Internal API (your Next.js API routes)
 * export const api = createApiClient({
 *   baseUrl: "/api",
 * });
 *
 * // External API
 * export const externalApi = createApiClient({
 *   baseUrl: "https://api.example.com",
 *   defaultHeaders: {
 *     "Authorization": `Bearer ${process.env.API_KEY}`,
 *   },
 * });
 */
