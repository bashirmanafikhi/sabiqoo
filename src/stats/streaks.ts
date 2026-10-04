/**
 * Pure streak math over sorted 'YYYY-MM-DD' day strings (local calendar days).
 */
export interface Streaks {
  current: number;
  longest: number;
}

function toDay(s: string): number {
  const parts = s.split('-').map(Number);
  const y = parts[0] ?? 1970;
  const m = parts[1] ?? 1;
  const d = parts[2] ?? 1;
  return new Date(y, m - 1, d).getTime();
}

function isNextDay(prev: string, next: string): boolean {
  return Math.round((toDay(next) - toDay(prev)) / 86_400_000) === 1;
}

/**
 * @param days logged days ('YYYY-MM-DD'), any order, duplicates allowed
 * @param today today's local day, same format
 */
export function computeStreaks(days: string[], today: string): Streaks {
  const unique = [...new Set(days)].sort();

  let longest = 0;
  let run = 0;
  let prev: string | null = null;
  for (const day of unique) {
    run = prev !== null && isNextDay(prev, day) ? run + 1 : 1;
    longest = Math.max(longest, run);
    prev = day;
  }

  // Current streak: anchored on today if logged, else yesterday (today is
  // still in progress — the streak is alive, just not extended yet).
  const set = new Set(unique);
  const anchor = set.has(today) ? today : set.has(shiftDay(today, -1)) ? shiftDay(today, -1) : null;

  let current = 0;
  if (anchor !== null) {
    let cursor = anchor;
    while (set.has(cursor)) {
      current += 1;
      cursor = shiftDay(cursor, -1);
    }
  }

  return { current, longest };
}

export function shiftDay(day: string, delta: number): string {
  const t = toDay(day) + delta * 86_400_000;
  const d = new Date(t);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}
