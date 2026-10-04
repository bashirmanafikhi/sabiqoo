import { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useColors } from '@/theme/tokens';
import { useLocale } from '@/i18n/LocaleProvider';
import { SUGGESTIONS, categoryById, deedDesc, deedTitle, type DeedSuggestion } from '@/content/catalog';
import * as historyRepo from '@/repos/historyRepo';
import * as haptics from '@/utils/haptics';

export default function CategoryScreen() {
  const colors = useColors();
  const { t } = useTranslation();
  const { locale } = useLocale();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const categoryId = typeof id === 'string' ? id : 'all';

  const [doneCounts, setDoneCounts] = useState<Map<string, number>>(new Map());

  const load = useCallback(async () => {
    setDoneCounts(await historyRepo.countsAll());
  }, []);

  useFocusEffect(
    useCallback(() => {
      load().catch(() => {});
    }, [load]),
  );

  const deeds =
    categoryId === 'all'
      ? SUGGESTIONS
      : SUGGESTIONS.filter((s) => s.category === categoryId);

  const openDeed = useCallback(
    (deed: DeedSuggestion) => {
      haptics.selection();
      router.push(`/deed/${deed.key}`);
    },
    [router],
  );

  const surprise = useCallback(() => {
    if (deeds.length === 0) return;
    haptics.medium();
    const pick = deeds[Math.floor(Math.random() * deeds.length)];
    if (pick) router.push(`/deed/${pick.key}`);
  }, [deeds, router]);

  const category = categoryById(categoryId);
  const title =
    categoryId === 'all'
      ? t('discover.all')
      : category
        ? locale === 'ar' ? category.ar : category.en
        : t('discover.all');
  const headingFont = locale === 'ar' ? 'font-arabic' : 'font-headline';

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        {/* Header */}
        <View className="flex-row items-center gap-2 px-4 pt-3 pb-2">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('common.back')}
            testID="category-back"
            onPress={() => router.back()}
            hitSlop={8}
            className="items-center justify-center rounded-full"
            style={{ width: 38, height: 38, backgroundColor: colors.surface }}
          >
            <Ionicons name={locale === 'ar' ? 'arrow-forward' : 'arrow-back'} size={20} color={colors.text} />
          </Pressable>
          <Text
            className={`${headingFont} text-headline-md flex-1`}
            style={{ color: colors.text }}
            numberOfLines={1}
          >
            {title}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('discover.random')}
            testID="random-button"
            onPress={surprise}
            className="items-center justify-center rounded-full"
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.coralFill,
              shadowColor: colors.coralDark,
              shadowOpacity: 0.3,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 3 },
              elevation: 4,
            }}
          >
            <Ionicons name="shuffle" size={20} color={colors.onCoral} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 4, paddingBottom: 32, gap: 10 }}>
          {deeds.map((deed) => {
            const times = doneCounts.get(deed.key) ?? 0;
            const isDone = times > 0;
            return (
              <Pressable
                key={deed.key}
                accessibilityRole="button"
                accessibilityLabel={deedTitle(deed, locale)}
                testID={`deed-card-${deed.key}`}
                onPress={() => openDeed(deed)}
                className="flex-row items-center rounded-2xl px-4"
                style={{
                  backgroundColor: colors.surfaceLowest,
                  borderWidth: 1,
                  borderColor: isDone ? colors.success : colors.border,
                  minHeight: 76,
                }}
              >
                <View className="flex-1 py-3.5" style={{ paddingEnd: 10 }}>
                  <Text
                    dir="auto"
                    className="font-body text-body-lg"
                    style={{ color: colors.text }}
                    numberOfLines={2}
                  >
                    {deedTitle(deed, locale)}
                  </Text>
                  <Text
                    dir="auto"
                    className="font-body text-body-sm mt-0.5"
                    style={{ color: colors.textMuted }}
                    numberOfLines={2}
                  >
                    {deedDesc(deed, locale)}
                  </Text>
                </View>
                <View
                  className="items-center justify-center rounded-full"
                  testID={`deed-check-${deed.key}`}
                  style={{
                    width: 42,
                    height: 42,
                    backgroundColor: isDone ? colors.success : colors.surface,
                    borderWidth: 2,
                    borderColor: isDone ? colors.success : colors.border,
                  }}
                >
                  <Ionicons
                    name={isDone ? 'checkmark' : 'ellipse-outline'}
                    size={isDone ? 24 : 18}
                    color={isDone ? '#FFFFFF' : colors.outline}
                  />
                  {times > 1 ? (
                    <View
                      className="absolute items-center justify-center rounded-full"
                      style={{
                        top: -5,
                        right: -5,
                        minWidth: 20,
                        height: 20,
                        paddingHorizontal: 4,
                        backgroundColor: colors.coralFill,
                      }}
                    >
                      <Text className="font-label-sm" style={{ color: colors.onCoral, fontSize: 11, fontWeight: '700' }}>
                        ×{times}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
