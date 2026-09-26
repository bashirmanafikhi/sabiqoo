import type { Deed, Category } from '@/db/schema';

export type Locale = 'ar' | 'en';

export function pickLocale(lng: string | undefined): Locale {
  return lng && lng.startsWith('ar') ? 'ar' : 'en';
}

export function titleFor(deed: Deed, locale: Locale): string {
  return locale === 'ar' ? deed.titleAr : deed.titleEn;
}

export function categoryName(c: Category, locale: Locale): string {
  return locale === 'ar' ? c.nameAr : c.nameEn;
}

export function dayKey(iso: string): string {
  return iso.slice(0, 10);
}

function parseLocalDay(bucket: string): Date {
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
