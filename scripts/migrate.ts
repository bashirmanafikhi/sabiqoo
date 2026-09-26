// scripts/migrate.ts
//
// Standalone migration script: creates the tables described in
// `src/db/schema.ts` (with the additional UNIQUE indexes needed for the
// seed's idempotency) into a SQLite database file. Re-runnable via
// `npm run db:migrate`.
//
// Note: production will eventually use drizzle-kit migrations generated from
// `src/db/schema.ts`. This script is for dev / first-boot convenience.

import * as fs from 'node:fs';
import * as path from 'node:path';
import Database from 'better-sqlite3';

const DEFAULT_DB_PATH = path.resolve(process.cwd(), 'sabiqoo.db');
const DB_PATH = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : DEFAULT_DB_PATH;

// Inline DDL. Mirrors `src/db/schema.ts` and adds the UNIQUE indexes that
// make `INSERT OR IGNORE` idempotent in seed.ts (units.title_en,
// categories.name_en, deed_references.(deed_id, source)).
const MIGRATION_SQL = `
CREATE TABLE IF NOT EXISTS units (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  sort_order INTEGER NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_units_title_en ON units(title_en);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  color_code TEXT NOT NULL,
  unit_id INTEGER,
  sort_order INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_categories_unit_id ON categories(unit_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_name_en ON categories(name_en);

CREATE TABLE IF NOT EXISTS deeds (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  category_id INTEGER NOT NULL REFERENCES categories(id),
  unit_id INTEGER NOT NULL REFERENCES units(id),
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  description_en TEXT NOT NULL,
  xp_reward INTEGER NOT NULL DEFAULT 10,
  difficulty_level INTEGER NOT NULL DEFAULT 1,
  branch_group INTEGER NOT NULL DEFAULT 1,
  is_repeatable INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_deeds_category_id ON deeds(category_id);
CREATE INDEX IF NOT EXISTS idx_deeds_unit_id ON deeds(unit_id);
CREATE INDEX IF NOT EXISTS idx_deeds_branch_group ON deeds(unit_id, branch_group);

CREATE TABLE IF NOT EXISTS user_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  deed_id INTEGER NOT NULL REFERENCES deeds(id),
  completed_at TEXT NOT NULL DEFAULT (datetime('now')),
  xp_earned INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  note TEXT,
  day_bucket TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_user_logs_day_bucket ON user_logs(day_bucket);
CREATE INDEX IF NOT EXISTS idx_user_logs_deed_id ON user_logs(deed_id);

CREATE TABLE IF NOT EXISTS user_profile (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  current_xp INTEGER NOT NULL DEFAULT 0,
  current_level INTEGER NOT NULL DEFAULT 1,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_active_date TEXT,
  streak_freezes_left INTEGER NOT NULL DEFAULT 2
);

CREATE TABLE IF NOT EXISTS user_bookmarks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  deed_id INTEGER NOT NULL UNIQUE REFERENCES deeds(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_deed_id ON user_bookmarks(deed_id);

CREATE TABLE IF NOT EXISTS user_skipped (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  deed_id INTEGER NOT NULL UNIQUE REFERENCES deeds(id) ON DELETE CASCADE,
  skipped_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_user_skipped_deed_id ON user_skipped(deed_id);

CREATE TABLE IF NOT EXISTS deed_references (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  deed_id INTEGER NOT NULL REFERENCES deeds(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('quran','hadith','athkar')),
  text_ar TEXT NOT NULL,
  text_en TEXT,
  source TEXT NOT NULL,
  narrator TEXT,
  lesson_ar TEXT,
  lesson_en TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_deed_references_deed_id ON deed_references(deed_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_deed_references_deed_source
  ON deed_references(deed_id, source);
`;

function ensureParentDir(filePath: string): void {
  const parent = path.dirname(filePath);
  if (!fs.existsSync(parent)) {
    fs.mkdirSync(parent, { recursive: true });
  }
}

function main(): void {
  ensureParentDir(DB_PATH);
  const db = new Database(DB_PATH);
  try {
    db.pragma('foreign_keys = ON');
    db.exec(MIGRATION_SQL);
    console.log(`migrate: applied DDL to ${path.relative(process.cwd(), DB_PATH)}`);
  } finally {
    db.close();
  }
}

main();
