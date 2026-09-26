import { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  type ListRenderItemInfo,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { DeedCard } from '@/components/DeedCard';
import { ProgressBadge } from '@/components/ProgressBadge';
import { useColors } from '@/theme/tokens';
import * as deedsRepo from '@/repos/deedsRepo';
import * as logsRepo from '@/repos/logsRepo';
import * as categoriesRepo from '@/repos/categoriesRepo';
import * as bookmarksRepo from '@/repos/bookmarksRepo';
import * as skippedRepo from '@/repos/skippedRepo';
import type { Deed, Category } from '@/db/schema';
import {
  pickLocale,
  titleFor,
  descriptionFor,
  categoryName,
  computeUnlockedIds,
  type Locale,
} from '../_helpers';

interface CatalogDeed {
  deed: Deed;
  category_color: string;
  xp_reward: number;
  locked: boolean;
  bookmarked: boolean;
}

export default function CatalogScreen() {
  const colors = useColors();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const locale: Locale = pickLocale(i18n.language);

  const [deeds, setDeeds] = useState<Deed[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [logCounts, setLogCounts] = useState<Record<number, number>>({});
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);
  const [skippedIds, setSkippedIds] = useState<number[]>([]);
  const [activeCategories, setActiveCategories] = useState<number[]>([]);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    const [d, c, bm, sk] = await Promise.all([
      deedsRepo.listAll(),
      categoriesRepo.list(),
      bookmarksRepo.listAll(),
      skippedRepo.listAll(),
    ]);
    setDeeds(d);
    setCategories(c);
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
      load().catch(err => console.warn('[catalog] load', err));
    }, [load]),
  );

  const categoryProgress = useMemo(() => {
    const byCat: Record<number, { done: number; total: number }> = {};
    for (const c of categories) byCat[c.id] = { done: 0, total: 0 };
    for (const d of deeds) {
      const bucket = byCat[d.categoryId];
      if (!bucket) continue;
      bucket.total += 1;
      if ((logCounts[d.id] ?? 0) > 0) bucket.done += 1;
    }
    return byCat;
  }, [deeds, categories, logCounts]);

  const unlockedIds = useMemo(
    () => computeUnlockedIds(deeds, logCounts, skippedIds),
    [deeds, logCounts, skippedIds],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return deeds.filter(d => {
      if (
        activeCategories.length > 0 &&
        !activeCategories.includes(d.categoryId)
      ) {
        return false;
      }
      if (q.length > 0) {
        const haystack =
          `${titleFor(d, locale)} ${descriptionFor(d, locale)}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [deeds, activeCategories, search, locale]);

  const items: CatalogDeed[] = useMemo(() => {
    const catById = new Map(categories.map(c => [c.id, c] as const));
    return filtered.map(d => ({
      deed: d,
      category_color: catById.get(d.categoryId)?.colorCode ?? '#58CC02',
      xp_reward: d.xpReward,
      locked: !unlockedIds.has(d.id),
      bookmarked: bookmarkedIds.includes(d.id),
    }));
  }, [filtered, categories, unlockedIds, bookmarkedIds]);

  const onToggleCategory = useCallback((cid: number) => {
    setActiveCategories(prev =>
      prev.includes(cid) ? prev.filter(x => x !== cid) : [...prev, cid],
    );
  }, []);

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

  const renderItem = ({ item }: ListRenderItemInfo<CatalogDeed>) => (
    <View style={{ flex: 1, padding: 6 }}>
      <DeedCard
        deed={{
          id: item.deed.id,
          title: titleFor(item.deed, locale),
          category_color: item.category_color,
          xp_reward: item.xp_reward,
          locked: item.locked,
          bookmarked: item.bookmarked,
        }}
        onPress={() => router.push(`/deed/${item.deed.id}`)}
        onToggleBookmark={() => onToggleBookmark(item.deed.id)}
        onToggleSkip={() => onToggleSkip(item.deed.id)}
      />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Stack.Screen
        options={{ title: t('catalog.title'), headerShown: false }}
      />
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: colors.bg,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: colors.border,
            backgroundColor: colors.elevated,
          }}
        >
          <Ionicons name="search" size={20} color={colors.textMuted} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder={t('catalog.searchPlaceholder')}
            placeholderTextColor={colors.textMuted}
            accessibilityLabel={t('catalog.searchPlaceholder')}
            accessibilityHint={t('catalog.searchHint')}
            style={{
              flex: 1,
              marginStart: 8,
              color: colors.textPrimary,
              fontSize: 16,
            }}
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingVertical: 12,
          gap: 8,
        }}
      >
        {categories.map(c => {
          const active = activeCategories.includes(c.id);
          const prog = categoryProgress[c.id] ?? { done: 0, total: 0 };
          return (
            <Pressable
              key={c.id}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => onToggleCategory(c.id)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 999,
                borderWidth: 2,
                borderColor: active ? colors.ink : colors.border,
                backgroundColor: active ? c.colorCode + '22' : colors.elevated,
              }}
            >
              <Text
                className="text-sm font-bold"
                style={{ color: colors.textPrimary, marginEnd: 8 }}
              >
                {categoryName(c, locale)}
              </Text>
              <ProgressBadge
                done={prog.done}
                total={prog.total}
                locale={locale}
              />
            </Pressable>
          );
        })}
      </ScrollView>

      {items.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <Ionicons name="book-outline" size={48} color={colors.textMuted} />
          <Text
            className="mt-4 text-base"
            style={{ color: colors.textMuted, textAlign: 'center' }}
          >
            {t('catalog.empty')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(it: CatalogDeed) => String(it.deed.id)}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 24 }}
        />
      )}
    </View>
  );
}
