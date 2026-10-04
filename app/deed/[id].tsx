import { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useColors } from '@/theme/tokens';
import { useLocale } from '@/i18n/LocaleProvider';
import { Toast } from '@/components/Toast';
import { Button3D } from '@/components/Button3D';
import { categoryById, deedDesc, deedTitle, suggestionByKey } from '@/content/catalog';
import type { HistoryEntry } from '@/db/schema';
import * as historyRepo from '@/repos/historyRepo';
import { todayIso, yesterdayIso } from '@/utils/dates';
import * as haptics from '@/utils/haptics';

function parseDay(day: string): Date {
  const parts = day.split('-').map(Number);
  const y = parts[0] ?? 1970;
  const m = parts[1] ?? 1;
  const d = parts[2] ?? 1;
  return new Date(y, m - 1, d);
}

/** createdAt is stored as UTC 'YYYY-MM-DD HH:MM:SS'; returns a local Date or null. */
function parseCreatedAt(value: string): Date | null {
  const parsed = new Date(value.includes('T') ? value : `${value.replace(' ', 'T')}Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export default function DeedScreen() {
  const colors = useColors();
  const { t } = useTranslation();
  const { locale } = useLocale();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const deedKey = typeof id === 'string' ? id : '';

  const deed = suggestionByKey(deedKey);

  const [timesDone, setTimesDone] = useState(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!deed) return;
    const [counts, all] = await Promise.all([
      historyRepo.countsAll(),
      historyRepo.listAll(),
    ]);
    setTimesDone(counts.get(deedKey) ?? 0);
    setHistory(all.filter((e) => e.key === deedKey));
  }, [deed, deedKey]);

  useFocusEffect(
    useCallback(() => {
      load().catch(() => {});
    }, [load]),
  );

  const mark = useCallback(
    async (done: boolean) => {
      if (!deed) return;
      const day = todayIso();
      if (done) {
        setTimesDone((n) => n + 1);
        haptics.success();
        setToastMsg(t('toast.celebrate'));
        try {
          await historyRepo.add({ key: deed.key, titleAr: deed.ar, titleEn: deed.en, day });
        } catch {}
      } else {
        setTimesDone((n) => Math.max(0, n - 1));
        haptics.light();
        try {
          await historyRepo.removeLatest(deed.key);
        } catch {}
      }
      load().catch(() => {});
    },
    [deed, load, t],
  );

  if (!deed) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <SafeAreaView edges={['top']} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <Ionicons name="help-circle-outline" size={48} color={colors.textMuted} />
          <Text className="font-body text-body-md" style={{ color: colors.textMuted }}>
            {t('notFound.title')}
          </Text>
          <Button3D label={t('common.back')} variant="coral" onPress={() => router.back()} />
        </SafeAreaView>
      </View>
    );
  }

  const cat = categoryById(deed.category);
  const isDone = timesDone > 0;
  const headingFont = locale === 'ar' ? 'font-arabic' : 'font-headline';

  function dayLabel(day: string): string {
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

  function timeOf(entry: HistoryEntry): string {
    const date = parseCreatedAt(entry.createdAt);
    if (!date) return '';
    try {
      return new Intl.DateTimeFormat(locale === 'ar' ? 'ar' : 'en-US', {
        hour: 'numeric',
        minute: '2-digit',
      }).format(date);
    } catch {
      return '';
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        {/* Header */}
        <View className="flex-row items-center gap-2 px-4 pt-3 pb-2">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('common.back')}
            testID="deed-back"
            onPress={() => router.back()}
            hitSlop={8}
            className="items-center justify-center rounded-full"
            style={{ width: 38, height: 38, backgroundColor: colors.surface }}
          >
            <Ionicons name={locale === 'ar' ? 'arrow-forward' : 'arrow-back'} size={20} color={colors.text} />
          </Pressable>
          {cat ? (
            <View
              className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ backgroundColor: colors.surface }}
            >
              <Ionicons name={cat.icon as keyof typeof Ionicons.glyphMap} size={14} color={colors.textMuted} />
              <Text className="font-label-sm text-label-sm" style={{ color: colors.textMuted }}>
                {locale === 'ar' ? cat.ar : cat.en}
              </Text>
            </View>
          ) : null}
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 32, gap: 14 }}>
          {/* Title + description */}
          <View className="gap-2">
            <Text dir="auto" className={`${headingFont} text-headline-lg`} style={{ color: colors.text }}>
              {deedTitle(deed, locale)}
            </Text>
            <Text dir="auto" className="font-body text-body-md" style={{ color: colors.textMuted }}>
              {deedDesc(deed, locale)}
            </Text>
          </View>

          {/* Action area */}
          {isDone ? (
            <View className="gap-3">
              <View
                className="flex-row items-center justify-between rounded-2xl px-4 py-3"
                style={{ backgroundColor: colors.surfaceLowest, borderWidth: 1, borderColor: colors.success }}
              >
                <View className="flex-row items-center gap-1.5">
                  <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                  <Text className="font-label-md text-label-md" style={{ color: colors.success, fontWeight: '700' }}>
                    {timesDone > 1 ? t('deed.doneTimes', { count: timesDone }) : t('deed.doneLabel')}
                  </Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t('deed.undo')}
                  testID="deed-undo"
                  onPress={() => void mark(false)}
                  hitSlop={8}
                  className="px-3 py-2"
                >
                  <Text className="font-label-md text-label-md" style={{ color: colors.coral, fontWeight: '700' }}>
                    {t('deed.undo')}
                  </Text>
                </Pressable>
              </View>
              <Button3D label={t('deed.redo')} variant="coral" testID="deed-redo" onPress={() => void mark(true)} />
            </View>
          ) : (
            <Button3D label={t('deed.doneButton')} variant="coral" testID="deed-done" onPress={() => void mark(true)} />
          )}

          {/* History of this deed */}
          <View className="gap-2 pt-2">
            <View className="flex-row items-center gap-1.5 px-1">
              <Ionicons name="time-outline" size={16} color={colors.textMuted} />
              <Text className="font-label-md text-label-md" style={{ color: colors.textMuted, fontWeight: '800' }}>
                {t('deed.historyTitle')}
              </Text>
              <Text className="font-label-md text-label-md" style={{ color: colors.textMuted }}>
                {`(${history.length})`}
              </Text>
            </View>
            {history.length === 0 ? (
              <Text className="font-body text-body-sm px-1" style={{ color: colors.textMuted }}>
                {t('deed.historyEmpty')}
              </Text>
            ) : (
              history.map((entry) => (
                <View
                  key={entry.id}
                  className="flex-row items-center gap-3 rounded-2xl px-4 py-3"
                  style={{ backgroundColor: colors.surfaceLowest, borderWidth: 1, borderColor: colors.border }}
                >
                  <View
                    className="items-center justify-center rounded-full"
                    style={{ width: 32, height: 32, backgroundColor: colors.surface }}
                  >
                    <Ionicons name="checkmark" size={16} color={colors.success} />
                  </View>
                  <Text className="font-body text-body-md flex-1" style={{ color: colors.text }}>
                    {dayLabel(entry.day)}
                  </Text>
                  <Text className="font-body text-body-sm" style={{ color: colors.textMuted }}>
                    {timeOf(entry)}
                  </Text>
                </View>
              ))
            )}
          </View>
        </ScrollView>

        <Toast visible={toastMsg !== null} message={toastMsg ?? ''} onHide={() => setToastMsg(null)} />
      </SafeAreaView>
    </View>
  );
}
