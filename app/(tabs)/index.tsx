import { useCallback, useMemo, useState } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StreakBadge } from '@/components/StreakBadge';
import { XpBar } from '@/components/XpBar';
import { HeartButton } from '@/components/HeartButton';
import { Node, type NodeState } from '@/components/Node';
import { UnitProgress } from '@/components/UnitProgress';
import { useColors } from '@/theme/tokens';
import { useLocale } from '@/i18n/LocaleProvider';
import * as unitsRepo from '@/repos/unitsRepo';
import * as deedsRepo from '@/repos/deedsRepo';
import * as logsRepo from '@/repos/logsRepo';
import * as bookmarksRepo from '@/repos/bookmarksRepo';
import * as skippedRepo from '@/repos/skippedRepo';
import * as categoriesRepo from '@/repos/categoriesRepo';
import * as profileRepo from '@/repos/profileRepo';
import type { Unit, Deed, Category, UserProfile } from '@/db/schema';
import {
  pickLocale,
  unitTitleFor,
  computeUnlockedIds,
  type Locale,
} from '../_helpers';

interface UnitRow {
  unit: Unit;
  deeds: Deed[];
  done: number;
  total: number;
}

function stateFor(
  deedId: number,
  skippedIds: number[],
  logCounts: Record<number, number>,
  unlockedIds: Set<number>,
): NodeState {
  if (skippedIds.includes(deedId)) return 'skipped';
  const count = logCounts[deedId] ?? 0;
  if (count >= 10) return 'mastered';
  if (count >= 1) return 'completed';
  if (unlockedIds.has(deedId)) return 'available';
  return 'locked';
}

export default function RoadmapScreen() {
  const colors = useColors();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { locale, setLocale } = useLocale();
  const activeLocale: Locale = locale ?? pickLocale(i18n.language);

  const [units, setUnits] = useState<Unit[]>([]);
  const [deeds, setDeeds] = useState<Deed[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [logCounts, setLogCounts] = useState<Record<number, number>>({});
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);
  const [skippedIds, setSkippedIds] = useState<number[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const [u, d, p, bm, sk] = await Promise.all([
      unitsRepo.list(),
      deedsRepo.listAll(),
      profileRepo.get(),
      bookmarksRepo.listAll(),
      skippedRepo.listAll(),
    ]);
    setUnits(u);
    setDeeds(d);
    setProfile(p);
    setBookmarkedIds(bm);
    setSkippedIds(sk);
    const counts: Record<number, number> = {};
    const logs = await logsRepo.listAll();
    for (const l of logs) {
      counts[l.deedId] = (counts[l.deedId] ?? 0) + 1;
    }
    setLogCounts(counts);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load().catch(err => console.warn('[roadmap] load', err));
    }, [load]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await load();
    } finally {
      setRefreshing(false);
    }
  }, [load]);

  const unlockedIds = useMemo(
    () => computeUnlockedIds(deeds, logCounts, skippedIds),
    [deeds, logCounts, skippedIds],
  );

  const rows: UnitRow[] = useMemo(() => {
    const deedsByUnit = new Map<number, Deed[]>();
    for (const d of deeds) {
      const arr = deedsByUnit.get(d.unitId) ?? [];
      arr.push(d);
      deedsByUnit.set(d.unitId, arr);
    }
    const out: UnitRow[] = [];
    for (const u of units) {
      const uDeeds = (deedsByUnit.get(u.id) ?? []).sort(
        (a, b) => a.sortOrder - b.sortOrder,
      );
      const total = uDeeds.length;
      const done = uDeeds.filter(d => (logCounts[d.id] ?? 0) > 0).length;
      out.push({ unit: u, deeds: uDeeds, done, total });
    }
    return out;
  }, [units, deeds, logCounts]);

  const onToggleBookmark = useCallback(
    async (id: number) => {
      if (bookmarkedIds.includes(id)) {
        await bookmarksRepo.remove(id);
        setBookmarkedIds(prev => prev.filter(x => x !== id));
      } else {
        await bookmarksRepo.add(id);
        setBookmarkedIds(prev => [...prev, id]);
      }
    },
    [bookmarkedIds],
  );

  const onToggleSkip = useCallback(
    async (id: number) => {
      if (skippedIds.includes(id)) {
        await skippedRepo.unSkip(id);
        setSkippedIds(prev => prev.filter(x => x !== id));
      } else {
        await skippedRepo.skip(id);
        setSkippedIds(prev => [...prev, id]);
      }
    },
    [skippedIds],
  );

  const onToggleLocale = useCallback(() => {
    setLocale(activeLocale === 'ar' ? 'en' : 'ar').catch(err =>
      console.warn('[roadmap] locale', err),
    );
  }, [activeLocale, setLocale]);

  const header = (
    <View
      style={{
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 12,
        backgroundColor: colors.bg,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <StreakBadge
          streak={profile?.currentStreak ?? 0}
          locale={activeLocale}
        />
        <View style={{ flex: 1, marginHorizontal: 12 }}>
          <XpBar
            xp={profile?.currentXp ?? 0}
            level={profile?.currentLevel ?? 1}
            locale={activeLocale}
          />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <HeartButton
            deedId={-1}
            isFilled={bookmarkedIds.length > 0}
            onToggle={() => router.push('/bookmarks')}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('home.language')}
            onPress={onToggleLocale}
            hitSlop={8}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 999,
              borderWidth: 2,
              borderColor: colors.ink,
              backgroundColor: colors.elevated,
            }}
          >
            <Text
              className="text-xs font-bold"
              style={{ color: colors.textPrimary }}
            >
              {activeLocale === 'ar' ? 'EN' : 'ع'}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('home.settings')}
            onPress={() => router.push('/settings')}
            hitSlop={8}
            style={{ paddingHorizontal: 6 }}
          >
            <Ionicons
              name="settings-outline"
              size={24}
              color={colors.textPrimary}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );

  const renderUnit = (row: UnitRow) => (
    <View
      style={{
        marginHorizontal: 16,
        marginBottom: 24,
        padding: 16,
        borderRadius: 16,
        backgroundColor: colors.surface,
        borderWidth: 2,
        borderColor: colors.border,
      }}
    >
      <UnitProgress
        unitTitle={unitTitleFor(row.unit, activeLocale)}
        done={row.done}
        total={row.total}
        locale={activeLocale}
      />
      <View style={{ marginTop: 16 }}>
        {row.deeds.map((deed, idx) => {
          const state = stateFor(deed.id, skippedIds, logCounts, unlockedIds);
          const alignEnd = idx % 2 === 1;
          return (
            <View key={deed.id} style={{ marginVertical: 6 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: alignEnd ? 'flex-end' : 'flex-start',
                }}
              >
                <Node
                  state={state}
                  deedId={deed.id}
                  onPress={() => router.push(`/deed/${deed.id}`)}
                />
              </View>
              {idx < row.deeds.length - 1 ? (
                <View
                  pointerEvents="none"
                  style={{
                    height: 2,
                    alignSelf: alignEnd ? 'flex-end' : 'flex-start',
                    width: 28,
                    backgroundColor: colors.border,
                    marginVertical: 4,
                  }}
                />
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {header}
        <View style={{ paddingTop: 12 }}>
          {rows.map(row => (
            <View key={row.unit.id}>{renderUnit(row)}</View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
