import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

declare global {
  var tidalSqlClient: ReturnType<typeof postgres> | undefined;
  var tidalDbClient: PostgresJsDatabase<typeof schema> | undefined;
}

export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

export function getDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return null;

  if (!globalThis.tidalSqlClient) {
    globalThis.tidalSqlClient = postgres(connectionString, {
      max: 1,
      prepare: false,
    });
  }

  if (!globalThis.tidalDbClient) {
    globalThis.tidalDbClient = drizzle(globalThis.tidalSqlClient, { schema });
  }

  return globalThis.tidalDbClient;
}
