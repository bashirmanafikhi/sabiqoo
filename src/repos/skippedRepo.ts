import { eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { userSkipped } from '@/db/schema';

export async function listAll(): Promise<number[]> {
  const db = getDb();
  const rows = db
    .select({ deedId: userSkipped.deedId })
    .from(userSkipped)
    .all();
  return rows.map((r) => r.deedId);
}

export async function isSkipped(deedId: number): Promise<boolean> {
  const db = getDb();
  const row = db
    .select({ id: userSkipped.id })
    .from(userSkipped)
    .where(eq(userSkipped.deedId, deedId))
    .get();
  return !!row;
}

export async function skip(deedId: number): Promise<void> {
  const db = getDb();
  db.insert(userSkipped).values({ deedId }).onConflictDoNothing().run();
}

export async function unSkip(deedId: number): Promise<void> {
  const db = getDb();
  db.delete(userSkipped).where(eq(userSkipped.deedId, deedId)).run();
}
