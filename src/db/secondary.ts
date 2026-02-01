import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

/**
 * Secondary Database Connection (PostgreSQL)
 *
 * Configure via environment variable:
 *   DATABASE_SECONDARY_URL=postgresql://user:password@host:5432/secondary_db
 *
 * Use this for:
 * - Read replicas
 * - Analytics database
 * - Legacy database connections
 * - Multi-tenant databases
 *
 * This connection is OPTIONAL. Only configure if you need a second database.
 * Always check isSecondaryConfigured() before using.
 */

/**
 * Check if secondary database is configured
 */
export function isSecondaryConfigured(): boolean {
  return Boolean(process.env.DATABASE_SECONDARY_URL);
}

function getConnectionString(): string {
  const url = process.env.DATABASE_SECONDARY_URL;
  if (!url) {
    throw new Error(
      "Missing DATABASE_SECONDARY_URL environment variable. " +
        "Check isSecondaryConfigured() before accessing the secondary database."
    );
  }
  return url;
}

const isProd = process.env.NODE_ENV === "production";

const connectionOptions: postgres.Options<Record<string, never>> = {
  max: parseInt(process.env.DATABASE_MAX_CONNECTIONS || (isProd ? "10" : "1")),
  idle_timeout: 20,
  connect_timeout: 10,
  ssl: isProd ? "require" : false,
  prepare: process.env.DATABASE_PREPARE !== "false",
};

// Singleton pattern for development
const globalForDb = globalThis as unknown as {
  secondaryConnection: postgres.Sql | undefined;
};

// Lazy-create connection only when accessed
let _connection: postgres.Sql | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

function getConnection(): postgres.Sql {
  if (!isSecondaryConfigured()) {
    throw new Error(
      "Secondary database is not configured. " +
        "Set DATABASE_SECONDARY_URL or check isSecondaryConfigured() first."
    );
  }
  if (!_connection) {
    _connection =
      globalForDb.secondaryConnection ??
      postgres(getConnectionString(), connectionOptions);
    if (!isProd) {
      globalForDb.secondaryConnection = _connection;
    }
  }
  return _connection;
}

/**
 * Secondary database connection
 * Throws if DATABASE_SECONDARY_URL is not set.
 * Check isSecondaryConfigured() before using.
 */
export function getSecondaryConnection(): postgres.Sql {
  return getConnection();
}

/**
 * Secondary Drizzle instance (without schema - add your own if needed)
 * Throws if DATABASE_SECONDARY_URL is not set.
 * Check isSecondaryConfigured() before using.
 */
export function getSecondaryDb(): ReturnType<typeof drizzle> {
  if (!_db) {
    _db = drizzle(getConnection());
  }
  return _db;
}

// Legacy exports for backwards compatibility - these throw if not configured
export const connection = new Proxy({} as postgres.Sql, {
  get(_, prop) {
    return (getConnection() as unknown as Record<string | symbol, unknown>)[
      prop
    ];
  },
});

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_, prop) {
    return (getSecondaryDb() as unknown as Record<string | symbol, unknown>)[
      prop
    ];
  },
});

/**
 * Check secondary database connection
 */
export async function checkConnection(): Promise<boolean> {
  if (!isSecondaryConfigured()) {
    return false;
  }
  try {
    const conn = getConnection();
    await conn`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Secondary database connection failed:", error);
    return false;
  }
}
