import { asc, eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { deedReferences, type DeedReference } from '@/db/schema';

export async function listByDeed(deedId: number): Promise<DeedReference[]> {
  const db = getDb();
  return db
    .select()
    .from(deedReferences)
    .where(eq(deedReferences.deedId, deedId))
    .orderBy(asc(deedReferences.sortOrder))
    .all();
}
