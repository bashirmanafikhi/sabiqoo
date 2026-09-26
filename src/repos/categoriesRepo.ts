import { asc, eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { categories, type Category } from '@/db/schema';

export async function list(): Promise<Category[]> {
  const db = getDb();
  return db.select().from(categories).orderBy(asc(categories.sortOrder)).all();
}

export async function listByUnit(unitId: number): Promise<Category[]> {
  const db = getDb();
  return db
    .select()
    .from(categories)
    .where(eq(categories.unitId, unitId))
    .orderBy(asc(categories.sortOrder))
    .all();
}
