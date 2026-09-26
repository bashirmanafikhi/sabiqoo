import { eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { userBookmarks } from '@/db/schema';

export async function listAll(): Promise<number[]> {
  const db = getDb();
  const rows = db
    .select({ deedId: userBookmarks.deedId })
    .from(userBookmarks)
    .all();
  return rows.map((r) => r.deedId);
}

export async function isBookmarked(deedId: number): Promise<boolean> {
  const db = getDb();
  const row = db
    .select({ id: userBookmarks.id })
    .from(userBookmarks)
    .where(eq(userBookmarks.deedId, deedId))
    .get();
  return !!row;
}

export async function add(deedId: number): Promise<void> {
  const db = getDb();
  db.insert(userBookmarks).values({ deedId }).onConflictDoNothing().run();
}

export async function remove(deedId: number): Promise<void> {
  const db = getDb();
  db.delete(userBookmarks).where(eq(userBookmarks.deedId, deedId)).run();
}
