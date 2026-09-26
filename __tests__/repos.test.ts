import { sql } from 'drizzle-orm';
import * as schema from '@/db/schema';

jest.mock('expo-sqlite', () => ({
  openDatabaseSync: jest.fn(),
}));

// better-sqlite3 ships a native binding (.node) that must match the host Node ABI.
// On Windows + Node 26 the prebuilt binary is not published and Python is not
// available, so we cannot build from source. The repo round-trip suite requires
// a working SQLite engine; detect availability by attempting to instantiate one.
const betterSqlite3Available = (() => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    const Probe = require('better-sqlite3');
    const probeDb = new Probe(':memory:');
    probeDb.close();
    return true;
  } catch {
    return false;
  }
})();

jest.mock('@/db', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
  const mockSqlite3 = require('better-sqlite3');
  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
  const { drizzle: mockDrizzle } = require('drizzle-orm/better-sqlite3');
  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
  const mockSchema = require('@/db/schema');

  const mockMigrationSql = `
CREATE TABLE units (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  sort_order INTEGER NOT NULL
);

CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  color_code TEXT NOT NULL,
  unit_id INTEGER,
  sort_order INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX idx_categories_unit_id ON categories(unit_id);

CREATE TABLE deeds (
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
CREATE INDEX idx_deeds_category_id ON deeds(category_id);
CREATE INDEX idx_deeds_unit_id ON deeds(unit_id);
CREATE INDEX idx_deeds_branch_group ON deeds(unit_id, branch_group);

CREATE TABLE user_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  deed_id INTEGER NOT NULL REFERENCES deeds(id),
  completed_at TEXT NOT NULL DEFAULT (datetime('now')),
  xp_earned INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  note TEXT,
  day_bucket TEXT NOT NULL
);
CREATE INDEX idx_user_logs_day_bucket ON user_logs(day_bucket);
CREATE INDEX idx_user_logs_deed_id ON user_logs(deed_id);

CREATE TABLE user_profile (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  current_xp INTEGER NOT NULL DEFAULT 0,
  current_level INTEGER NOT NULL DEFAULT 1,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_active_date TEXT,
  streak_freezes_left INTEGER NOT NULL DEFAULT 2
);

CREATE TABLE user_bookmarks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  deed_id INTEGER NOT NULL UNIQUE REFERENCES deeds(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_user_bookmarks_deed_id ON user_bookmarks(deed_id);

CREATE TABLE user_skipped (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  deed_id INTEGER NOT NULL UNIQUE REFERENCES deeds(id) ON DELETE CASCADE,
  skipped_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_user_skipped_deed_id ON user_skipped(deed_id);

CREATE TABLE deed_references (
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
CREATE INDEX idx_deed_references_deed_id ON deed_references(deed_id);
`;

  let mockCachedDb: any = null;
  return {
    getDb: () => {
      if (mockCachedDb) return mockCachedDb;
      const sqlite = new mockSqlite3(':memory:');
      sqlite.pragma('foreign_keys = ON');
      sqlite.exec(mockMigrationSql);
      mockCachedDb = mockDrizzle(sqlite, { schema: mockSchema });
      return mockCachedDb;
    },
    initDb: async () => {},
    runMigrations: async () => {},
  };
});

import * as deedsRepo from '@/repos/deedsRepo';
import * as logsRepo from '@/repos/logsRepo';
import * as bookmarksRepo from '@/repos/bookmarksRepo';
import * as skippedRepo from '@/repos/skippedRepo';
import * as unitsRepo from '@/repos/unitsRepo';
import * as categoriesRepo from '@/repos/categoriesRepo';
import * as profileRepo from '@/repos/profileRepo';
import * as referencesRepo from '@/repos/referencesRepo';
import { getDb } from '@/db';

function seedBasics() {
  const db = getDb();
  db.insert(schema.units)
    .values([
      { titleAr: 'وحدة ١', titleEn: 'Unit 1', sortOrder: 1 },
      { titleAr: 'وحدة ٢', titleEn: 'Unit 2', sortOrder: 2 },
    ])
    .run();
  db.insert(schema.categories)
    .values([
      {
        nameAr: 'صدقة',
        nameEn: 'Charity',
        iconName: 'Heart',
        colorCode: '#58CC02',
        unitId: 1,
        sortOrder: 1,
      },
    ])
    .run();
  db.insert(schema.deeds)
    .values([
      {
        slug: 'smile-1',
        categoryId: 1,
        unitId: 1,
        titleAr: 'ابتسم',
        titleEn: 'Smile',
        descriptionAr: 'ابتسم لأخيك',
        descriptionEn: 'Smile at your brother',
        xpReward: 10,
        difficultyLevel: 1,
        branchGroup: 1,
        isRepeatable: 1,
        sortOrder: 1,
      },
      {
        slug: 'salam-1',
        categoryId: 1,
        unitId: 1,
        titleAr: 'السلام',
        titleEn: 'Say Salam',
        descriptionAr: 'ألقِ السلام',
        descriptionEn: 'Greet with Salam',
        xpReward: 10,
        difficultyLevel: 1,
        branchGroup: 1,
        isRepeatable: 1,
        sortOrder: 2,
      },
      {
        slug: 'charity-1',
        categoryId: 1,
        unitId: 1,
        titleAr: 'صدقة',
        titleEn: 'Give charity',
        descriptionAr: 'تصدق',
        descriptionEn: 'Give charity',
        xpReward: 20,
        difficultyLevel: 2,
        branchGroup: 2,
        isRepeatable: 1,
        sortOrder: 3,
      },
    ])
    .run();
}

describe('repos', () => {
  if (!betterSqlite3Available) {
    test.skip('better-sqlite3 native binding unavailable on this platform; rebuild via `npm rebuild better-sqlite3` (requires Python on Windows) or run `npm run seed` after switching to a Node version with a published prebuilt', () => {});
    return;
  }

  test('unitsRepo.list returns seeded units sorted', async () => {
    seedBasics();
    const list = await unitsRepo.list();
    expect(list).toHaveLength(2);
    expect(list[0]?.sortOrder).toBe(1);
    expect(list[1]?.sortOrder).toBe(2);
  });

  test('categoriesRepo.listByUnit filters correctly', async () => {
    seedBasics();
    const list = await categoriesRepo.listByUnit(1);
    expect(list).toHaveLength(1);
    expect(list[0]?.nameEn).toBe('Charity');
    const none = await categoriesRepo.listByUnit(99);
    expect(none).toHaveLength(0);
  });

  test('deedsRepo round-trips insert and listAll', async () => {
    seedBasics();
    const all = await deedsRepo.listAll();
    expect(all).toHaveLength(3);
    const smile = await deedsRepo.getById(1);
    expect(smile?.slug).toBe('smile-1');
  });

  test('logsRepo.insert then listByDeed returns log', async () => {
    seedBasics();
    await logsRepo.insert({
      deedId: 1,
      xpEarned: 10,
      quantity: 1,
      dayBucket: '2026-09-26',
    });
    const logs = await logsRepo.listByDeed(1);
    expect(logs).toHaveLength(1);
    expect(logs[0]?.deedId).toBe(1);
    expect(logs[0]?.dayBucket).toBe('2026-09-26');
  });

  test('logsRepo.countByDay groups by day_bucket', async () => {
    seedBasics();
    await logsRepo.insert({
      deedId: 1,
      xpEarned: 10,
      dayBucket: '2026-09-26',
    });
    await logsRepo.insert({
      deedId: 2,
      xpEarned: 10,
      dayBucket: '2026-09-26',
    });
    await logsRepo.insert({
      deedId: 3,
      xpEarned: 20,
      dayBucket: '2026-09-25',
    });
    const rows = await logsRepo.countByDay('2026-09-25', '2026-09-26');
    const day26 = rows.find((r) => r.day_bucket === '2026-09-26');
    const day25 = rows.find((r) => r.day_bucket === '2026-09-25');
    expect(day26?.count).toBe(2);
    expect(day25?.count).toBe(1);
  });

  test('logsRepo.countByCategory groups by category_id', async () => {
    seedBasics();
    await logsRepo.insert({
      deedId: 1,
      xpEarned: 10,
      dayBucket: '2026-09-26',
    });
    await logsRepo.insert({
      deedId: 2,
      xpEarned: 10,
      dayBucket: '2026-09-26',
    });
    const rows = await logsRepo.countByCategory();
    expect(rows).toHaveLength(1);
    expect(rows[0]?.category_id).toBe(1);
    expect(rows[0]?.count).toBe(2);
  });

  test('bookmarksRepo unique constraint: add twice → still 1 row', async () => {
    seedBasics();
    await bookmarksRepo.add(1);
    await bookmarksRepo.add(1);
    const all = await bookmarksRepo.listAll();
    expect(all).toEqual([1]);
    expect(await bookmarksRepo.isBookmarked(1)).toBe(true);
    await bookmarksRepo.remove(1);
    expect(await bookmarksRepo.isBookmarked(1)).toBe(false);
  });

  test('skippedRepo cascade: delete deed → user_skipped row gone', async () => {
    seedBasics();
    await skippedRepo.skip(1);
    expect(await skippedRepo.listAll()).toEqual([1]);
    const db = getDb();
    db.delete(schema.deeds).where(sql`id = 1`).run();
    expect(await skippedRepo.listAll()).toEqual([]);
  });

  test('profileRepo.get returns default row on first call', async () => {
    const p = await profileRepo.get();
    expect(p.id).toBe(1);
    expect(p.currentXp).toBe(0);
    expect(p.streakFreezesLeft).toBe(2);
  });

  test('profileRepo.upsert then get returns updated values', async () => {
    await profileRepo.upsert({
      id: 1,
      currentXp: 250,
      currentLevel: 3,
      currentStreak: 5,
      longestStreak: 7,
      lastActiveDate: '2026-09-26',
      streakFreezesLeft: 1,
    });
    const p = await profileRepo.get();
    expect(p.currentXp).toBe(250);
    expect(p.currentStreak).toBe(5);
    expect(p.longestStreak).toBe(7);
  });

  test('referencesRepo.listByDeed filters and orders', async () => {
    seedBasics();
    const db = getDb();
    db.insert(schema.deedReferences)
      .values([
        {
          deedId: 1,
          type: 'quran',
          textAr: 'آية',
          source: 'Surah 1:1',
          sortOrder: 2,
        },
        {
          deedId: 1,
          type: 'hadith',
          textAr: 'حديث',
          source: 'Bukhari 1',
          sortOrder: 1,
        },
        {
          deedId: 2,
          type: 'athkar',
          textAr: 'ذكر',
          source: 'Morning',
          sortOrder: 1,
        },
      ])
      .run();
    const list = await referencesRepo.listByDeed(1);
    expect(list).toHaveLength(2);
    expect(list[0]?.sortOrder).toBe(1);
    expect(list[1]?.sortOrder).toBe(2);
  });

  test('deedsRepo.unlockedIds: first deed unlocked, others locked until prereq done', async () => {
    seedBasics();
    const unlockedFirst = await deedsRepo.unlockedIds(1, [], []);
    expect(unlockedFirst).toEqual([1]);
    const unlockedAfter = await deedsRepo.unlockedIds(1, [1], []);
    expect(unlockedAfter.sort()).toEqual([1, 2]);
  });
});
