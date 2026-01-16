/**
 * Database Connections
 *
 * This module exports database connections for multiple databases.
 * Each database has its own connection that can be imported independently.
 *
 * Usage:
 *   import { db } from "@/db";
 *   import { primaryDb, secondaryDb } from "@/db";
 *
 * Or import specific database:
 *   import { db } from "@/db/primary";
 */

export { db as primaryDb, connection as primaryConnection } from "./primary";
export {
  db as secondaryDb,
  connection as secondaryConnection,
  isSecondaryConfigured,
} from "./secondary";

// Default export is primary database for convenience
export { db } from "./primary";
