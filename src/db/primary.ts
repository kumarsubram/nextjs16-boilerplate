import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

/**
 * Primary Database Connection (PostgreSQL)
 *
 * Configure via environment variables:
 *   DATABASE_URL=postgresql://user:password@host:5432/mydb
 *   DATABASE_SSL=true                    (default: true for production)
 *   DATABASE_MAX_CONNECTIONS=10          (default: 10 prod, 1 dev)
 *   DATABASE_PREPARE=true               (set false for PgBouncer/RDS Proxy)
 */

function getConnectionString(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "Missing DATABASE_URL environment variable. " +
        "Example: postgresql://user:password@localhost:5432/mydb"
    );
  }
  return url;
}

// Determine SSL mode: default to true in production, false in dev
// Set DATABASE_SSL=false to explicitly disable (e.g., local Docker)
function getSSLMode(): boolean | "require" | "prefer" {
  const sslEnv = process.env.DATABASE_SSL;
  if (sslEnv === "false") return false;
  if (sslEnv === "prefer") return "prefer";
  // Default: require SSL in production, off in development
  return process.env.NODE_ENV === "production" ? "require" : false;
}

const isProd = process.env.NODE_ENV === "production";

const connectionOptions: postgres.Options<Record<string, never>> = {
  // Pool size: configurable, sensible defaults
  max: parseInt(process.env.DATABASE_MAX_CONNECTIONS || (isProd ? "10" : "1")),
  // Idle timeout (seconds) - close idle connections
  idle_timeout: 20,
  // Connect timeout (seconds) - fail fast if db unreachable
  connect_timeout: 10,
  // SSL: required for external PostgreSQL (AWS RDS, Neon, Supabase, VPS)
  ssl: getSSLMode(),
  // Prepared statements: disable for PgBouncer/RDS Proxy/Supabase pooler
  // Set DATABASE_PREPARE=false when using a connection pooler in transaction mode
  prepare: process.env.DATABASE_PREPARE !== "false",
};

// Singleton pattern to avoid creating multiple connections during HMR
const globalForDb = globalThis as unknown as {
  primaryConnection: postgres.Sql | undefined;
};

export const connection =
  globalForDb.primaryConnection ??
  postgres(getConnectionString(), connectionOptions);

if (!isProd) {
  globalForDb.primaryConnection = connection;
}

// Create Drizzle instance with schema for typed queries
export const db = drizzle(connection, { schema });

/**
 * Check if the database is reachable
 */
export async function checkConnection(): Promise<boolean> {
  try {
    await connection`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Primary database connection failed:", error);
    return false;
  }
}

/**
 * Gracefully close the connection pool
 * Call this on app shutdown (e.g., SIGTERM handler)
 */
export async function closeConnection(): Promise<void> {
  await connection.end();
}
