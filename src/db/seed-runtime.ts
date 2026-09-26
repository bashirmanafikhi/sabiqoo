// Idempotent runtime seed. Runs at app boot if the DB has no deeds.
// Drives off the canonical arrays in `seed-data.ts` (moved here from
// scripts/authoring.ts so the same data ships with the app bundle).
//
// Strategy: insert in array order. With AUTOINCREMENT + unique name_en /
// slug constraints and `INSERT OR IGNORE`, the assigned rowids on a fresh
// install equal 1..N matching the seed array indices. seedDeeds reference
// foreign keys by index (1..7 for categories, 1..8 for units), so we
// resolve them by sorting existing rows by `sort_order` and picking the Nth.

import * as SQLite from 'expo-sqlite';
import {
  seedUnits,
  seedCategories,
  seedDeeds,
  seedReferences,
} from './seed-data';

type AnyDb = { $client?: SQLite.SQLiteDatabase };

function isEmpty(sqlite: SQLite.SQLiteDatabase): boolean {
  const row = sqlite.getFirstSync<{ c: number }>('SELECT COUNT(*) AS c FROM deeds');
  return (row?.c ?? 0) === 0;
}

function exec(sqlite: SQLite.SQLiteDatabase, sql: string, params: unknown[] = []): void {
  sqlite.runSync(sql, ...(params as never[]));
}

function seedUnits_(sqlite: SQLite.SQLiteDatabase): void {
  for (const u of seedUnits) {
    exec(
      sqlite,
      'INSERT OR IGNORE INTO units (title_ar, title_en, sort_order) VALUES (?, ?, ?)',
      [u.title_ar, u.title_en, u.sort_order],
    );
  }
}

function seedCategories_(sqlite: SQLite.SQLiteDatabase): void {
  const unitRows = sqlite.getAllSync<{ id: number; sort_order: number }>(
    'SELECT id, sort_order FROM units ORDER BY sort_order',
  );

  for (const c of seedCategories) {
    const unit = unitRows[c.unit_id - 1];
    if (!unit) continue;
    exec(
      sqlite,
      'INSERT OR IGNORE INTO categories (name_ar, name_en, icon_name, color_code, unit_id, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
      [
        c.name_ar,
        c.name_en,
        c.icon_name,
        c.color_code,
        unit.id,
        c.sort_order,
      ],
    );
    // Always reconcile icon_name + color_code with the canonical seed
    // values. Idempotent: UPDATE keeps the row's id (and any FKs intact)
    // while applying the latest icon glyph. This way a previously seeded
    // database is refreshed without requiring a wipe-and-reinstall.
    exec(
      sqlite,
      'UPDATE categories SET icon_name = ?, color_code = ? WHERE name_en = ?',
      [c.icon_name, c.color_code, c.name_en],
    );
  }
}

function seedDeeds_(sqlite: SQLite.SQLiteDatabase): void {
  const catRows = sqlite.getAllSync<{ id: number; sort_order: number }>(
    'SELECT id, sort_order FROM categories ORDER BY sort_order',
  );
  const unitRows = sqlite.getAllSync<{ id: number; sort_order: number }>(
    'SELECT id, sort_order FROM units ORDER BY sort_order',
  );

  for (const d of seedDeeds) {
    const cat = catRows[d.category_id - 1];
    const unit = unitRows[d.unit_id - 1];
    if (!cat || !unit) continue;
    exec(
      sqlite,
      `INSERT OR IGNORE INTO deeds
        (slug, category_id, unit_id, title_ar, title_en, description_ar, description_en,
         xp_reward, difficulty_level, branch_group, is_repeatable, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        d.slug,
        cat.id,
        unit.id,
        d.title_ar,
        d.title_en,
        d.description_ar,
        d.description_en,
        d.xp_reward,
        d.difficulty_level,
        d.branch_group,
        d.is_repeatable,
        d.sort_order,
      ],
    );
  }
}

function seedReferences_(sqlite: SQLite.SQLiteDatabase): void {
  for (const r of seedReferences) {
    const deed = sqlite.getFirstSync<{ id: number }>(
      'SELECT id FROM deeds WHERE slug = ?',
      r.deed_slug,
    );
    if (!deed) continue;
    exec(
      sqlite,
      `INSERT OR IGNORE INTO deed_references
        (deed_id, type, text_ar, text_en, source, narrator, lesson_ar, lesson_en, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        deed.id,
        r.type,
        r.text_ar,
        r.text_en,
        r.source,
        r.narrator,
        r.lesson_ar,
        r.lesson_en,
        r.sort_order,
      ],
    );
  }
}

export function seedIfEmpty(db: AnyDb): void {
  const sqlite = db.$client;
  if (!sqlite) return;
  if (!isEmpty(sqlite)) return;

  seedUnits_(sqlite);
  seedCategories_(sqlite);
  seedDeeds_(sqlite);
  seedReferences_(sqlite);

  // Default profile row
  exec(sqlite, 'INSERT OR IGNORE INTO user_profile (id) VALUES (1)');
}
