export function xpForLevel(n: number): number {
  return (100 * n * (n + 1)) / 2;
}

export function levelFromXp(xp: number): number {
  let lvl = 1;
  while (xpForLevel(lvl + 1) <= xp) lvl++;
  return lvl;
}

export function xpIntoLevel(xp: number): {
  current: number;
  needed: number;
  percent: number;
} {
  const lvl = levelFromXp(xp);
  const base = xpForLevel(lvl);
  const next = xpForLevel(lvl + 1);
  const needed = next - base;
  const current = xp - base;
  const percent =
    needed === 0 ? 1 : Math.min(1, Math.max(0, current / needed));
  return { current, needed, percent };
}
