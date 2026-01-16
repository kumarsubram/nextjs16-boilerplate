import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

/**
 * Better Auth Configuration
 *
 * Required environment variables:
 * - BETTER_AUTH_SECRET: Secret key for signing tokens (32+ chars)
 * - BETTER_AUTH_URL: Base URL for auth (e.g., http://localhost:3000)
 * - GOOGLE_CLIENT_ID: Google OAuth client ID
 * - GOOGLE_CLIENT_SECRET: Google OAuth client secret
 */

// Validate required environment variables
function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// Optional env var with default
function getEnvVarOptional(name: string, defaultValue: string): string {
  return process.env[name] || defaultValue;
}

export const auth = betterAuth({
  baseURL: getEnvVarOptional("BETTER_AUTH_URL", "http://localhost:3000"),
  secret: getEnvVar("BETTER_AUTH_SECRET"),
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  socialProviders: {
    google: {
      clientId: getEnvVar("GOOGLE_CLIENT_ID"),
      clientSecret: getEnvVar("GOOGLE_CLIENT_SECRET"),
    },
  },
});
