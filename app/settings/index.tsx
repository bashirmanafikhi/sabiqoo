import { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useColors, useTheme, type ThemeMode } from '@/theme/tokens';
import { useLocale, type Locale } from '@/i18n/LocaleProvider';
import { SegmentedControl } from '@/components/SegmentedControl';
import { HudPill } from '@/components/HudPill';
import { Button3D } from '@/components/Button3D';
import * as skippedRepo from '@/repos/skippedRepo';
import * as deedsRepo from '@/repos/deedsRepo';
import * as categoriesRepo from '@/repos/categoriesRepo';
import * as profileRepo from '@/repos/profileRepo';
import { yesterdayIsoLocal, titleFor, pickLocale } from '../_helpers';
import type { Deed, Category, UserProfile } from '@/db/schema';

interface SkippedRow { deed: Deed; category: Category | null; }

function SectionHeader({ label }: { label: string }) {
  return (
    <Text className="mb-2 mt-6 font-headline text-label-md uppercase"
      style={{ color: '#EA5455', fontWeight: '800' }}>{label}</Text>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  const colors = useColors();
  return (
    <View className="p-4 rounded-2xl gap-3"
      style={{ backgroundColor: colors.surfaceLowest, borderWidth: 1, borderColor: '#1D2B3D0D' }}>
      {children}
    </View>
  );
}

export default function SettingsScreen() {
  const colors = useColors();
  const router = useRouter();
  const { mode, setMode } = useTheme();
  const { locale, setLocale } = useLocale();
  const { t, i18n } = useTranslation();
  const activeLocale: Locale = locale ?? pickLocale(i18n.language);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [rows, setRows] = useState<SkippedRow[]>([]);

  const load = useCallback(async () => {
    const [p, sk, d, c] = await Promise.all([
      profileRepo.get(), skippedRepo.listAll(), deedsRepo.listAll(), categoriesRepo.list(),
    ]);
    setProfile(p);
    const deedById = new Map(d.map(x => [x.id, x] as const));
    const catById = new Map(c.map(x => [x.id, x] as const));
    const built: SkippedRow[] = [];
    for (const id of sk) {
      const deed = deedById.get(id);
      if (!deed) continue;
      built.push({ deed, category: catById.get(deed.categoryId) ?? null });
    }
    setRows(built);
  }, []);

  useFocusEffect(useCallback(() => { load().catch(err => console.warn('[settings] load', err)); }, [load]));

  const onUseFreeze = useCallback(async () => {
    if (!profile || profile.streakFreezesLeft <= 0) return;
    const updated: UserProfile = {
      ...profile, streakFreezesLeft: profile.streakFreezesLeft - 1,
      lastActiveDate: yesterdayIsoLocal(),
    };
    await profileRepo.upsert(updated);
    setProfile(updated);
  }, [profile]);

  const onUnskip = useCallback(async (id: number) => {
    await skippedRepo.unSkip(id);
    setRows(prev => prev.filter(r => r.deed.id !== id));
  }, []);

  const changeLocale = useCallback((lng: Locale) => {
    setLocale(lng).catch(err => console.warn('[settings] locale', err));
  }, [setLocale]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Stack.Screen options={{ title: t('settings.title'), headerShown: false }} />
      <View className="h-16 px-gutter flex-row items-center gap-2"
        style={{ backgroundColor: colors.bg, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <Pressable accessibilityRole="button" accessibilityLabel={t('common.close')} onPress={() => router.back()}
          hitSlop={8} className="w-9 h-9 rounded-full items-center justify-center">
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text className="flex-1 ms-2 font-headline text-headline-sm" style={{ color: colors.text }}>{t('settings.title')}</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 48 }}>
        <SectionHeader label={t('settings.theme')} />
        <SegmentedControl<ThemeMode> value={mode} onChange={setMode}
          options={[
            { value: 'system', label: t('settings.theme.system') },
            { value: 'light',  label: t('settings.theme.light') },
            { value: 'dark',   label: t('settings.theme.dark') },
          ]} />

        <SectionHeader label={t('settings.language')} />
        <SegmentedControl<Locale> value={activeLocale} onChange={changeLocale}
          options={[
            { value: 'ar', label: 'العربية' },
            { value: 'en', label: 'English' },
          ]} />

        <SectionHeader label={t('settings.streakFreeze')} />
        <SectionCard>
          <Text className="font-body text-body-sm" style={{ color: '#5B6E85' }}>{t('settings.streakFreezeDesc')}</Text>
          <HudPill variant="gold" icon={<Ionicons name="snow" size={16} color="#F07B3F" />}
            label={String(profile?.streakFreezesLeft ?? 0)} />
          <View className="mt-2">
            <Button3D label={t('settings.streakFreeze')} variant="tangerine" onPress={onUseFreeze}
              disabled={!profile || profile.streakFreezesLeft <= 0} />
          </View>
        </SectionCard>

        <SectionHeader label={t('skip.sectionTitle')} />
        {rows.length === 0 ? (
          <Text className="font-body text-body-sm" style={{ color: '#5B6E85', paddingVertical: 8 }}>
            {t('skip.sectionEmpty')}
          </Text>
        ) : (
          <SectionCard>
            {rows.map(r => (
              <View key={r.deed.id} className="flex-row items-center py-2 border-b"
                style={{ borderColor: colors.border }}>
                <View className="w-1.5 self-stretch rounded-full me-3" style={{ backgroundColor: '#F07B3F' }} />
                <Text className="flex-1 font-body text-body-sm" style={{ color: '#1D2B3D' }} numberOfLines={2}>
                  {titleFor(r.deed, activeLocale)}
                </Text>
                <Pressable accessibilityRole="button" accessibilityLabel={t('skip.undoToggle')}
                  onPress={() => onUnskip(r.deed.id)} hitSlop={8}
                  className="px-3 py-1.5 rounded-full"
                  style={{ borderWidth: 1, borderColor: '#EA5455', backgroundColor: '#FFFFFF' }}>
                  <Text className="font-label-sm text-label-sm" style={{ color: '#EA5455', fontWeight: '800' }}>{t('skip.undoToggle')}</Text>
                </Pressable>
              </View>
            ))}
          </SectionCard>
        )}

        <SectionHeader label={t('settings.about')} />
        <SectionCard>
          <Text className="font-body text-body-sm" style={{ color: '#5B6E85' }}>{t('settings.version', { v: '1.0.0' })}</Text>
        </SectionCard>
      </ScrollView>
    </View>
  );
}
