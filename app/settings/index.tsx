import { useCallback, useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useColors, useTheme, type ThemeMode } from '@/theme/tokens';
import { useLocale, type Locale } from '@/i18n/LocaleProvider';
import * as skippedRepo from '@/repos/skippedRepo';
import * as deedsRepo from '@/repos/deedsRepo';
import * as categoriesRepo from '@/repos/categoriesRepo';
import * as profileRepo from '@/repos/profileRepo';
import { yesterdayIsoLocal, titleFor, pickLocale } from '../_helpers';
import { BigButton3D } from '@/components/BigButton3D';
import { SegmentedControl } from './_SegmentedControl';
import type { Deed, Category, UserProfile } from '@/db/schema';

interface SkippedRow {
  deed: Deed;
  category: Category | null;
}

interface SectionHeaderProps {
  label: string;
}

function SectionHeader({ label }: SectionHeaderProps) {
  const colors = useColors();
  return (
    <Text
      className="mb-2 mt-6 text-sm font-bold"
      style={{ color: colors.textPrimary }}
    >
      {label}
    </Text>
  );
}

interface SectionCardProps {
  children: React.ReactNode;
}

function SectionCard({ children }: SectionCardProps) {
  const colors = useColors();
  return (
    <View
      style={{
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.elevated,
      }}
    >
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
      profileRepo.get(),
      skippedRepo.listAll(),
      deedsRepo.listAll(),
      categoriesRepo.list(),
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

  useFocusEffect(
    useCallback(() => {
      load().catch(err => console.warn('[settings] load', err));
    }, [load]),
  );

  const onUseFreeze = useCallback(async () => {
    if (!profile || profile.streakFreezesLeft <= 0) return;
    const updated: UserProfile = {
      ...profile,
      streakFreezesLeft: profile.streakFreezesLeft - 1,
      lastActiveDate: yesterdayIsoLocal(),
    };
    await profileRepo.upsert(updated);
    setProfile(updated);
  }, [profile]);

  const onUnskip = useCallback(async (id: number) => {
    await skippedRepo.unSkip(id);
    setRows(prev => prev.filter(r => r.deed.id !== id));
  }, []);

  const changeLocale = useCallback(
    (lng: Locale) => {
      setLocale(lng).catch(err => console.warn('[settings] locale', err));
    },
    [setLocale],
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Stack.Screen
        options={{ title: t('settings.title'), headerShown: false }}
      />
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
          {t('settings.title')}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 48 }}>
        <SectionHeader label={t('settings.theme')} />
        <SegmentedControl<ThemeMode>
          value={mode}
          onChange={setMode}
          options={[
            { value: 'system', label: t('settings.theme.system') },
            { value: 'light', label: t('settings.theme.light') },
            { value: 'dark', label: t('settings.theme.dark') },
          ]}
        />

        <SectionHeader label={t('settings.language')} />
        <SegmentedControl<Locale>
          value={activeLocale}
          onChange={changeLocale}
          options={[
            { value: 'ar', label: 'العربية' },
            { value: 'en', label: 'English' },
          ]}
        />

        <SectionHeader label={t('settings.streakFreeze')} />
        <SectionCard>
          <Text className="mb-2 text-sm" style={{ color: colors.textMuted }}>
            {t('settings.streakFreezeDesc')}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 999,
              backgroundColor: colors.brandBlue + '22',
              borderWidth: 1,
              borderColor: colors.brandBlue,
              alignSelf: 'flex-start',
            }}
          >
            <Ionicons name="snow-outline" size={16} color={colors.brandBlue} />
            <Text
              className="ms-2 text-sm font-bold"
              style={{ color: colors.brandBlue }}
            >
              {profile?.streakFreezesLeft ?? 0}
            </Text>
          </View>
          <View style={{ marginTop: 12 }}>
            <BigButton3D
              label={t('settings.streakFreeze')}
              variant="secondary"
              onPress={onUseFreeze}
              disabled={!profile || profile.streakFreezesLeft <= 0}
            />
          </View>
        </SectionCard>

        <SectionHeader label={t('skip.sectionTitle')} />
        {rows.length === 0 ? (
          <Text
            className="text-sm"
            style={{ color: colors.textMuted, paddingVertical: 8 }}
          >
            {t('skip.sectionEmpty')}
          </Text>
        ) : (
          <SectionCard>
            {rows.map(r => (
              <View
                key={r.deed.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                }}
              >
                <View
                  style={{
                    width: 6,
                    height: 28,
                    borderRadius: 3,
                    backgroundColor:
                      r.category?.colorCode ?? colors.slateBlue,
                    marginEnd: 12,
                  }}
                />
                <Text
                  className="flex-1 text-sm"
                  style={{ color: colors.textPrimary }}
                  numberOfLines={2}
                >
                  {titleFor(r.deed, activeLocale)}
                </Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t('skip.undoToggle')}
                  onPress={() => onUnskip(r.deed.id)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: colors.border,
                    backgroundColor: colors.surface,
                  }}
                >
                  <Text
                    className="text-xs font-bold"
                    style={{ color: colors.textPrimary }}
                  >
                    {t('skip.undoToggle')}
                  </Text>
                </Pressable>
              </View>
            ))}
          </SectionCard>
        )}

        <SectionHeader label={t('settings.about')} />
        <SectionCard>
          <Text className="text-sm" style={{ color: colors.textMuted }}>
            {t('settings.version', { v: '1.0.0' })}
          </Text>
        </SectionCard>
      </ScrollView>
    </View>
  );
}
