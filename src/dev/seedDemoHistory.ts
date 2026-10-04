import { getDb } from '@/db';
import { history } from '@/db/schema';
import { suggestionByKey } from '@/content/catalog';
import * as historyRepo from '@/repos/historyRepo';

// Dev-only demo data: fills an EMPTY history with sample completions spread
// over the past week so lists, badges and the per-deed history can be
// reviewed on a fresh install. It never runs in production builds and never
// touches a non-empty history — to re-seed, use Settings → Erase history
// and relaunch. Set to false to stop seeding entirely.
const SEED_DEMO_HISTORY = __DEV__;

/** [deed key, days ago, local hour, local minute] */
const DEMO_ENTRIES: ReadonlyArray<readonly [string, number, number, number]> = [
  // today — incl. a same-day redo so the ×2 badge shows
  ['ch-sadaqah-little', 0, 8, 15],
  ['ch-sadaqah-little', 0, 20, 40],
  ['fam-call-parents', 0, 10, 5],
  ['dh-morning-adhkar', 0, 6, 40],
  // past week
  ['qr-page-daily', 1, 9, 0],
  ['kind-hold-door', 1, 12, 30],
  ['pr-early-time', 1, 5, 45],
  ['nat-plant-tree', 2, 17, 20],
  ['fam-visit-parents', 2, 18, 45],
  ['dh-evening-adhkar', 3, 19, 30],
  ['com-volunteer-hour', 3, 15, 0],
  ['qr-surah-mulk', 4, 22, 10],
  ['pr-mosque', 5, 6, 5],
  ['kind-good-word', 5, 11, 15],
  ['nat-feed-strays', 6, 8, 30],
  ['qr-tadabbur', 6, 21, 40],
];

/** Local 'YYYY-MM-DD' for the day, plus the matching UTC 'YYYY-MM-DD HH:MM:SS' timestamp. */
function stamp(agoDays: number, hour: number, minute: number): { day: string; createdAt: string } {
  const d = new Date();
  d.setDate(d.getDate() - agoDays);
  d.setHours(hour, minute, 0, 0);
  const p = (n: number) => String(n).padStart(2, '0');
  return {
    day: `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`,
    createdAt: `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())}`,
  };
}

export async function seedDemoHistoryIfEmpty(): Promise<void> {
  if (!SEED_DEMO_HISTORY) return;
  if ((await historyRepo.total()) !== 0) return;
  const db = getDb();
  for (const [key, ago, hour, minute] of DEMO_ENTRIES) {
    const deed = suggestionByKey(key);
    if (!deed) continue;
    const { day, createdAt } = stamp(ago, hour, minute);
    db.insert(history)
      .values({ key: deed.key, titleAr: deed.ar, titleEn: deed.en, day, createdAt })
      .run();
  }
}
