import { and, desc, eq, sql } from 'drizzle-orm';
import { getDb } from '@/db';
import { history, type HistoryEntry } from '@/db/schema';

export interface AddEntryInput {
  key: string;
  titleAr: string;
  titleEn: string;
  day: string;
}

/** Records one completion. Redoing the same deed the same day is allowed — every log is kept. */
export async function add(input: AddEntryInput): Promise<boolean> {
  const db = getDb();
  db.insert(history).values(input).run();
  return true;
}

/** Undoes the most recent completion of `key` on `day`, leaving earlier ones in the history. */
export async function remove(key: string, day: string): Promise<void> {
  const db = getDb();
  db.run(
    sql`DELETE FROM history WHERE id = (
      SELECT id FROM history WHERE key = ${key} AND day = ${day} ORDER BY id DESC LIMIT 1
    )`,
  );
}

/** Removes one exact row (History tab long-press). */
export async function removeById(id: number): Promise<void> {
  const db = getDb();
  db.delete(history).where(eq(history.id, id)).run();
}

export async function isDone(key: string, day: string): Promise<boolean> {
  const db = getDb();
  const row = db
    .select()
    .from(history)
    .where(and(eq(history.key, key), eq(history.day, day)))
    .get();
  return row !== undefined;
}

/** Keys logged on `day` — feeds done/undone state. */
export async function doneKeysForDay(day: string): Promise<Set<string>> {
  const db = getDb();
  const rows = db
    .select({ key: history.key })
    .from(history)
    .where(eq(history.day, day))
    .all();
  return new Set(rows.map((r) => r.key));
}

/** key → how many times logged on `day` — feeds the ×N badge and redo UI. */
export async function countsForDay(day: string): Promise<Map<string, number>> {
  const db = getDb();
  const rows = db
    .select({ key: history.key, value: sql<number>`count(*)` })
    .from(history)
    .where(eq(history.day, day))
    .groupBy(history.key)
    .all();
  return new Map(rows.map((r) => [r.key, r.value]));
}

/** key → total times ever logged — the forever-checked state on the lists. */
export async function countsAll(): Promise<Map<string, number>> {
  const db = getDb();
  const rows = db
    .select({ key: history.key, value: sql<number>`count(*)` })
    .from(history)
    .groupBy(history.key)
    .all();
  return new Map(rows.map((r) => [r.key, r.value]));
}

/** Unchecks a deed: removes its most recent log, whatever day it was on. */
export async function removeLatest(key: string): Promise<void> {
  const db = getDb();
  db.run(
    sql`DELETE FROM history WHERE id = (
      SELECT id FROM history WHERE key = ${key} ORDER BY id DESC LIMIT 1
    )`,
  );
}

/** Newest first (day desc, then insertion order desc) — feeds the History tab. */
export async function listAll(): Promise<HistoryEntry[]> {
  const db = getDb();
  return db
    .select()
    .from(history)
    .orderBy(desc(history.day), desc(history.id))
    .all();
}

export async function total(): Promise<number> {
  const db = getDb();
  const row = db
    .select({ value: sql<number>`count(*)` })
    .from(history)
    .get();
  return row?.value ?? 0;
}

/** Erases the whole history (Settings → Erase history). */
export async function removeAll(): Promise<void> {
  const db = getDb();
  db.delete(history).run();
}
