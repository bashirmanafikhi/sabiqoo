import { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  Text,
  View,
  type ListRenderItemInfo,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { DeedCard } from '@/components/DeedCard';
import { AppTopBar } from '@/components/AppTopBar';
import { Bilingual } from '@/components/Bilingual';
import { useColors } from '@/theme/tokens';
import { useLocale } from '@/i18n/LocaleProvider';
import { getDb } from '@/db';
import { userBookmarks, type Deed, type Category } from '@/db/schema';
import * as deedsRepo from '@/repos/deedsRepo';
import * as categoriesRepo from '@/repos/categoriesRepo';
import * as skippedRepo from '@/repos/skippedRepo';
import * as bookmarksRepo from '@/repos/bookmarksRepo';

type Locale = 'ar' | 'en';

interface BookmarkRow {
  deed: Deed;
  category: Category | null;
  createdAt: string;
}

function titleFor(deed: Deed, locale: Locale): string {
  return locale === 'ar' ? deed.titleAr : deed.titleEn;
}

function categoryName(c: Category | null, locale: Locale): string {
  if (!c) return '';
  return locale === 'ar' ? c.nameAr : c.nameEn;
}

export default function BookmarksScreen() {
  const colors = useColors();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { locale: localeCtx, setLocale } = useLocale();
  const locale: Locale = localeCtx ?? (i18n.language && i18n.language.startsWith('ar') ? 'ar' : 'en');

  const [rows, setRows] = useState<BookmarkRow[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);
  const [skippedIds, setSkippedIds] = useState<number[]>([]);

  const load = useCallback(async () => {
    const db = getDb();
    const bookmarkRows = db
      .select({
        deedId: userBookmarks.deedId,
        createdAt: userBookmarks.createdAt,
      })
      .from(userBookmarks)
      .all();
    const deedIds = bookmarkRows.map(r => r.deedId);
    if (deedIds.length === 0) {
      setRows([]);
      setBookmarkedIds([]);
      setSkippedIds([]);
      return;
    }
    const allDeeds = await deedsRepo.listAll();
    const allCats = await categoriesRepo.list();
    const catById = new Map(allCats.map(c => [c.id, c] as const));
    const deedById = new Map(allDeeds.map(d => [d.id, d] as const));
    const built: BookmarkRow[] = [];
    for (const b of bookmarkRows) {
      const d = deedById.get(b.deedId);
      if (!d) continue;
      built.push({
        deed: d,
        category: catById.get(d.categoryId) ?? null,
        createdAt: b.createdAt,
      });
    }
    built.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    setRows(built);
    setBookmarkedIds(deedIds);
    const sk = await skippedRepo.listAll();
    setSkippedIds(sk);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load().catch(err => console.warn('[bookmarks] load', err));
    }, [load]),
  );

  const onToggleBookmark = useCallback(async (id: number) => {
    await bookmarksRepo.remove(id);
    setBookmarkedIds(prev => prev.filter(x => x !== id));
    setRows(prev => prev.filter(r => r.deed.id !== id));
  }, []);

  const onToggleSkip = useCallback(async (id: number) => {
    if (skippedIds.includes(id)) {
      await skippedRepo.unSkip(id);
      setSkippedIds(prev => prev.filter(x => x !== id));
    } else {
      await skippedRepo.skip(id);
      setSkippedIds(prev => [...prev, id]);
    }
  }, [skippedIds]);

  const onToggleLocale = useCallback(() => {
    setLocale(locale === 'ar' ? 'en' : 'ar').catch(err => console.warn('[bookmarks] locale', err));
  }, [locale, setLocale]);

  const onSettings = useCallback(() => {
    router.push('/settings');
  }, [router]);

  const onAvatar = useCallback(() => {
    router.push('/settings');
  }, [router]);

  const renderItem = ({ item }: ListRenderItemInfo<BookmarkRow>) => (
    <View style={{ paddingHorizontal: 8, marginVertical: 6 }}>
      <DeedCard
        deed={{
          id: item.deed.id,
          title: titleFor(item.deed, locale),
          category_color: item.category?.colorCode ?? '#EA5455',
          xp_reward: item.deed.xpReward,
          locked: false,
          bookmarked: true,
        }}
        onPress={() => router.push(`/deed/${item.deed.id}`)}
        onToggleBookmark={() => onToggleBookmark(item.deed.id)}
        onToggleSkip={() => onToggleSkip(item.deed.id)}
      />
      <Text
        className="ms-3 mt-1 text-xs"
        style={{ color: colors.textMuted }}
      >
        {item.category ? categoryName(item.category, locale) : ''}
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: 0 }}>
      <Stack.Screen options={{ title: t('bookmarks.title'), headerShown: false }} />
      <AppTopBar
        streakDays={7}
        xp={340}
        savedCount={rows.length}
        onSettings={onSettings}
        onToggleLocale={onToggleLocale}
        onAvatar={onAvatar}
      />
      <View className="px-gutter pt-20 pb-2">
        <Bilingual
          primary={t('bookmarks.title')}
          secondary={locale === 'ar' ? 'Saved Deeds' : 'المحفوظات'}
        />
      </View>

      {rows.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <Ionicons name="heart-outline" size={64} color={colors.textMuted} />
          <Text
            className="mt-4 text-center text-base"
            style={{ color: colors.textMuted }}
          >
            {t('bookmarks.empty')}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('bookmarks.emptyCta')}
            onPress={() => router.push('/catalog')}
            style={{
              marginTop: 20,
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: '#1D2B3D',
              backgroundColor: '#EA5455',
            }}
          >
            <Text className="text-base font-bold" style={{ color: '#FFFFFF' }}>
              {t('bookmarks.emptyCta')}
            </Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={rows}
          renderItem={renderItem}
          keyExtractor={r => String(r.deed.id)}
          contentContainerStyle={{ paddingVertical: 12 }}
        />
      )}
    </View>
  );
}
