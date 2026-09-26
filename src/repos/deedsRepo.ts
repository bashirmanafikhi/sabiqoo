import { and, asc, eq, lt } from 'drizzle-orm';
import { getDb } from '@/db';
import { deeds, type Deed } from '@/db/schema';

export async function listAll(): Promise<Deed[]> {
  const db = getDb();
  return db.select().from(deeds).orderBy(asc(deeds.sortOrder)).all();
}

export async function listByUnit(unitId: number): Promise<Deed[]> {
  const db = getDb();
  return db
    .select()
    .from(deeds)
    .where(eq(deeds.unitId, unitId))
    .orderBy(asc(deeds.sortOrder))
    .all();
}

export async function listByCategory(categoryId: number): Promise<Deed[]> {
  const db = getDb();
  return db
    .select()
    .from(deeds)
    .where(eq(deeds.categoryId, categoryId))
    .orderBy(asc(deeds.sortOrder))
    .all();
}

export async function getById(id: number): Promise<Deed | null> {
  const db = getDb();
  const row = db.select().from(deeds).where(eq(deeds.id, id)).get();
  return row ?? null;
}

export async function unlockedIds(
  _profileLevel: number,
  completedIds: number[],
  skippedIds: number[],
): Promise<number[]> {
  const db = getDb();
  const all = db
    .select()
    .from(deeds)
    .orderBy(asc(deeds.sortOrder))
    .all();
  const completed = new Set(completedIds);
  const skipped = new Set(skippedIds);
  const unlocked: number[] = [];

  for (const deed of all) {
    if (skipped.has(deed.id)) continue;
    const prereqs = all.filter(
      (d) =>
        d.unitId === deed.unitId &&
        d.branchGroup === deed.branchGroup &&
        d.sortOrder < deed.sortOrder,
    );
    const allCleared =
      prereqs.length === 0 ||
      prereqs.every((p) => completed.has(p.id) || skipped.has(p.id));
    if (allCleared) unlocked.push(deed.id);
  }

  return unlocked;
}
