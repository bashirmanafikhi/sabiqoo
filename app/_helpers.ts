import type { Deed, Category, Unit, UserLog } from '@/db/schema';

export type Locale = 'ar' | 'en';

export function pickLocale(lng: string | undefined): Locale {
  return lng && lng.startsWith('ar') ? 'ar' : 'en';
}

export function titleFor(deed: Deed | null, locale: Locale): string {
  if (!deed) return '';
  return locale === 'ar' ? deed.titleAr : deed.titleEn;
}

export function descriptionFor(deed: Deed, locale: Locale): string {
  return locale === 'ar' ? deed.descriptionAr : deed.descriptionEn;
}

export function categoryName(c: Category, locale: Locale): string {
  return locale === 'ar' ? c.nameAr : c.nameEn;
}

export function unitTitleFor(unit: Unit, locale: Locale): string {
  return locale === 'ar' ? unit.titleAr : unit.titleEn;
}

export function todayIsoLocal(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function yesterdayIsoLocal(): string {
  const prev = new Date();
  prev.setDate(prev.getDate() - 1);
  const y = prev.getFullYear();
  const m = String(prev.getMonth() + 1).padStart(2, '0');
  const day = String(prev.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function buildLast30Days(today: string): string[] {
  const buckets: string[] = [];
  const parts = today.split('-').map(Number);
  const y = parts[0] ?? 1970;
  const m = parts[1] ?? 1;
  const d = parts[2] ?? 1;
  const start = new Date(y, m - 1, d - 29);
  for (let i = 0; i < 30; i += 1) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    const yy = day.getFullYear();
    const mm = String(day.getMonth() + 1).padStart(2, '0');
    const dd = String(day.getDate()).padStart(2, '0');
    buckets.push(`${yy}-${mm}-${dd}`);
  }
  return buckets;
}

export function dayShort(bucket: string, locale: Locale): string {
  const parts = bucket.split('-').map(Number);
  const y = parts[0] ?? 1970;
  const m = parts[1] ?? 1;
  const d = parts[2] ?? 1;
  const date = new Date(y, m - 1, d);
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar' : 'en-US', {
    weekday: 'short',
  }).format(date);
}

export function dayKey(iso: string): string {
  return iso.slice(0, 10);
}

export function parseLocalDay(bucket: string): Date {
  const parts = bucket.split('-');
  const y = Number(parts[0] ?? 1970);
  const m = Number(parts[1] ?? 1);
  const d = Number(parts[2] ?? 1);
  return new Date(y, m - 1, d);
}

export function dayLabel(
  bucket: string,
  locale: Locale,
  today: string,
): string {
  if (bucket === today) return locale === 'ar' ? 'اليوم' : 'Today';
  const t = parseLocalDay(today);
  const d = parseLocalDay(bucket);
  const diff = Math.round((t.getTime() - d.getTime()) / 86_400_000);
  if (diff === 1) return locale === 'ar' ? 'أمس' : 'Yesterday';
  return locale === 'ar' ? `منذ ${diff} يوم` : `${diff} days ago`;
}

export function computeUnlockedIds(
  deeds: Deed[],
  logCounts: Record<number, number>,
  skippedIds: number[],
): Set<number> {
  const completed = new Set(
    Object.entries(logCounts)
      .filter(([, c]) => (c ?? 0) > 0)
      .map(([id]) => Number(id)),
  );
  const skipped = new Set(skippedIds);
  const out = new Set<number>();
  const deedsByUnit = new Map<number, Deed[]>();
  for (const d of deeds) {
    const arr = deedsByUnit.get(d.unitId) ?? [];
    arr.push(d);
    deedsByUnit.set(d.unitId, arr);
  }
  const categoryTotal = new Map<number, number>();
  const categoryDone = new Map<number, number>();
  for (const d of deeds) {
    categoryTotal.set(
      d.categoryId,
      (categoryTotal.get(d.categoryId) ?? 0) + 1,
    );
    if (completed.has(d.id)) {
      categoryDone.set(
        d.categoryId,
        (categoryDone.get(d.categoryId) ?? 0) + 1,
      );
    }
  }
  for (const d of deeds) {
    if (skipped.has(d.id)) continue;
    if (d.difficultyLevel === 1) {
      const peers = (deedsByUnit.get(d.unitId) ?? []).filter(
        x => x.id !== d.id && x.difficultyLevel === 1,
      );
      if (peers.some(p => completed.has(p.id))) out.add(d.id);
    } else {
      const total = categoryTotal.get(d.categoryId) ?? 0;
      const done = categoryDone.get(d.categoryId) ?? 0;
      const ratio = total > 0 ? done / total : 0;
      if (ratio >= 1 / 3) out.add(d.id);
    }
  }
  return out;
}
