/**
 * Example Service
 *
 * Demonstrates how to create typed API services using the API client.
 * Delete this file and create your own services.
 */

import { createApiClient } from "@/lib/api";

// Types for your API responses
interface User {
  id: string;
  email: string;
  name: string;
}

interface CreateUserInput {
  email: string;
  name: string;
}

// Create API client for internal API
const api = createApiClient({
  baseUrl: "/api",
  onError: (error) => {
    // Global error handling (e.g., logging, toast notifications)
    console.error(`API Error [${error.code}]:`, error.message);
  },
});

// Example: Create API client for external API
// export const externalApi = createApiClient({
//   baseUrl: process.env.NEXT_PUBLIC_EXTERNAL_API_URL || "https://api.example.com",
//   defaultHeaders: {
//     Authorization: `Bearer ${process.env.API_KEY}`,
//   },
//   defaultTimeout: 10000,
// });

/**
 * User Service
 */
export const userService = {
  /**
   * Get all users
   */
  async getAll(): Promise<User[]> {
    return api.get<User[]>("/users");
  },

  /**
   * Get user by ID
   */
  async getById(id: string): Promise<User> {
    return api.get<User>(`/users/${id}`);
  },

  /**
   * Create a new user
   */
  async create(input: CreateUserInput): Promise<User> {
    return api.post<User>("/users", input);
  },

  /**
   * Update a user
   */
  async update(id: string, input: Partial<CreateUserInput>): Promise<User> {
    return api.patch<User>(`/users/${id}`, input);
  },

  /**
   * Delete a user
   */
  async delete(id: string): Promise<void> {
    return api.delete(`/users/${id}`);
  },
};

/**
 * Example: Handling errors in components
 *
 * async function handleCreateUser(data: CreateUserInput) {
 *   try {
 *     const user = await userService.create(data);
 *     toast.success("User created!");
 *     return user;
 *   } catch (error) {
 *     if (error instanceof ApiException) {
 *       switch (error.code) {
 *         case "VALIDATION_ERROR":
 *           toast.error("Please check your input");
 *           break;
 *         case "UNAUTHORIZED":
 *           router.push("/login");
 *           break;
 *         case "RATE_LIMITED":
 *           toast.error("Too many requests, please wait");
 *           break;
 *         default:
 *           toast.error(error.message);
 *       }
 *     }
 *     throw error;
 *   }
 * }
 */

/**
 * Example: Using with React Query / SWR
 *
 * // With React Query
 * const { data, error } = useQuery({
 *   queryKey: ["users"],
 *   queryFn: () => userService.getAll(),
 * });
 *
 * // With SWR
 * const { data, error } = useSWR("users", () => userService.getAll());
 */
