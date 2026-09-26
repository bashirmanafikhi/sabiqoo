// scripts/seed.ts
//
// Idempotent seed script. Re-runnable via `npm run seed`.
//
// Reads authoring arrays from `./authoring.ts`, runs the same DDL as
// `migrate.ts`, then INSERTs (or no-ops) every unit, category, deed and
// deed_reference row.
//
// Idempotency strategy (all via INSERT OR IGNORE on UNIQUE indexes):
//   - units:        UNIQUE(title_en)
//   - categories:   UNIQUE(name_en)
//   - deeds:        UNIQUE(slug)
//   - deed_references: UNIQUE(deed_id, source)
//
// References are matched back to their deeds by `slug` (looked up via a
// one-shot slug → id map after the deeds have been inserted).

import * as fs from 'node:fs';
import * as path from 'node:path';
import Database from 'better-sqlite3';
import {
  seedUnits,
  seedCategories,
  seedDeeds,
  seedReferences,
} from '../src/db/seed-data';

const DEFAULT_DB_PATH = path.resolve(process.cwd(), 'sabiqoo.db');
const DB_PATH = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : DEFAULT_DB_PATH;

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

type RowCounts = {
  units: number;
  categories: number;
  deeds: number;
  references: number;
};

type Db = InstanceType<typeof Database>;

function ensureParentDir(filePath: string): void {
  const parent = path.dirname(filePath);
  if (!fs.existsSync(parent)) {
    fs.mkdirSync(parent, { recursive: true });
  }
}

function seedAll(db: Db): RowCounts {
  const insertUnit = db.prepare(
    'INSERT OR IGNORE INTO units (id, title_en, title_ar, sort_order) VALUES (?, ?, ?, ?)',
  );
  const insertCategory = db.prepare(
    'INSERT OR IGNORE INTO categories (id, name_en, name_ar, icon_name, color_code, unit_id, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
  );
  const insertDeed = db.prepare(
    `INSERT OR IGNORE INTO deeds (
      slug, category_id, unit_id, title_ar, title_en,
      description_ar, description_en, xp_reward, difficulty_level,
      branch_group, is_repeatable, sort_order
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  const insertReference = db.prepare(
    `INSERT OR IGNORE INTO deed_references (
      deed_id, type, text_ar, text_en, source, narrator,
      lesson_ar, lesson_en, sort_order
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );

  const txn = db.transaction(() => {
    for (const u of seedUnits) {
      insertUnit.run(u.id, u.title_en, u.title_ar, u.sort_order);
    }
    for (const c of seedCategories) {
      insertCategory.run(
        c.id,
        c.name_en,
        c.name_ar,
        c.icon_name,
        c.color_code,
        c.unit_id,
        c.sort_order,
      );
    }
    for (const d of seedDeeds) {
      insertDeed.run(
        d.slug,
        d.category_id,
        d.unit_id,
        d.title_ar,
        d.title_en,
        d.description_ar,
        d.description_en,
        d.xp_reward,
        d.difficulty_level,
        d.branch_group,
        d.is_repeatable,
        d.sort_order,
      );
    }

    // Resolve deed slugs → ids once after deeds are inserted.
    const slugRows = db
      .prepare('SELECT id, slug FROM deeds')
      .all() as { id: number; slug: string }[];
    const slugToId = new Map<string, number>();
    for (const r of slugRows) slugToId.set(r.slug, r.id);

    let refsInserted = 0;
    for (const r of seedReferences) {
      const deedId = slugToId.get(r.deed_slug);
      if (deedId === undefined) {
        console.warn(
          `seed: skipping reference for unknown slug "${r.deed_slug}"`,
        );
        continue;
      }
      insertReference.run(
        deedId,
        r.type,
        r.text_ar,
        r.text_en,
        r.source,
        r.narrator,
        r.lesson_ar,
        r.lesson_en,
        r.sort_order,
      );
      refsInserted += 1;
    }
    return refsInserted;
  });

  const refsInserted = txn();

  return {
    units: seedUnits.length,
    categories: seedCategories.length,
    deeds: seedDeeds.length,
    references: refsInserted,
  };
}

function main(): void {
  ensureParentDir(DB_PATH);
  const db = new Database(DB_PATH);
  try {
    db.pragma('foreign_keys = ON');
    db.exec(MIGRATION_SQL);
    const counts = seedAll(db);
    console.log('Seed complete', counts);
  } finally {
    db.close();
  }
  process.exit(0);
}

main();
