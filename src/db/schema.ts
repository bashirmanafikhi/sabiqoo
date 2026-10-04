import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

/**
 * One completed good deed. `key` points into the static catalog
 * (src/content/catalog.ts); titleAr/titleEn are snapshots taken at completion
 * time so history stays readable even if catalog wording changes later.
 * A deed may be logged several times per day (redo); undo removes only the
 * most recent entry, so every completion stays in the history.
 */
export const history = sqliteTable(
  'history',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    key: text('key').notNull(),
    titleAr: text('title_ar'),
    titleEn: text('title_en'),
    day: text('day').notNull(), // local calendar day, 'YYYY-MM-DD'
    createdAt: text('created_at')
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (t) => ({
    keyDayIdx: index('idx_history_key_day').on(t.key, t.day),
    dayIdx: index('idx_history_day').on(t.day),
  }),
);

export type HistoryEntry = typeof history.$inferSelect;
export type NewHistoryEntry = typeof history.$inferInsert;
