import { useCallback, useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppTopBar } from '@/components/AppTopBar';
import { CategoryChip } from '@/components/CategoryChip';
import { CatalogDeedCard, type CatalogStatus } from '@/components/CatalogDeedCard';
import { useColors } from '@/theme/tokens';

function useCategories(): { categories: any[] } {
  return { categories: [] };
}
function useDeeds(): { deeds: any[] } {
  return { deeds: [] };
}

export default function CatalogScreen() {
  const router = useRouter();
  const colors = useColors();
  const { t } = useTranslation();
  const { categories } = useCategories();
  const { deeds } = useDeeds();
  const [q, setQ] = useState('');

  const onCardPress = useCallback((id: number) => router.push(`/deed/${id}` as any), [router]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppTopBar streakDays={7} xp={340} savedCount={4}
        onSettings={() => router.push('/settings')}
        onToggleLocale={() => router.push('/settings')}
        onAvatar={() => router.push('/bookmarks')} />

      <ScrollView contentContainerStyle={{ paddingTop: 80, paddingBottom: 96 }} keyboardShouldPersistTaps="handled">
        <View className="px-gutter pt-3 pb-2 gap-space-sm">
          <View className="flex-row items-center w-full relative">
            <Ionicons name="search" size={22} color={colors.outline}
              style={{ position: 'absolute', left: 12, zIndex: 1 }} />
            <TextInput value={q} onChangeText={setQ}
              placeholder="Search 150+ deeds (e.g. smile, water, family)..."
              placeholderTextColor={colors.outline}
              className="w-full h-12 pl-11 pr-11 rounded-xl bg-surface"
              style={{ color: colors.text }} />
          </View>
          <View className="flex-row items-center justify-between px-1">
            <View className="flex-row items-center gap-1.5">
              <View className="w-2 h-2 rounded-full" style={{ backgroundColor: '#EA5455' }} />
              <Text className="font-label-md text-label-md" style={{ color: '#1D2B3DCC' }}>
                Showing {deeds.length} of 152 deeds
              </Text>
            </View>
            <Pressable accessibilityRole="button" className="flex-row items-center gap-1">
              <Ionicons name="options" size={16} color="#EA5455" />
              <Text className="font-label-md text-label-md" style={{ color: '#EA5455', fontWeight: '800' }}>Filters</Text>
            </Pressable>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingVertical: 4 }}>
          <CategoryChip label="All Deeds" count={152} active onPress={() => {}} />
          {categories.map((c: any, i: number) => (
            <CategoryChip key={c.id}
              label={c.titleEn}
              count={`${c.completed ?? 0}/${c.total ?? 0}`}
              progress={(c.completed ?? 0) / Math.max(1, c.total ?? 1)}
              progressColor={i % 2 === 0 ? '#F07B3F' : '#EA5455'}
              onPress={() => {}} />
          ))}
        </ScrollView>

        <View className="mx-gutter mt-space-md">
          <View className="rounded-2xl p-space-md"
            style={{ backgroundColor: colors.surfaceLow, borderWidth: 1, borderColor: '#1D2B3D0D' }}>
            <View className="flex-row items-start justify-between gap-space-sm">
              <View className="flex-1 gap-1">
                <View className="flex-row items-center gap-1.5">
                  <Ionicons name="star" size={16} color="#F07B3F" />
                  <Text className="font-label-sm text-label-sm uppercase"
                    style={{ color: '#F07B3F', fontWeight: '800' }}>Active Realm</Text>
                </View>
                <Text className="font-headline text-headline-sm" style={{ color: '#1D2B3D' }}>Everyday Smiles & Kind Words</Text>
                <Text className="font-arabic text-body-sm" dir="auto">الكلمة الطيبة والمعنوية</Text>
              </View>
              <View className="w-14 h-14 rounded-2xl items-center justify-center"
                style={{ backgroundColor: '#FFD460',
                  shadowColor: '#D8A82D', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 1, shadowRadius: 0 }}>
                <Ionicons name="trophy" size={28} color="#1D2B3D" />
              </View>
            </View>
            <View className="mt-space-md gap-1.5">
              <View className="flex-row justify-between">
                <Text className="font-label-sm text-label-sm" style={{ color: '#1D2B3D99' }}>Category Mastery Level 2</Text>
                <Text className="font-label-sm text-label-sm" style={{ color: '#F07B3F', fontWeight: '800' }}>50% (6 / 12)</Text>
              </View>
              <View className="h-3 w-full rounded-full p-0.5" style={{ backgroundColor: colors.surfaceHighest }}>
                <View className="h-full rounded-full" style={{ backgroundColor: '#F07B3F', width: '50%' }} />
              </View>
            </View>
          </View>
        </View>

        <View className="px-gutter mt-space-md gap-space-sm">
          {deeds.map((d: any) => (
            <CatalogDeedCard
              key={d.id}
              title={d.title}
              titleAr={d.titleAr}
              status={mapStatus(d.state) as CatalogStatus}
              statusLabel={d.statusLabel}
              xp={d.xpLabel}
              onPress={() => onCardPress(d.id)} />
          ))}
        </View>

        {q.length > 0 && deeds.length === 0 ? (
          <View className="mx-gutter mt-space-lg mb-2 items-center justify-center p-space-lg rounded-2xl"
            style={{ backgroundColor: colors.surfaceLow, borderWidth: 1, borderColor: '#1D2B3D0D' }}>
            <View className="w-16 h-16 rounded-full items-center justify-center mb-space-sm"
              style={{ backgroundColor: colors.surfaceHighest }}>
              <Ionicons name="search" size={32} color="#EA5455" />
            </View>
            <Text className="font-headline text-headline-sm" style={{ color: '#1D2B3D' }}>No deeds found for your search</Text>
            <Text className="font-body text-body-md text-center mt-1 max-w-70" style={{ color: '#5B6E85' }}>
              Try adjusting keywords, exploring other realms, or clearing active filters.
            </Text>
            <Pressable accessibilityRole="button" onPress={() => setQ('')}
              className="mt-space-md h-10 px-space-lg rounded-xl items-center justify-center"
              style={{ backgroundColor: '#EA5455',
                shadowColor: '#C83E40', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 1, shadowRadius: 0 }}>
              <Text className="font-label-md text-label-md text-white" style={{ fontWeight: '800' }}>Clear All Filters</Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

function mapStatus(s: string): CatalogStatus {
  if (s === 'mastered') return 'mastered';
  if (s === 'completed') return 'completed';
  if (s === 'locked') return 'locked';
  if (s === 'skipped') return 'skipped';
  return 'available';
}
