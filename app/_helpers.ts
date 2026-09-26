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
  // Sets for O(1) lookups
  const completed = new Set(
    Object.entries(logCounts)
      .filter(([, c]) => (c ?? 0) > 0)
      .map(([id]) => Number(id)),
  );
  const skipped = new Set(skippedIds);

  // Group deeds by unit, sorted by sort_order
  const byUnit = new Map<number, Deed[]>();
  for (const d of deeds) {
    const arr = byUnit.get(d.unitId) ?? [];
    arr.push(d);
    byUnit.set(d.unitId, arr);
  }
  for (const arr of byUnit.values()) arr.sort((a, b) => a.sortOrder - b.sortOrder);

  const unlocked = new Set<number>();

  for (const [unitId, arr] of byUnit) {
    // Within the unit, sort by sort_order. Track the highest sort_order whose
    // (a) preceding deed has been completed OR
    // (b) any branch-alternative sibling (same branch_group) with lower
    //     sort_order has been completed.
    // A deed is unlocked if its sort_order <= frontier, OR the predecessor
    // condition holds. Skipped deeds never unlock and never count as
    // completion of the frontier.
    let frontier = 0;
    for (const d of arr) {
      const sortOrder = d.sortOrder;
      if (skipped.has(d.id)) continue;

      // First deed in the unit is always unlocked (entry-point per unit).
      if (sortOrder === 1) {
        unlocked.add(d.id);
        if (completed.has(d.id)) {
          frontier = sortOrder;
        }
        continue;
      }

      // The deed is unlocked if EITHER:
      //   (a) any same-unit deed with sort_order < sortOrder has been
      //       completed (and not skipped), OR
      //   (b) any same-unit, same-branch-group deed with sort_order <
      //       sortOrder has been completed (alt-branch semantics).
      const predecessors = arr.filter(
        x => x.sortOrder < sortOrder && !skipped.has(x.id),
      );
      const linearGate = predecessors.some(p => completed.has(p.id));
      const branchGate = predecessors.some(
        p => p.branchGroup === d.branchGroup && completed.has(p.id),
      );
      if (linearGate || branchGate) {
        unlocked.add(d.id);
      }
      if (completed.has(d.id)) {
        frontier = Math.max(frontier, sortOrder);
      }
    }
  }

  return unlocked;
}
