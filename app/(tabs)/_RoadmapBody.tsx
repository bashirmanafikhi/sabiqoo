import { useCallback, useState } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { AppTopBar } from '@/components/AppTopBar';
import { RoadmapNode } from '@/components/RoadmapNode';
import { RoadmapPathSvg } from '@/components/RoadmapPathSvg';
import { UnitHeader } from '@/components/UnitHeader';
import { ActiveDeedSheet } from '@/components/ActiveDeedSheet';
import { RewardChestModal } from '@/components/RewardChestModal';
import { Toast } from '@/components/Toast';
import { useColors } from '@/theme/tokens';
import { useRoadmapUnits } from '@/gamification/useRoadmapUnits';
import type { UnitNodeSummary } from '@/gamification/UnitSummary';

const MAIN_PATH = `M 200 40 C 270 50, 290 90, 275 130 C 255 175, 140 180, 125 220 C 110 260, 160 285, 200 300`;
const NODE_POSITIONS = ['28%', '72%', '26%', '50%', '50%'] as const;

export function RoadmapBody() {
  const router = useRouter();
  const colors = useColors();
  const { t } = useTranslation();
  const { units, isLoading } = useRoadmapUnits();
  const [sheet, setSheet] = useState<UnitNodeSummary | null>(null);
  const [chestOpen, setChestOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const onNodePress = useCallback((node: UnitNodeSummary) => setSheet(node), []);
  const onComplete = useCallback(() => {
    setSheet(null);
    setToast(t('home.deedCompleted'));
  }, [t]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppTopBar streakDays={7} xp={340} savedCount={4}
        onSettings={() => router.push('/settings')}
        onToggleLocale={() => router.push('/settings')}
        onAvatar={() => router.push('/bookmarks')}
        rightSlot={null} />

      <ScrollView contentContainerStyle={{ paddingTop: 80, paddingBottom: 96 }} className="bg-bg">
        <View className="mx-margin mt-3 mb-2 p-space-md rounded-2xl"
          style={{ backgroundColor: colors.surfaceLow, borderWidth: 1, borderColor: '#1D2B3D0D' }}>
          <View className="flex-row items-center justify-between gap-space-sm">
            <View className="flex-row items-center gap-3">
              <View className="w-11 h-11 rounded-xl items-center justify-center"
                style={{ backgroundColor: '#FFD460',
                  shadowColor: '#D4A838', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 1, shadowRadius: 0 }}>
                <Ionicons name="trophy" size={24} color="#1D2B3D" />
                <View className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#EA5455' }}>
                  <Text className="font-label-sm text-label-sm text-white" style={{ fontWeight: '700' }}>L3</Text>
                </View>
              </View>
              <View className="gap-0.5">
                <View className="flex-row items-center gap-1.5">
                  <Text className="font-headline text-headline-sm" style={{ color: '#1D2B3D' }}>Path of Barakah</Text>
                  <Text className="font-label-sm text-label-sm px-1.5 py-0.5 rounded-full"
                    style={{ color: '#F07B3F', backgroundColor: '#F07B3F26', fontWeight: '700' }}>Level 3</Text>
                </View>
                <Text className="font-body text-body-sm" style={{ color: '#5B6E85' }}>Daily Goal: 2 deeds remaining</Text>
              </View>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel="chest" onPress={() => setChestOpen(true)}
              className="w-10 h-10 rounded-xl items-center justify-center"
              style={{ backgroundColor: '#FFD46033', borderWidth: 1, borderColor: '#FFD46080' }}>
              <Ionicons name="gift" size={24} color="#F07B3F" />
              <View className="absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#EA5455' }} />
            </Pressable>
          </View>
        </View>

        {!isLoading && units.map((unit, idx) => (
          <View key={unit.id} className="mt-2">
            <UnitHeader
              unitNumber={idx + 1}
              unitNumberAr={`الوحدة ${toArabicNum(idx + 1)}`}
              titleEn={unit.titleEn}
              titleAr={unit.titleAr}
              iconName={unit.iconName}
              progressDone={unit.completed}
              progressTotal={unit.total}
            />
            <View style={{ position: 'relative', minHeight: 480, paddingVertical: 24 }}>
              <RoadmapPathSvg
                width={400} height={580}
                paths={[
                  { id: 'track', d: MAIN_PATH, color: 'transparent', trackColor: '#DCE9FF', width: 0, trackWidth: 14 },
                  { id: 'main', d: MAIN_PATH, color: '#F07B3F', width: 6 },
                ]} />
              {unit.nodes.map((n, i) => (
                <View key={n.id} style={{
                  position: 'absolute',
                  left: NODE_POSITIONS[i % NODE_POSITIONS.length],
                  top: 16 + i * 96,
                  transform: [{ translateX: -50 }],
                }}>
                  <RoadmapNode state={n.state} label={n.label} xp={n.xp}
                    onPress={() => onNodePress(n)} testID={`unit-${unit.id}-node-${i}`} />
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      <ActiveDeedSheet
        visible={!!sheet}
        deedTitle={sheet?.label ?? ''}
        deedTitleAr={sheet?.labelAr ?? ''}
        iconName={(sheet?.icon as any) ?? 'chatbox'}
        rewardXp={sheet?.xp ?? 15}
        rewardLabel="1 Barakah Gem"
        hadith={sheet?.hadith ?? '"The supplication of a Muslim for his brother in his absence will certainly be answered." — Sahih Muslim'}
        onClose={() => setSheet(null)}
        onComplete={onComplete}
      />
      <RewardChestModal visible={chestOpen} bonusXp={25}
        hadith="The most beloved deed to Allah is the most regular and constant."
        onClose={() => setChestOpen(false)} />
      <Toast visible={!!toast} message={toast ?? ''} onHide={() => setToast(null)} />
    </View>
  );
}

function toArabicNum(n: number): string {
  const m = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(n).split('').map(d => m[+d]).join('');
}
