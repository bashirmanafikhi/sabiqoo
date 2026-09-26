import { and, desc, eq, gte, lte, count } from 'drizzle-orm';
import { getDb } from '@/db';
import { deeds, userLogs, type NewUserLog, type UserLog } from '@/db/schema';

export async function listByDeed(deedId: number): Promise<UserLog[]> {
  const db = getDb();
  return db
    .select()
    .from(userLogs)
    .where(eq(userLogs.deedId, deedId))
    .orderBy(desc(userLogs.completedAt))
    .all();
}

export async function listAll(): Promise<UserLog[]> {
  const db = getDb();
  return db.select().from(userLogs).orderBy(desc(userLogs.completedAt)).all();
}

export async function listByDayBucketRange(
  from: string,
  to: string,
): Promise<UserLog[]> {
  const db = getDb();
  return db
    .select()
    .from(userLogs)
    .where(and(gte(userLogs.dayBucket, from), lte(userLogs.dayBucket, to)))
    .orderBy(desc(userLogs.completedAt))
    .all();
}

export async function countByDay(
  from: string,
  to: string,
): Promise<{ day_bucket: string; count: number }[]> {
  const db = getDb();
  const rows = db
    .select({ dayBucket: userLogs.dayBucket, count: count() })
    .from(userLogs)
    .where(and(gte(userLogs.dayBucket, from), lte(userLogs.dayBucket, to)))
    .groupBy(userLogs.dayBucket)
    .all();
  return rows.map((r) => ({
    day_bucket: r.dayBucket,
    count: Number(r.count),
  }));
}

export async function countByCategory(): Promise<
  { category_id: number; count: number }[]
> {
  const db = getDb();
  const rows = db
    .select({ categoryId: deeds.categoryId, count: count() })
    .from(userLogs)
    .innerJoin(deeds, eq(userLogs.deedId, deeds.id))
    .groupBy(deeds.categoryId)
    .all();
  return rows.map((r) => ({
    category_id: r.categoryId,
    count: Number(r.count),
  }));
}

export async function insert(log: NewUserLog): Promise<void> {
  const db = getDb();
  db.insert(userLogs).values(log).run();
}
