import { useCallback, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LogRow } from '@/components/LogRow';
import { useColors } from '@/theme/tokens';
import * as logsRepo from '@/repos/logsRepo';
import * as deedsRepo from '@/repos/deedsRepo';
import * as categoriesRepo from '@/repos/categoriesRepo';
import {
  pickLocale,
  titleFor,
  todayIsoLocal,
  buildLast30Days,
  dayShort,
  type Locale,
} from '../_helpers';
import type { UserLog, Deed, Category } from '@/db/schema';

interface DayCell {
  bucket: string;
  count: number;
}

interface CategoryBar {
  category: Category;
  count: number;
}

interface HistoryRow {
  log: UserLog;
  deed: Deed | null;
}

function heatColor(
  count: number,
  maxDay: number,
  brand: string,
  surface: string,
): string {
  if (count === 0) return surface;
  if (maxDay <= 1) return brand;
  const ratio = count / maxDay;
  if (ratio < 0.34) return brand + '66';
  if (ratio < 0.67) return brand + 'AA';
  return brand;
}

export default function HistoryScreen() {
  const colors = useColors();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const locale: Locale = pickLocale(i18n.language);

  const [logs, setLogs] = useState<UserLog[]>([]);
  const [deeds, setDeeds] = useState<Deed[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [byDay, setByDay] = useState<
    { day_bucket: string; count: number }[]
  >([]);
  const [byCategory, setByCategory] = useState<
    { category_id: number; count: number }[]
  >([]);

  const today = useMemo(() => todayIsoLocal(), []);
  const last30 = useMemo(() => buildLast30Days(today), [today]);
  const fromDay = last30[0] ?? today;
  const toDay = last30[last30.length - 1] ?? today;

  const load = useCallback(async () => {
    const [l, d, c, bd, bc] = await Promise.all([
      logsRepo.listAll(),
      deedsRepo.listAll(),
      categoriesRepo.list(),
      logsRepo.countByDay(fromDay, toDay),
      logsRepo.countByCategory(),
    ]);
    setLogs(l);
    setDeeds(d);
    setCategories(c);
    setByDay(bd);
    setByCategory(bc);
  }, [fromDay, toDay]);

  useFocusEffect(
    useCallback(() => {
      load().catch(err => console.warn('[history] load', err));
    }, [load]),
  );

  const heatmap: DayCell[] = useMemo(() => {
    const map = new Map(byDay.map(r => [r.day_bucket, r.count] as const));
    return last30.map(bucket => ({
      bucket,
      count: map.get(bucket) ?? 0,
    }));
  }, [byDay, last30]);

  const maxDay = useMemo(
    () => heatmap.reduce((m, c) => (c.count > m ? c.count : m), 0),
    [heatmap],
  );

  const bars: CategoryBar[] = useMemo(() => {
    const catById = new Map(categories.map(c => [c.id, c] as const));
    return byCategory
      .map(r => {
        const cat = catById.get(r.category_id);
        if (!cat) return null;
        return { category: cat, count: r.count };
      })
      .filter((x): x is CategoryBar => x !== null)
      .sort((a, b) => b.count - a.count);
  }, [byCategory, categories]);

  const maxBar = useMemo(
    () => bars.reduce((m, b) => (b.count > m ? b.count : m), 0),
    [bars],
  );

  const rows: HistoryRow[] = useMemo(() => {
    const deedById = new Map(deeds.map(d => [d.id, d] as const));
    return logs.map(l => ({ log: l, deed: deedById.get(l.deedId) ?? null }));
  }, [logs, deeds]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Stack.Screen options={{ title: t('history.title'), headerShown: false }} />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: colors.bg,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('common.close')}
          onPress={() => router.back()}
          hitSlop={8}
          style={{ paddingHorizontal: 4 }}
        >
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text
          className="flex-1 ms-2 text-base font-bold"
          style={{ color: colors.textPrimary }}
        >
          {t('history.title')}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 48 }}>
        <Text
          className="mb-2 text-sm font-bold"
          style={{ color: colors.textPrimary }}
        >
          {t('history.last30Days')}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.elevated,
            padding: 8,
            gap: 4,
          }}
        >
          {heatmap.map(cell => (
            <View
              key={cell.bucket}
              accessibilityRole="text"
              accessibilityLabel={`${cell.bucket} ${cell.count}`}
              style={{
                width: 22,
                height: 22,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: colors.ink,
                backgroundColor: heatColor(
                  cell.count,
                  maxDay,
                  colors.brand,
                  colors.surface,
                ),
              }}
            />
          ))}
        </View>

        <Text
          className="mb-2 mt-6 text-sm font-bold"
          style={{ color: colors.textPrimary }}
        >
          {t('history.byCategory')}
        </Text>
        <View
          style={{
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.elevated,
            padding: 12,
          }}
        >
          {bars.length === 0 ? (
            <Text
              className="text-sm"
              style={{ color: colors.textMuted, textAlign: 'center' }}
            >
              {t('deed.history.empty')}
            </Text>
          ) : (
            bars.map(b => {
              const pct = maxBar === 0 ? 0 : b.count / maxBar;
              return (
                <View key={b.category.id} style={{ marginVertical: 6 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text
                      className="text-xs font-bold"
                      style={{ color: colors.textPrimary }}
                    >
                      {locale === 'ar'
                        ? b.category.nameAr
                        : b.category.nameEn}
                    </Text>
                    <Text
                      className="text-xs"
                      style={{ color: colors.textMuted }}
                    >
                      {b.count}
                    </Text>
                  </View>
                  <View
                    style={{
                      marginTop: 4,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: colors.surface,
                      borderWidth: 1,
                      borderColor: colors.border,
                      overflow: 'hidden',
                    }}
                  >
                    <View
                      style={{
                        width: `${Math.max(pct * 100, b.count > 0 ? 4 : 0)}%`,
                        height: '100%',
                        backgroundColor: b.category.colorCode,
                      }}
                    />
                  </View>
                </View>
              );
            })
          )}
        </View>

        <Text
          className="mb-2 mt-6 text-sm font-bold"
          style={{ color: colors.textPrimary }}
        >
          {t('history.title')}
        </Text>
        {rows.length === 0 ? (
          <Text
            className="text-sm"
            style={{ color: colors.textMuted, textAlign: 'center', marginTop: 12 }}
          >
            {t('deed.history.empty')}
          </Text>
        ) : (
          <View
            style={{
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.elevated,
            }}
          >
            {rows.map(r => (
              <LogRow
                key={r.log.id}
                log={{
                  quantity: r.log.quantity,
                  xp_earned: r.log.xpEarned,
                  completed_at: r.log.completedAt,
                  note: r.log.note,
                }}
                deedTitle={titleFor(r.deed, locale)}
                locale={locale}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
