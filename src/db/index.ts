import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from './schema';
import { bootstrapRuntimeDb } from './migrate';

type SchemaDb = ReturnType<typeof drizzle<typeof schema>>;

let _db: SchemaDb | null = null;

export function getDb(): SchemaDb {
  if (_db) return _db;
  const sqlite = SQLite.openDatabaseSync('sabiqoo.db');
  _db = drizzle(sqlite, { schema });
  return _db;
}

/**
 * One-shot app-boot setup. Idempotent: drops schemas from older builds and
 * creates the single `history` table. Nothing is seeded — the deed catalog
 * is static app content.
 */
export async function initDb(): Promise<void> {
  bootstrapRuntimeDb(getDb());
}
