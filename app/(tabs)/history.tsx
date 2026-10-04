import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useColors } from '@/theme/tokens';
import { useLocale } from '@/i18n/LocaleProvider';
import { Button3D } from '@/components/Button3D';
import { categoryById, deedTitle, suggestionByKey } from '@/content/catalog';
import * as historyRepo from '@/repos/historyRepo';
import { todayIso, yesterdayIso } from '@/utils/dates';
import * as haptics from '@/utils/haptics';
import type { HistoryEntry } from '@/db/schema';

interface DaySection {
  day: string;
  label: string;
  items: HistoryEntry[];
}

function parseDay(day: string): Date {
  const parts = day.split('-').map(Number);
  const y = parts[0] ?? 1970;
  const m = parts[1] ?? 1;
  const d = parts[2] ?? 1;
  return new Date(y, m - 1, d);
}

export default function HistoryScreen() {
  const colors = useColors();
  const { t } = useTranslation();
  const { locale } = useLocale();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  const load = useCallback(async () => {
    try {
      setEntries(await historyRepo.listAll());
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load().catch(() => {});
    }, [load]),
  );

  const confirmRemove = useCallback(
    (entry: HistoryEntry) => {
      haptics.selection();
      Alert.alert(
        t('history.removeConfirmTitle'),
        t('history.removeConfirmBody'),
        [
          { text: t('deed.cancel'), style: 'cancel' },
          {
            text: t('history.remove'),
            style: 'destructive',
            onPress: () => {
              historyRepo.removeById(entry.id).then(() => load().catch(() => {})).catch(() => {});
            },
          },
        ],
      );
    },
    [load, t],
  );

  const total = entries.length;

  // Group into day sections (entries arrive newest-first).
  const sections: DaySection[] = [];
  for (const entry of entries) {
    const last = sections[sections.length - 1];
    if (last && last.day === entry.day) {
      last.items.push(entry);
    } else {
      sections.push({ day: entry.day, label: labelFor(entry.day), items: [entry] });
    }
  }

  function labelFor(day: string): string {
    if (day === todayIso()) return t('history.today');
    if (day === yesterdayIso()) return t('history.yesterday');
    try {
      return new Intl.DateTimeFormat(locale === 'ar' ? 'ar' : 'en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      }).format(parseDay(day));
    } catch {
      return day;
    }
  }

  function titleOf(entry: HistoryEntry): string {
    const suggestion = suggestionByKey(entry.key);
    if (suggestion) return deedTitle(suggestion, locale);
    return (locale === 'ar' ? entry.titleAr : entry.titleEn) ?? entry.titleAr ?? entry.titleEn ?? '';
  }

  const headingFont = locale === 'ar' ? 'font-arabic' : 'font-headline';

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pt-3 pb-2">
          <Text className={`${headingFont} text-headline-lg`} style={{ color: colors.text }}>
            {t('history.title')}
          </Text>
          <View
            className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ backgroundColor: colors.surface }}
            accessibilityLabel={t('history.totalAria', {
              count: total,
              deeds: t('plurals.deeds', { count: total }),
            })}
          >
            <Ionicons name="archive-outline" size={17} color={colors.goldDark} />
            <Text className="font-label-md text-label-md" style={{ color: colors.text }}>
              {total}
            </Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator color={colors.coral} style={{ marginTop: 48 }} />
        ) : total === 0 ? (
          <View className="items-center mt-16 gap-3 px-6">
            <Ionicons name="time-outline" size={56} color={colors.textMuted} />
            <Text className="font-headline text-headline-md text-center" style={{ color: colors.text }}>
              {t('history.emptyTitle')}
            </Text>
            <Text className="font-body text-body-md text-center" style={{ color: colors.textMuted }}>
              {t('history.emptyBody')}
            </Text>
            <View className="mt-3 w-64">
              <Button3D
                label={t('history.browse')}
                variant="coral"
                onPress={() => router.push('/')}
              />
            </View>
          </View>
        ) : (
          <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 32, gap: 8 }}>
            {sections.map((section) => (
              <View key={section.day} className="gap-2">
                <Text className="font-label-md text-label-md px-1 pt-2" style={{ color: colors.textMuted, fontWeight: '800' }}>
                  {section.label}
                </Text>
                {section.items.map((entry) => {
                  const suggestion = suggestionByKey(entry.key);
                  const cat = suggestion ? categoryById(suggestion.category) : undefined;
                  return (
                    <Pressable
                      key={entry.id}
                      accessibilityRole="button"
                      accessibilityLabel={titleOf(entry)}
                      testID={`history-row-${entry.key}`}
                      onLongPress={() => confirmRemove(entry)}
                      className="flex-row items-center gap-3 rounded-2xl px-4 py-3"
                      style={{ backgroundColor: colors.surfaceLowest, borderWidth: 1, borderColor: colors.border }}
                    >
                      <View
                        className="items-center justify-center rounded-full"
                        style={{ width: 38, height: 38, backgroundColor: colors.surface }}
                      >
                        <Ionicons
                          name={(cat?.icon ?? 'ellipse-outline') as keyof typeof Ionicons.glyphMap}
                          size={19}
                          color={colors.textMuted}
                        />
                      </View>
                      <Text
                        dir="auto"
                        className="font-body text-body-md flex-1"
                        style={{ color: colors.text }}
                        numberOfLines={2}
                      >
                        {titleOf(entry)}
                      </Text>
                      <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                    </Pressable>
                  );
                })}
              </View>
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}
