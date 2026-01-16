import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * Primary Database Connection (PostgreSQL)
 *
 * Configure via environment variable:
 * DATABASE_URL=postgresql://user:password@localhost:5432/mydb
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

// Connection options for different environments
const connectionOptions = {
  // Max connections in pool
  max: process.env.NODE_ENV === "production" ? 10 : 1,
  // Idle timeout (ms)
  idle_timeout: 20,
  // Connect timeout (ms)
  connect_timeout: 10,
};

// Create postgres connection
// Using a singleton pattern to avoid creating multiple connections in development
const globalForDb = globalThis as unknown as {
  primaryConnection: postgres.Sql | undefined;
};

export const connection =
  globalForDb.primaryConnection ??
  postgres(getConnectionString(), connectionOptions);

if (process.env.NODE_ENV !== "production") {
  globalForDb.primaryConnection = connection;
}

// Create Drizzle instance with schema
export const db = drizzle(connection, { schema });

// Helper to check connection
export async function checkConnection(): Promise<boolean> {
  try {
    await connection`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Primary database connection failed:", error);
    return false;
  }
}
