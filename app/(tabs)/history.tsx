import { useCallback } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppTopBar } from '@/components/AppTopBar';
import { StatCard } from '@/components/StatCard';
import { RecentDeedCard } from '@/components/RecentDeedCard';
import { MilestoneBanner } from '@/components/MilestoneBanner';
import { HeatmapGrid, type HeatDay } from '@/components/HeatmapGrid';
import { useColors } from '@/theme/tokens';

const HEAT_DAYS: HeatDay[] = Array.from({ length: 30 }, (_, i) => ({ day: i, count: ((i * 7) % 6) }));

export default function HistoryScreen() {
  const router = useRouter();
  const colors = useColors();
  const { t } = useTranslation();
  const onShare = useCallback(() => {}, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppTopBar streakDays={7} xp={680} savedCount={4}
        onSettings={() => router.push('/settings')}
        onToggleLocale={() => router.push('/settings')}
        onAvatar={() => router.push('/bookmarks')}
        rightSlot={null} />

      <ScrollView contentContainerStyle={{ paddingTop: 80, paddingBottom: 96 }} className="px-gutter">
        <View className="flex-row items-center justify-between pt-1">
          <View>
            <Text className="font-label-sm text-label-sm uppercase"
              style={{ color: '#EA5455', fontWeight: '800' }}>سابقوا • Journey Log</Text>
            <Text className="font-headline text-headline-lg" style={{ color: '#1D2B3D' }}>Spiritual Footprint</Text>
          </View>
          <Pressable onPress={onShare} accessibilityRole="button"
            className="flex-row items-center gap-1 px-3.5 py-1.5 rounded-full"
            style={{ backgroundColor: '#EA5455' }}>
            <Ionicons name="share-social" size={18} color="#FFFFFF" />
            <Text className="font-label-sm text-label-sm text-white" style={{ fontWeight: '800' }}>Share</Text>
          </Pressable>
        </View>

        <View className="mt-3 p-3.5 rounded-xl relative overflow-hidden"
          style={{ backgroundColor: colors.surfaceLowest, borderWidth: 1, borderColor: '#EA545533' }}>
          <View className="flex-row items-center gap-3">
            <View className="w-13 h-13 rounded-2xl items-center justify-center p-3"
              style={{ backgroundColor: '#EA54551A' }}>
              <Ionicons name="flame" size={32} color="#EA5455" />
            </View>
            <View className="flex-1">
              <View className="flex-row items-center gap-1.5">
                <Text className="font-headline text-headline-sm" style={{ color: '#1D2B3D' }}>7 Day Streak</Text>
                <Text className="px-2 py-0.5 rounded-full" style={{ backgroundColor: '#EA5455' }}>
                  <Text className="font-label-sm text-label-sm text-white" style={{ fontWeight: '800' }}>Active</Text>
                </Text>
              </View>
              <Text className="text-xs" style={{ color: '#5B6E85' }}>Record: 14 days • Personal Best</Text>
            </View>
            <View className="flex-row items-center gap-1 px-2 py-1 rounded-full"
              style={{ backgroundColor: colors.surfaceHigh }}>
              <Text>❄️</Text>
              <Text className="font-label-sm text-label-sm"
                style={{ color: '#1D2B3D', fontWeight: '800' }}>2 Freezes</Text>
            </View>
          </View>
        </View>

        <View className="flex-row gap-2 mt-2">
          <View className="flex-1"><StatCard icon="checkmark-done" iconColor="#1D2B3D" value="48" label="Total" subLabel="Deeds Logged" borderColor="#1D2B3D1A" /></View>
          <View className="flex-1"><StatCard icon="flash" iconColor="#F07B3F" value="680" label="XP" subLabel="Barakah Lvl 4" borderColor="#FFD4604D" /></View>
          <View className="flex-1"><StatCard icon="heart" iconColor="#EA5455" value="96%" label="Score" subLabel="Weekly Goal" borderColor="#EA545533" /></View>
        </View>

        <View className="mt-3 p-4 rounded-2xl gap-3.5"
          style={{ backgroundColor: colors.surfaceLowest, borderWidth: 1, borderColor: '#1D2B3D0D' }}>
          <View className="flex-row items-center justify-between">
            <View>
              <View className="flex-row items-center gap-1.5">
                <Ionicons name="calendar" size={20} color="#EA5455" />
                <Text className="font-headline text-headline-sm" style={{ color: '#1D2B3D' }}>Consistency Heatmap</Text>
              </View>
              <Text className="text-xs" style={{ color: '#5B6E85' }}>Last 30 Days Activity Pulse</Text>
            </View>
            <View className="flex-row items-center gap-1 px-2.5 py-1 rounded-full"
              style={{ backgroundColor: '#FFD46033', borderWidth: 1, borderColor: '#FFD46080' }}>
              <View className="w-2 h-2 rounded-full" style={{ backgroundColor: '#F07B3F' }} />
              <Text className="font-label-sm text-label-sm"
                style={{ color: '#1D2B3D', fontWeight: '800' }}>4.2 Deeds/day</Text>
            </View>
          </View>
          <HeatmapGrid days={HEAT_DAYS} />
          <View className="flex-row items-center justify-between pt-1">
            <Text className="font-label-sm text-label-sm" style={{ color: '#1D2B3DBB' }}>Fewer deeds</Text>
            <View className="flex-row items-center gap-1.5">
              <View className="w-3.5 h-3.5 rounded-md" style={{ backgroundColor: '#DCE9FF' }} />
              <View className="w-3.5 h-3.5 rounded-md" style={{ backgroundColor: '#FFD46099' }} />
              <View className="w-3.5 h-3.5 rounded-md" style={{ backgroundColor: '#F07B3F' }} />
              <View className="w-3.5 h-3.5 rounded-md" style={{ backgroundColor: '#EA5455' }} />
              <View className="w-3.5 h-3.5 rounded-md" style={{ backgroundColor: '#1D2B3D' }} />
            </View>
            <Text className="font-label-sm text-label-sm" style={{ color: '#1D2B3DBB' }}>5 deeds</Text>
          </View>
        </View>

        <View className="mt-3 p-4 rounded-2xl gap-3.5"
          style={{ backgroundColor: colors.surfaceLowest, borderWidth: 1, borderColor: '#1D2B3D0D' }}>
          <View className="flex-row items-center justify-between">
            <View>
              <View className="flex-row items-center gap-1.5">
                <Ionicons name="pie-chart" size={20} color="#F07B3F" />
                <Text className="font-headline text-headline-sm" style={{ color: '#1D2B3D' }}>Category Distribution</Text>
              </View>
              <Text className="text-xs" style={{ color: '#5B6E85' }}>Where your barakah radiates</Text>
            </View>
            <Text className="font-label-sm text-label-sm px-2.5 py-1 rounded-full"
              style={{ color: '#1D2B3D', backgroundColor: colors.surfaceHigh, fontWeight: '800' }}>48 Total</Text>
          </View>
          {CATEGORIES.map(c => (
            <View key={c.label} className="gap-1.5">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <View className="w-6 h-6 rounded-lg items-center justify-center" style={{ backgroundColor: c.iconBg }}>
                    <Ionicons name={c.icon} size={16} color={c.iconColor} />
                  </View>
                  <Text className="font-label-md text-label-md"
                    style={{ color: '#1D2B3D', fontWeight: '800' }}>{c.label}</Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <Text style={{ color: '#1D2B3D', fontWeight: '800' }}>{c.value}</Text>
                  <Text className="font-body-sm text-body-sm" style={{ color: '#5B6E85' }}>({c.pct}%)</Text>
                </View>
              </View>
              <View className="h-2.5 w-full rounded-full p-0.5" style={{ backgroundColor: colors.surfaceHigh }}>
                <View className="h-full rounded-full" style={{ backgroundColor: c.fill, width: `${c.pct}%` }} />
              </View>
            </View>
          ))}
        </View>

        <View className="mt-3 gap-2.5">
          <View className="flex-row items-center justify-between px-1">
            <View className="flex-row items-center gap-2">
              <Ionicons name="time" size={20} color="#EA5455" />
              <Text className="font-headline text-headline-sm" style={{ color: '#1D2B3D' }}>Recent Deeds</Text>
            </View>
            <View className="flex-row items-center gap-1 px-2.5 py-1 rounded-full"
              style={{ backgroundColor: colors.surfaceLowest, borderWidth: 1, borderColor: '#1D2B3D1A' }}>
              <Text className="font-label-sm text-label-sm"
                style={{ color: '#1D2B3D', fontWeight: '800' }}>This Week</Text>
              <Ionicons name="chevron-down" size={16} color="#1D2B3D" />
            </View>
          </View>
          {RECENTS.map(r => (
            <RecentDeedCard key={r.when + r.title}
              when={r.when} countLabel={r.count} icon={r.icon}
              iconBg={r.iconBg} title={r.title} quote={r.quote} xp={r.xp} />
          ))}
        </View>

        <View className="mt-3 mb-2">
          <MilestoneBanner
            title="10-Day Consistency Shield"
            body="You are just 3 days away from unlocking the Bronze Ihsan Shield! Consistency in small deeds is beloved most."
            progressLabel="7 / 10 Days"
            progressPercent={70} />
        </View>
      </ScrollView>
    </View>
  );
}

const CATEGORIES = [
  { label: 'Everyday Smiles & Good Words', icon: 'happy',           iconColor: '#EA5455', iconBg: '#EA54551A',  fill: '#EA5455',      value: 16, pct: 33 },
  { label: 'Kinship & Family Ties',        icon: 'people',          iconColor: '#F07B3F', iconBg: '#F07B3F26',  fill: '#F07B3F',      value: 12, pct: 25 },
  { label: 'Animal & Nature Care',         icon: 'paw',             iconColor: '#F07B3F', iconBg: '#FFD46033',  fill: '#FFD460',      value:  9, pct: 19 },
  { label: 'Financial Charity (Sadaqah)',  icon: 'cash',            iconColor: '#1D2B3D', iconBg: '#1D2B3D1A',  fill: '#1D2B3D',      value:  6, pct: 13 },
  { label: 'Hands-on Service',             icon: 'hand-left',       iconColor: '#1D2B3DBB', iconBg: '#D3E4FE', fill: '#1D2B3D66',   value:  5, pct: 10 },
] as const;

const RECENTS = [
  { when: 'Today • 2:15 PM',  count: '1x Completed', icon: 'chatbox-ellipses', iconBg: '#EA54551A', title: 'Send a Sincere Dua Text to a Friend', quote: "Sent prayer for Tariq's job interview", xp: '+15 XP' },
  { when: 'Today • 9:30 AM',  count: '1x Completed', icon: 'bus',              iconBg: '#F07B3F1A', title: 'Smile & Greet the Bus Driver', quote: undefined, xp: '+10 XP' },
  { when: 'Yesterday • 8:45 PM', count: '1x Completed', icon: 'call',          iconBg: '#EA54551A', title: 'Call Mother & Ask for Her Dua', quote: 'Spoke for 20 mins, she was so happy!', xp: '+25 XP' },
  { when: 'Oct 16',           count: '2x Completed', icon: 'paw',              iconBg: '#FFD46033', title: 'Feed stray cat outside apartment', quote: undefined, xp: '+30 XP' },
] as const;
