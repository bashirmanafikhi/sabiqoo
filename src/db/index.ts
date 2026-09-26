import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from './schema';
import { bootstrapRuntimeDb } from './migrate';
import { seedIfEmpty } from './seed-runtime';

type SchemaDb = ReturnType<typeof drizzle<typeof schema>>;

let _db: SchemaDb | null = null;

export function getDb(): SchemaDb {
  if (_db) return _db;
  const sqlite = SQLite.openDatabaseSync('sabiqoo.db');
  _db = drizzle(sqlite, { schema });
  return _db;
}

/**
 * One-shot app-boot setup. Idempotent: every CREATE uses IF NOT EXISTS and the
 * seed only runs when the deeds table is empty.
 */
export async function initDb(): Promise<void> {
  const db = getDb();
  bootstrapRuntimeDb(db);
  seedIfEmpty(db);
}
