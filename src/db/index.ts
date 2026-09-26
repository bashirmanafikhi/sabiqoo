import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from './schema';
import { runMigrationsFromFolder } from './migrations/run';

type SchemaDb = ReturnType<typeof drizzle<typeof schema>>;

let _db: SchemaDb | null = null;

export function getDb(): SchemaDb {
  if (_db) return _db;
  const sqlite = SQLite.openDatabaseSync('sabiqoo.db');
  _db = drizzle(sqlite, { schema });
  return _db;
}

export async function runMigrations(): Promise<void> {
  const db = getDb();
  await runMigrationsFromFolder(db);
}

export async function initDb(): Promise<void> {
  try {
    await runMigrations();
  } catch {
    // no-op: tables are created on demand by callers
  }
}

export type DbClient = SchemaDb;
