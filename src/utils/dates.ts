export function todayIso(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function yesterdayIso(d: Date = new Date()): string {
  const prev = new Date(d);
  prev.setDate(prev.getDate() - 1);
  return todayIso(prev);
}

export function nowIsoUtc(d: Date = new Date()): string {
  return d.toISOString();
}

export function isValidDayBucket(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}
