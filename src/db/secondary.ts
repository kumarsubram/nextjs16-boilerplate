import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

/**
 * Secondary Database Connection (PostgreSQL)
 *
 * Configure via environment variable:
 * DATABASE_SECONDARY_URL=postgresql://user:password@localhost:5432/secondary_db
 *
 * Use this for:
 * - Read replicas
 * - Analytics database
 * - Legacy database connections
 * - Multi-tenant databases
 *
 * This connection is OPTIONAL. Only configure if you need a second database.
 */

function getConnectionString(): string {
  const url = process.env.DATABASE_SECONDARY_URL;
  if (!url) {
    throw new Error(
      "Missing DATABASE_SECONDARY_URL environment variable. " +
        "Example: postgresql://user:password@localhost:5432/secondary_db"
    );
  }
  return url;
}

/**
 * Check if secondary database is configured
 */
export function isSecondaryConfigured(): boolean {
  return Boolean(process.env.DATABASE_SECONDARY_URL);
}

// Connection options
const connectionOptions = {
  max: process.env.NODE_ENV === "production" ? 10 : 1,
  idle_timeout: 20,
  connect_timeout: 10,
};

// Singleton pattern for development
const globalForDb = globalThis as unknown as {
  secondaryConnection: postgres.Sql | undefined;
};

// Only create connection if configured
export const connection = isSecondaryConfigured()
  ? (globalForDb.secondaryConnection ??
    postgres(getConnectionString(), connectionOptions))
  : (null as unknown as postgres.Sql);

if (process.env.NODE_ENV !== "production" && isSecondaryConfigured()) {
  globalForDb.secondaryConnection = connection;
}

// Create Drizzle instance (without schema - add your own if needed)
export const db = isSecondaryConfigured()
  ? drizzle(connection)
  : (null as unknown as ReturnType<typeof drizzle>);

// Helper to check connection
export async function checkConnection(): Promise<boolean> {
  if (!isSecondaryConfigured()) {
    return false;
  }
  try {
    await connection`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Secondary database connection failed:", error);
    return false;
  }
}
