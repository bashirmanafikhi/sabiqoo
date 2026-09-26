import { sql } from 'drizzle-orm';
import {
  sqliteTable,
  text,
  integer,
  index,
  check,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

export const units = sqliteTable('units', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  titleAr: text('title_ar').notNull(),
  titleEn: text('title_en').notNull(),
  sortOrder: integer('sort_order').notNull(),
});

export const categories = sqliteTable(
  'categories',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    nameAr: text('name_ar').notNull(),
    nameEn: text('name_en').notNull(),
    iconName: text('icon_name').notNull(),
    colorCode: text('color_code').notNull(),
    unitId: integer('unit_id'),
    sortOrder: integer('sort_order').notNull().default(0),
  },
  (t) => ({
    unitFk: index('idx_categories_unit_id').on(t.unitId),
  }),
);

export const deeds = sqliteTable(
  'deeds',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    slug: text('slug').notNull().unique(),
    categoryId: integer('category_id')
      .notNull()
      .references(() => categories.id),
    unitId: integer('unit_id')
      .notNull()
      .references(() => units.id),
    titleAr: text('title_ar').notNull(),
    titleEn: text('title_en').notNull(),
    descriptionAr: text('description_ar').notNull(),
    descriptionEn: text('description_en').notNull(),
    xpReward: integer('xp_reward').notNull().default(10),
    difficultyLevel: integer('difficulty_level').notNull().default(1),
    branchGroup: integer('branch_group').notNull().default(1),
    isRepeatable: integer('is_repeatable').notNull().default(1),
    sortOrder: integer('sort_order').notNull().default(0),
  },
  (t) => ({
    categoryIdx: index('idx_deeds_category_id').on(t.categoryId),
    unitIdx: index('idx_deeds_unit_id').on(t.unitId),
    branchIdx: index('idx_deeds_branch_group').on(t.unitId, t.branchGroup),
  }),
);

export const userLogs = sqliteTable(
  'user_logs',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    deedId: integer('deed_id')
      .notNull()
      .references(() => deeds.id),
    completedAt: text('completed_at').notNull().default(sql`(datetime('now'))`),
    xpEarned: integer('xp_earned').notNull(),
    quantity: integer('quantity').notNull().default(1),
    note: text('note'),
    dayBucket: text('day_bucket').notNull(),
  },
  (t) => ({
    dayBucketIdx: index('idx_user_logs_day_bucket').on(t.dayBucket),
    deedIdx: index('idx_user_logs_deed_id').on(t.deedId),
  }),
);

export const userProfile = sqliteTable(
  'user_profile',
  {
    id: integer('id').primaryKey(),
    currentXp: integer('current_xp').notNull().default(0),
    currentLevel: integer('current_level').notNull().default(1),
    currentStreak: integer('current_streak').notNull().default(0),
    longestStreak: integer('longest_streak').notNull().default(0),
    lastActiveDate: text('last_active_date'),
    streakFreezesLeft: integer('streak_freezes_left').notNull().default(2),
  },
  (t) => ({
    singleRow: check('user_profile_single_row', sql`${t.id} = 1`),
  }),
);

export const userBookmarks = sqliteTable(
  'user_bookmarks',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    deedId: integer('deed_id')
      .notNull()
      .unique()
      .references(() => deeds.id, { onDelete: 'cascade' }),
    createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  },
  (t) => ({
    deedIdx: index('idx_user_bookmarks_deed_id').on(t.deedId),
  }),
);

export const userSkipped = sqliteTable(
  'user_skipped',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    deedId: integer('deed_id')
      .notNull()
      .unique()
      .references(() => deeds.id, { onDelete: 'cascade' }),
    skippedAt: text('skipped_at').notNull().default(sql`(datetime('now'))`),
  },
  (t) => ({
    deedIdx: index('idx_user_skipped_deed_id').on(t.deedId),
  }),
);

export const deedReferences = sqliteTable(
  'deed_references',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    deedId: integer('deed_id')
      .notNull()
      .references(() => deeds.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    textAr: text('text_ar').notNull(),
    textEn: text('text_en'),
    source: text('source').notNull(),
    narrator: text('narrator'),
    lessonAr: text('lesson_ar'),
    lessonEn: text('lesson_en'),
    sortOrder: integer('sort_order').notNull().default(0),
  },
  (t) => ({
    deedIdx: index('idx_deed_references_deed_id').on(t.deedId),
    typeCheck: check(
      'deed_references_type_check',
      sql`${t.type} IN ('quran','hadith','athkar')`,
    ),
  }),
);

export type Unit = typeof units.$inferSelect;
export type NewUnit = typeof units.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Deed = typeof deeds.$inferSelect;
export type NewDeed = typeof deeds.$inferInsert;
export type UserLog = typeof userLogs.$inferSelect;
export type NewUserLog = typeof userLogs.$inferInsert;
export type UserProfile = typeof userProfile.$inferSelect;
export type NewUserProfile = typeof userProfile.$inferInsert;
export type UserBookmark = typeof userBookmarks.$inferSelect;
export type NewUserBookmark = typeof userBookmarks.$inferInsert;
export type UserSkipped = typeof userSkipped.$inferSelect;
export type NewUserSkipped = typeof userSkipped.$inferInsert;
export type DeedReference = typeof deedReferences.$inferSelect;
export type NewDeedReference = typeof deedReferences.$inferInsert;

export type ReferenceType = 'quran' | 'hadith' | 'athkar';
