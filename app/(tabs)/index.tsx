import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useColors } from '@/theme/tokens';
import { useLocale } from '@/i18n/LocaleProvider';
import { CATEGORIES, SUGGESTIONS } from '@/content/catalog';
import * as historyRepo from '@/repos/historyRepo';
import * as haptics from '@/utils/haptics';

export default function DiscoverScreen() {
  const colors = useColors();
  const { t } = useTranslation();
  const { locale } = useLocale();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [doneCounts, setDoneCounts] = useState<Map<string, number>>(new Map());

  const load = useCallback(async () => {
    try {
      setDoneCounts(await historyRepo.countsAll());
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load().catch(() => {});
    }, [load]),
  );

  const totalCompletions = [...doneCounts.values()].reduce((sum, n) => sum + n, 0);

  const open = useCallback(
    (id: string) => {
      haptics.selection();
      router.push(`/category/${id}`);
    },
    [router],
  );

  /** How many distinct deeds of this category have ever been completed. */
  const doneInCategory = (categoryId: string) =>
    SUGGESTIONS.filter(
      (s) => s.category === categoryId && (doneCounts.get(s.key) ?? 0) > 0,
    ).length;

  const headingFont = locale === 'ar' ? 'font-arabic' : 'font-headline';

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pt-3 pb-2">
          <View style={{ flexShrink: 1 }}>
            <Text
              className={`${headingFont} text-headline-lg`}
              style={{ color: colors.text }}
            >
              {t('app.name')}
            </Text>
            <Text className="font-body text-body-sm" style={{ color: colors.textMuted }} numberOfLines={1}>
              {t('app.tagline')}
            </Text>
          </View>
          <View
            className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ backgroundColor: colors.surface }}
            accessibilityLabel={t('discover.donePillAria', {
              count: totalCompletions,
              deeds: t('plurals.deeds', { count: totalCompletions }),
            })}
          >
            <Ionicons name="checkmark-done" size={18} color={colors.success} />
            <Text className="font-label-md text-label-md" style={{ color: colors.text }}>
              {totalCompletions}
            </Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator color={colors.coral} style={{ marginTop: 48 }} />
        ) : (
          <CategoryGrid />
        )}
      </SafeAreaView>
    </View>
  );

  function CategoryGrid() {
    return (
      <View className="flex-row flex-wrap justify-between px-4 pb-6">
        {[
          { id: 'all', ar: t('discover.all'), en: t('discover.all'), icon: 'grid-outline' },
          ...CATEGORIES,
        ].map((cat) => {
          const count =
            cat.id === 'all'
              ? SUGGESTIONS.length
              : SUGGESTIONS.filter((s) => s.category === cat.id).length;
          const done =
            cat.id === 'all'
              ? SUGGESTIONS.filter((s) => (doneCounts.get(s.key) ?? 0) > 0).length
              : doneInCategory(cat.id);
          return (
            <Pressable
              key={cat.id}
              accessibilityRole="button"
              accessibilityLabel={locale === 'ar' ? cat.ar : cat.en}
              testID={`chip-${cat.id}`}
              onPress={() => open(cat.id)}
              className="rounded-2xl mb-2"
              style={{
                width: cat.id === 'all' ? '100%' : '48.5%',
                backgroundColor: colors.surfaceLowest,
                borderWidth: 1,
                borderColor: colors.border,
                paddingVertical: 14,
                paddingHorizontal: 12,
                flexDirection: locale === 'ar' ? 'row-reverse' : 'row',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <View
                className="items-center justify-center rounded-full"
                style={{ width: 40, height: 40, backgroundColor: colors.surface }}
              >
                <Ionicons
                  name={cat.icon as keyof typeof Ionicons.glyphMap}
                  size={20}
                  color={colors.textMuted}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  numberOfLines={1}
                  className="font-label-md text-label-md"
                  style={{ color: colors.text, fontWeight: '700' }}
                >
                  {locale === 'ar' ? cat.ar : cat.en}
                </Text>
                <Text
                  numberOfLines={1}
                  className="font-body text-body-sm"
                  style={{ color: colors.textMuted }}
                >
                  {done > 0
                    ? t('discover.categoryDone', { done, count })
                    : `${count} ${t('plurals.deeds', { count })}`}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    );
  }
}
