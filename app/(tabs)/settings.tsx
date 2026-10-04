import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useColors } from '@/theme/tokens';
import { useLocale, type Locale } from '@/i18n/LocaleProvider';
import { useTheme } from '@/theme/ThemeProvider';
import type { ThemeMode } from '@/theme/tokens';
import { SegmentedControl } from '@/components/SegmentedControl';
import { AppActionsService } from '@/services/AppActionsService';
import * as historyRepo from '@/repos/historyRepo';
import * as haptics from '@/utils/haptics';

export default function SettingsScreen() {
  const colors = useColors();
  const { t } = useTranslation();
  const { locale, setLocale } = useLocale();
  const { mode, setMode } = useTheme();
  const [resetting, setResetting] = useState(false);

  const headingFont = locale === 'ar' ? 'font-arabic' : 'font-headline';

  const confirmReset = useCallback(() => {
    Alert.alert(
      t('settings.resetConfirmTitle'),
      t('settings.resetConfirmBody'),
      [
        { text: t('deed.cancel'), style: 'cancel' },
        {
          text: t('settings.reset'),
          style: 'destructive',
          onPress: () => {
            setResetting(true);
            historyRepo
              .removeAll()
              .catch(() => {})
              .finally(() => setResetting(false));
          },
        },
      ],
    );
  }, [t]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}>
          <Text className={`${headingFont} text-headline-lg pt-3 pb-3`} style={{ color: colors.text }}>
            {t('settings.title')}
          </Text>

          <View className="gap-3">
            <View
              className="rounded-2xl px-5 py-4"
              style={{ backgroundColor: colors.surfaceLowest, borderWidth: 1, borderColor: colors.border }}
            >
              <Text className="font-label-md text-label-md mb-3" style={{ color: colors.textMuted }}>
                {t('settings.language')}
              </Text>
              <SegmentedControl<Locale>
                value={locale}
                onChange={(next) => setLocale(next)}
                options={[
                  { value: 'ar', label: 'العربية' },
                  { value: 'en', label: 'English' },
                ]}
              />
            </View>

            <View
              className="rounded-2xl px-5 py-4"
              style={{ backgroundColor: colors.surfaceLowest, borderWidth: 1, borderColor: colors.border }}
            >
              <Text className="font-label-md text-label-md mb-3" style={{ color: colors.textMuted }}>
                {t('settings.theme')}
              </Text>
              <SegmentedControl<ThemeMode>
                value={mode}
                onChange={(next) => setMode(next)}
                options={[
                  { value: 'system', label: t('settings.themeSystem') },
                  { value: 'light', label: t('settings.themeLight') },
                  { value: 'dark', label: t('settings.themeDark') },
                ]}
              />
            </View>

            {(
              [
                {
                  key: 'rate',
                  icon: 'star-outline' as const,
                  onPress: () => void AppActionsService.rateApp(),
                },
                {
                  key: 'share',
                  icon: 'share-social-outline' as const,
                  onPress: () => void AppActionsService.shareApp(),
                },
                {
                  key: 'feedback',
                  icon: 'mail-outline' as const,
                  onPress: () => void AppActionsService.sendFeedback(),
                },
              ] as const
            ).map((action) => (
              <Pressable
                key={action.key}
                accessibilityRole="button"
                accessibilityLabel={t(`settings.${action.key}`)}
                testID={`settings-${action.key}`}
                onPress={() => {
                  haptics.selection();
                  action.onPress();
                }}
                className="flex-row items-center gap-3 rounded-2xl px-4 py-4"
                style={{ backgroundColor: colors.surfaceLowest, borderWidth: 1, borderColor: colors.border }}
              >
                <Ionicons name={action.icon} size={20} color={colors.text} />
                <Text className="font-label-md text-label-md flex-1" style={{ color: colors.text }}>
                  {t(`settings.${action.key}`)}
                </Text>
                <Ionicons
                  name={locale === 'ar' ? 'chevron-back' : 'chevron-forward'}
                  size={16}
                  color={colors.textMuted}
                />
              </Pressable>
            ))}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('settings.reset')}
              testID="reset-data"
              onPress={confirmReset}
              disabled={resetting}
              className="rounded-2xl py-4 items-center"
              style={{ backgroundColor: colors.surfaceLowest, borderWidth: 1, borderColor: colors.coral }}
            >
              <Text className="font-label-md text-label-md" style={{ color: colors.coral, fontWeight: '800' }}>
                {t('settings.reset')}
              </Text>
            </Pressable>

            <View className="items-center gap-1 pt-4 px-6">
              <Text className={`${headingFont} text-body-md text-center`} style={{ color: colors.text }}>
                {t('settings.about')}
              </Text>
              <Text className="font-body text-body-sm text-center" style={{ color: colors.textMuted }}>
                {t('settings.privacy')}
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
