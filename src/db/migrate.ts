// Single source of truth for the DDL that bootstraps the Sabiqoo DB.
//
// Used by:
//   * src/db/index.ts            — runtime bootstrap via `expo-sqlite` at app boot
//   * __tests__/repos.test.ts    — in-memory engine for round-trip tests
//
// The schema is a single `history` table; the deed catalog itself is static
// app content (src/content/catalog.ts), not database rows. Databases created
// by older builds (deeds/logs MVP, or the pre-MVP units/categories/...)
// are dropped wholesale — none of those schemas ever shipped.

export const MIGRATION_SQL = `
CREATE TABLE IF NOT EXISTS history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL,
  title_ar TEXT,
  title_en TEXT,
  day TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
-- Older builds had a UNIQUE(key, day) index (one log per deed per day);
-- redo requires multiple logs per day, so the unique index is replaced
-- by a plain one. DROP first so existing installs are upgraded in place.
DROP INDEX IF EXISTS idx_history_key_day;
CREATE INDEX IF NOT EXISTS idx_history_key_day ON history(key, day);
CREATE INDEX IF NOT EXISTS idx_history_day ON history(day);
`;

/** Tables from older builds; removed on first boot of this build. */
const LEGACY_TABLES = [
  'user_achievements',
  'achievements',
  'deed_references',
  'user_skipped',
  'user_bookmarks',
  'user_profile',
  'user_logs',
  'categories',
  'units',
  'deeds',
  'logs',
] as const;

export function dropLegacySchemaIfPresent(client: {
  getAllSync?: (sql: string) => unknown[];
  execSync?: (sql: string) => unknown;
}): void {
  if (typeof client.getAllSync !== 'function' || typeof client.execSync !== 'function') {
    return;
  }
  const tables = client.getAllSync(
    "SELECT name FROM sqlite_master WHERE type='table'",
  ) as { name: string }[];
  const existing = new Set(tables.map((t) => t.name));

  for (const table of LEGACY_TABLES) {
    if (existing.has(table)) {
      client.execSync(`DROP TABLE IF EXISTS ${table}`);
    }
  }
}

export function bootstrapRuntimeDb(db: { $client?: { execSync?: (sql: string) => unknown; getAllSync?: (sql: string) => unknown[] } }): void {
  const client = db.$client;
  if (!client || typeof client.execSync !== 'function') {
    throw new Error('bootstrapRuntimeDb: drizzle handle must wrap an expo-sqlite client with execSync');
  }
  dropLegacySchemaIfPresent(client);
  client.execSync(MIGRATION_SQL);
}
