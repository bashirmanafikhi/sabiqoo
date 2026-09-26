import { asc } from 'drizzle-orm';
import { getDb } from '@/db';
import { units, type Unit } from '@/db/schema';

export async function list(): Promise<Unit[]> {
  const db = getDb();
  return db.select().from(units).orderBy(asc(units.sortOrder)).all();
}
