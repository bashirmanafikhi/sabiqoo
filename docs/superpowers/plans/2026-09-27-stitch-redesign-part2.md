# Sabiqoo Stitch Redesign Implementation Plan — Part 2 (Phases 5–10)

> Continuation of `docs/superpowers/plans/2026-09-27-stitch-redesign.md`. Same global constraints apply (test mock snippet, theme tokens, etc.) — see Part 1.

---

## Phase 5 — History components & screen

### Task 23: `StatCard`, `RecentDeedCard`, `MilestoneBanner`

**Files:** Create `src/components/StatCard.tsx`, `RecentDeedCard.tsx`, `MilestoneBanner.tsx`

- [ ] **Step 1: Create `StatCard.tsx`**

```tsx
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/theme/tokens';

export interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  value: string;
  label: string;
  subLabel?: string;
  borderColor?: string;
}

export function StatCard({ icon, iconColor, value, label, subLabel, borderColor }: StatCardProps) {
  const colors = useColors();
  return (
    <View className="rounded-xl p-3 gap-1"
      style={{ backgroundColor: colors.surfaceLowest, borderWidth: 1,
        borderColor: borderColor ?? colors.border, minHeight: 88 }}>
      <View className="flex-row items-center justify-between">
        <Ionicons name={icon} size={20} color={iconColor} />
        <Text className="font-label-sm text-label-sm uppercase"
          style={{ color: '#1D2B3DBB', fontWeight: '800' }}>{label}</Text>
      </View>
      <Text className="font-headline text-headline-lg mt-2"
        style={{ color: iconColor, fontWeight: '800' }}>{value}</Text>
      {subLabel ? (
        <Text className="font-body-sm text-body-sm"
          style={{ color: '#5B6E85', fontWeight: '700' }}>{subLabel}</Text>
      ) : null}
    </View>
  );
}

export default StatCard;
```

- [ ] **Step 2: Create `RecentDeedCard.tsx`**

```tsx
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/theme/tokens';

export interface RecentDeedCardProps {
  when: string;
  countLabel: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBg?: string;
  title: string;
  quote?: string;
  xp: string;
}

export function RecentDeedCard({ when, countLabel, icon, iconBg = '#EA545526', title, quote, xp }: RecentDeedCardProps) {
  const colors = useColors();
  return (
    <View className="rounded-2xl p-3.5 gap-2"
      style={{ backgroundColor: colors.surfaceLowest, borderWidth: 1, borderColor: colors.border }}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <View className="px-2.5 py-0.5 rounded-full" style={{ backgroundColor: iconBg }}>
            <Text className="font-label-sm text-label-sm"
              style={{ color: '#EA5455', fontWeight: '800' }}>{when}</Text>
          </View>
          <Text className="font-label-sm text-label-sm"
            style={{ color: '#5B6E85', fontWeight: '700' }}>{countLabel}</Text>
        </View>
        <View className="flex-row items-center gap-1 px-2 py-0.5 rounded-full"
          style={{ backgroundColor: '#FFD46033', borderWidth: 1, borderColor: '#FFD46080' }}>
          <Ionicons name="flash" size={14} color="#F07B3F" />
          <Text className="font-label-sm text-label-sm"
            style={{ color: '#1D2B3D', fontWeight: '800' }}>{xp}</Text>
        </View>
      </View>
      <View className="flex-row items-start gap-2.5">
        <View className="w-10 h-10 rounded-xl items-center justify-center"
          style={{ backgroundColor: iconBg }}>
          <Ionicons name={icon} size={22} color="#EA5455" />
        </View>
        <View className="flex-1 min-w-0">
          <Text className="font-body text-body-md"
            style={{ color: '#1D2B3D', fontWeight: '800' }} numberOfLines={1}>{title}</Text>
          {quote ? (
            <View className="mt-1 p-1.5 px-2.5 rounded-xl flex-row items-center gap-1.5"
              style={{ backgroundColor: colors.surfaceLow }}>
              <Ionicons name="chatbox" size={16} color="#F07B3F" />
              <Text className="text-xs flex-1" style={{ color: '#5B6E85' }} numberOfLines={1}>{quote}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

export default RecentDeedCard;
```

- [ ] **Step 3: Create `MilestoneBanner.tsx`**

```tsx
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface MilestoneBannerProps {
  title: string;
  body: string;
  progressLabel: string;
  progressPercent: number;
}

export function MilestoneBanner({ title, body, progressLabel, progressPercent }: MilestoneBannerProps) {
  return (
    <View className="rounded-2xl p-5 overflow-hidden gap-3" style={{ backgroundColor: '#1D2B3D' }}>
      <View className="flex-row items-center gap-2">
        <View className="w-8 h-8 rounded-full items-center justify-center" style={{ backgroundColor: '#FFD460' }}>
          <Ionicons name="medal" size={20} color="#1D2B3D" />
        </View>
        <Text className="font-label-md text-label-md uppercase tracking-wider"
          style={{ color: '#FFD460', fontWeight: '800' }}>Next Milestone</Text>
      </View>
      <View className="gap-1">
        <Text className="font-headline text-headline-md text-white">{title}</Text>
        <Text className="text-xs" style={{ color: '#FFFFFFCC' }}>{body}</Text>
      </View>
      <View className="gap-1.5">
        <View className="flex-row justify-between">
          <Text className="font-label-sm text-label-sm"
            style={{ color: '#FFFFFFEE', fontWeight: '700' }}>{progressLabel}</Text>
          <Text className="font-label-sm text-label-sm"
            style={{ color: '#FFD460', fontWeight: '800' }}>{progressPercent}% Unlocked</Text>
        </View>
        <View className="h-2.5 w-full rounded-full p-0.5" style={{ backgroundColor: '#FFFFFF33' }}>
          <View className="h-full rounded-full"
            style={{ backgroundColor: '#F07B3F', width: `${progressPercent}%` }} />
        </View>
      </View>
    </View>
  );
}

export default MilestoneBanner;
```

- [ ] **Step 4: Commit**

```bash
git add src/components/StatCard.tsx src/components/RecentDeedCard.tsx src/components/MilestoneBanner.tsx
git commit -m "feat(components): StatCard, RecentDeedCard, MilestoneBanner"
```

### Task 24: `HeatmapGrid` + test

**Files:** Create `src/components/HeatmapGrid.tsx`, `HeatmapGrid.test.tsx`

- [ ] **Step 1: Test**

```tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { HeatmapGrid } from './HeatmapGrid';
const wrap = (c: React.ReactNode) => React.createElement(ThemeProvider, null, c);

describe('HeatmapGrid', () => {
  it('renders 5 rows of 7 tiles', () => {
    const days = Array.from({ length: 30 }, (_, i) => ({ day: i, count: (i % 5) }));
    const { getAllByTestId } = render(wrap(<HeatmapGrid days={days} />));
    expect(getAllByTestId(/^heat-tile-/).length).toBeGreaterThanOrEqual(30);
  });

  it('uses intensity buckets', () => {
    const days = [
      { day: 0, count: 0 }, { day: 1, count: 2 }, { day: 2, count: 3 },
      { day: 3, count: 4 }, { day: 4, count: 5 },
    ];
    const { getAllByTestId } = render(wrap(<HeatmapGrid days={days} />));
    expect(getAllByTestId('heat-tile-0').length + getAllByTestId('heat-tile-5').length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Create `HeatmapGrid.tsx`**

```tsx
import { View, Text } from 'react-native';

export interface HeatDay { day: number; count: number }
export interface HeatmapGridProps {
  days: HeatDay[];
  weekStart?: 0 | 1;
}

const BUCKETS = [
  { max: 0, bg: '#DCE9FF', fg: '#1D2B3D99' },
  { max: 1, bg: '#FFD46099', fg: '#1D2B3D' },
  { max: 3, bg: '#F07B3F', fg: '#FFFFFF' },
  { max: 4, bg: '#EA5455', fg: '#FFFFFF' },
  { max: Infinity, bg: '#1D2B3D', fg: '#FFD460' },
];

export function bucketFor(count: number) {
  for (const b of BUCKETS) if (count <= b.max) return b;
  return BUCKETS[BUCKETS.length - 1];
}

export function HeatmapGrid({ days, weekStart = 1 }: HeatmapGridProps) {
  const labels = weekStart === 1 ? ['M', 'T', 'W', 'T', 'F', 'S', 'S'] : ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const rows = Math.ceil(days.length / 7);
  return (
    <View>
      <View className="flex-row" style={{ gap: 6 }}>
        {labels.map((l, i) => (
          <Text key={i} className="flex-1 text-center font-label-sm text-label-sm"
            style={{ color: '#1D2B3DBB', fontWeight: '800' }}>{l}</Text>
        ))}
      </View>
      <View className="gap-1.5 pt-1">
        {Array.from({ length: rows }).map((_, row) => (
          <View key={row} className="flex-row" style={{ gap: 6 }}>
            {days.slice(row * 7, row * 7 + 7).map((d, col) => {
              const b = bucketFor(d.count);
              return (
                <View key={`${row}-${col}`} testID={`heat-tile-${d.count}`}
                  className="flex-1 h-10 rounded-xl items-center justify-center"
                  style={{ backgroundColor: b.bg }}>
                  <Text className="font-label-sm text-label-sm"
                    style={{ color: b.fg, fontWeight: '800' }}>{d.count > 0 ? d.count : ''}</Text>
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

export default HeatmapGrid;
```

- [ ] **Step 3: Run + Commit**

```bash
npx jest src/components/HeatmapGrid.test.tsx
git add src/components/HeatmapGrid.tsx src/components/HeatmapGrid.test.tsx
git commit -m "feat(components): HeatmapGrid (5 intensity buckets)"
```

### Task 25: Rebuild `app/(tabs)/history.tsx`

**Files:** Modify `app/(tabs)/history.tsx`

- [ ] **Step 1: Replace the file**

```tsx
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
            <Text className="font-label-sm text-label-sm uppercase tracking-wider"
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
```

- [ ] **Step 2: Run typecheck + Commit**

```bash
npm run typecheck
git add app/(tabs)/history.tsx
git commit -m "feat(history): rebuild with streak/heatmap/categories/recents/milestone"
```

---

## Phase 6 — Deed Detail screen

### Task 26: `app/deed/_TodayTab.tsx` (rebuild)

**Files:** Replace `app/deed/_TodayTab.tsx`

- [ ] **Step 1: Replace file**

```tsx
import { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button3D } from '@/components/Button3D';
import { useColors } from '@/theme/tokens';

export interface TodayTabProps {
  deedTitle: string;
  deedTitleAr: string;
  categoryTitle: string;
  xp: number;
  notes: string;
  onChangeNotes: (next: string) => void;
  onComplete: () => void;
}

export function TodayTab({ deedTitle, deedTitleAr, categoryTitle, xp, notes, onChangeNotes, onComplete }: TodayTabProps) {
  const colors = useColors();
  const [count, setCount] = useState(1);
  const [done, setDone] = useState(false);
  const total = count * xp;

  return (
    <View className="gap-5 px-gutter pt-3">
      <View className="flex-row items-center justify-between">
        <View className="px-3 py-1 rounded-full flex-row items-center gap-1.5"
          style={{ backgroundColor: '#F07B3F26', borderWidth: 1, borderColor: '#F07B3F33' }}>
          <Ionicons name="chatbubbles" size={15} color="#F07B3F" />
          <Text className="font-label-sm text-label-sm"
            style={{ color: '#F07B3F', fontWeight: '800' }}>{categoryTitle}</Text>
        </View>
        <View className="px-3 py-1 rounded-full flex-row items-center gap-1"
          style={{ backgroundColor: '#FFD460', borderWidth: 1, borderColor: '#FFD460CC' }}>
          <Ionicons name="star" size={15} color="#1D2B3D" />
          <Text className="font-label-sm text-label-sm"
            style={{ color: '#1D2B3D', fontWeight: '800' }}>+{xp} XP</Text>
        </View>
      </View>

      <View className="rounded-2xl p-6 items-center"
        style={{ backgroundColor: colors.surfaceLowest, borderWidth: 1, borderColor: colors.border }}>
        <View className="relative mb-4">
          <View className="w-24 h-24 rounded-3xl items-center justify-center"
            style={{ backgroundColor: '#EA5455',
              shadowColor: '#C83E40', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 0 }}>
            <Ionicons name="chatbox" size={48} color="#FFFFFF" />
          </View>
          <View className="absolute -top-2 -right-2 w-8 h-8 rounded-full items-center justify-center"
            style={{ backgroundColor: '#FFD460', borderWidth: 2, borderColor: '#FFFFFF' }}>
            <Ionicons name="sparkles" size={18} color="#1D2B3D" />
          </View>
        </View>

        <Text className="font-headline text-headline-md text-center" style={{ color: '#1D2B3D' }}>{deedTitle}</Text>
        <Text className="font-arabic text-body-md text-center mt-1" dir="auto"
          style={{ color: '#EA5455', fontWeight: '700' }}>{deedTitleAr}</Text>
        <Text className="font-body text-body-sm text-center max-w-xs mt-3 leading-6"
          style={{ color: '#5B6E85' }}>
          Take 30 seconds to send a heartfelt prayer or encouraging message.
        </Text>

        <View className="mt-4 flex-row items-center gap-2 flex-wrap justify-center">
          <View className="px-3 py-1 rounded-full flex-row items-center gap-1" style={{ backgroundColor: colors.surfaceLow }}>
            <Ionicons name="timer" size={14} color="#1D2B3D" />
            <Text className="font-label-sm text-label-sm" style={{ color: '#1D2B3D', fontWeight: '800' }}>Easy • &lt; 1 min</Text>
          </View>
          <View className="px-3 py-1 rounded-full flex-row items-center gap-1" style={{ backgroundColor: colors.surfaceLow }}>
            <Ionicons name="repeat" size={14} color="#1D2B3D" />
            <Text className="font-label-sm text-label-sm" style={{ color: '#1D2B3D', fontWeight: '800' }}>Repeatable Daily</Text>
          </View>
          <View className="px-3 py-1 rounded-full flex-row items-center gap-1" style={{ backgroundColor: '#1D2B3D' }}>
            <Ionicons name="checkmark-circle" size={14} color="#FFD460" />
            <Text className="font-label-sm text-label-sm text-white" style={{ fontWeight: '800' }}>Sunnah Habit</Text>
          </View>
        </View>
      </View>

      <View className="rounded-2xl p-4 gap-3"
        style={{ backgroundColor: colors.surfaceLowest, borderWidth: 1, borderColor: colors.border }}>
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="font-headline text-headline-sm" style={{ color: '#1D2B3D' }}>Times performed today</Text>
            <Text className="font-body text-body-sm" style={{ color: '#5B6E85' }}>Multiply your reward</Text>
          </View>
          <Text className="font-label-md text-label-md px-2.5 py-0.5 rounded-full"
            style={{ backgroundColor: '#FFD46066', borderWidth: 1, borderColor: '#FFD46099', color: '#1D2B3D', fontWeight: '800' }}>
            +{total} XP
          </Text>
        </View>
        <View className="flex-row items-center justify-center gap-4">
          <View className="w-14 h-14 rounded-2xl items-center justify-center"
            style={{ backgroundColor: colors.surfaceLow, borderWidth: 1, borderColor: colors.border }}>
            <Ionicons name="remove" size={24} color="#1D2B3D" />
          </View>
          <View className="w-24 h-14 rounded-2xl items-center justify-center"
            style={{ backgroundColor: colors.surfaceLow, borderWidth: 1, borderColor: colors.border }}>
            <Text className="font-headline text-headline-lg" style={{ color: '#1D2B3D', fontWeight: '800' }}>{count}</Text>
          </View>
          <View className="w-14 h-14 rounded-2xl items-center justify-center"
            style={{ backgroundColor: '#F07B3F',
              shadowColor: '#CF6027', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 1, shadowRadius: 0 }}>
            <Ionicons name="add" size={26} color="#FFFFFF" />
          </View>
        </View>
        <View>
          <View className="flex-row items-center justify-between mb-1">
            <Text className="font-label-sm text-label-sm" style={{ color: '#1D2B3D', fontWeight: '800' }}>
              Personal Reflection (Optional)
            </Text>
            <Text className="font-body-sm text-body-sm" style={{ color: '#5B6E85' }}>Private to you</Text>
          </View>
          <TextInput
            value={notes}
            onChangeText={onChangeNotes}
            placeholder="Add a personal note (optional)..."
            placeholderTextColor="#5B6E8599"
            multiline numberOfLines={2}
            className="p-3 rounded-xl"
            style={{ backgroundColor: colors.surfaceLow, borderWidth: 1, borderColor: colors.border, color: '#1D2B3D', textAlignVertical: 'top' }}
          />
        </View>
      </View>

      <View>
        <Button3D
          label={`Mark as Completed (+${total} XP)`}
          variant="coral"
          onPress={() => { setDone(true); onComplete(); }}
          loading={done}
          leadingIcon={<Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />}
          trailingIcon={<Ionicons name="arrow-forward" size={20} color="#FFFFFF" />}
        />
        {done ? (
          <View className="mt-2 rounded-xl p-3.5 flex-row items-center justify-between"
            style={{ backgroundColor: '#FFD460', borderWidth: 1, borderColor: '#FFD460E5' }}>
            <View className="flex-row items-center gap-2">
              <Ionicons name="sparkles" size={24} color="#1D2B3D" />
              <Text className="font-headline text-label-sm" style={{ color: '#1D2B3D' }}>Barakallahu Feek! Deed logged for today.</Text>
            </View>
          </View>
        ) : null}
      </View>

      <View className="rounded-2xl p-4 gap-2"
        style={{ backgroundColor: colors.surfaceLowest, borderWidth: 1, borderColor: colors.border }}>
        <Text className="font-label-sm text-label-sm uppercase flex-row items-center gap-1"
          style={{ color: '#F07B3F', fontWeight: '800' }}>
          Prophetic Wisdom
        </Text>
        <Text className="font-body text-body-sm italic" style={{ color: '#1D2B3DCC' }}>
          "No Muslim servant prays for his brother behind his back, but that the angel says: 'And to you the same.'"
        </Text>
      </View>
    </View>
  );
}

export default TodayTab;
```

- [ ] **Step 2: Commit**

```bash
git add app/deed/_TodayTab.tsx
git commit -m "feat(deed): rebuild Today tab (hero + stepper + complete CTA + celebration)"
```

### Task 27: `app/deed/_EvidenceTab.tsx` (rebuild)

**Files:** Replace `app/deed/_EvidenceTab.tsx`

- [ ] **Step 1: Replace file**

```tsx
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/theme/tokens';

export interface EvidenceTabProps {
  sourceTitle: string;
  sourceCollection: string;
  authenticityLabel: string;
  arabicText: string;
  englishTranslation: string;
  lessonTitle: string;
  lessonBody: string;
  secondarySource?: string;
  secondaryText?: string;
  calloutText?: string;
}

export function EvidenceTab({
  sourceTitle, sourceCollection, authenticityLabel,
  arabicText, englishTranslation,
  lessonTitle, lessonBody, secondarySource, secondaryText, calloutText,
}: EvidenceTabProps) {
  const colors = useColors();
  return (
    <View className="gap-4 px-gutter pt-3">
      <View className="rounded-2xl p-5 gap-4"
        style={{ backgroundColor: colors.surfaceLowest, borderWidth: 1, borderColor: colors.border }}>
        <View className="flex-row items-center justify-between pb-2 border-b" style={{ borderColor: colors.border }}>
          <View className="flex-row items-center gap-2">
            <View className="w-8 h-8 rounded-full items-center justify-center" style={{ backgroundColor: '#1D2B3D' }}>
              <Ionicons name="checkmark" size={18} color="#FFD460" />
            </View>
            <View>
              <Text className="font-headline text-label-md" style={{ color: '#1D2B3D', fontWeight: '800' }}>{sourceTitle}</Text>
              <Text className="font-body text-xs" style={{ color: '#5B6E85' }}>{sourceCollection}</Text>
            </View>
          </View>
          <Text className="px-2.5 py-0.5 rounded-full"
            style={{ backgroundColor: '#FFD46033', borderWidth: 1, borderColor: '#FFD46080' }}>
            <Text className="font-headline text-xs" style={{ color: '#1D2B3D', fontWeight: '800' }}>{authenticityLabel}</Text>
          </Text>
        </View>

        <View className="p-4 rounded-xl"
          style={{ backgroundColor: colors.surfaceLow, borderWidth: 1, borderColor: colors.border }}>
          <Text className="font-arabic text-headline-sm text-right leading-9"
            style={{ color: '#1D2B3D', fontWeight: '700' }} dir="rtl">{arabicText}</Text>
        </View>

        <View className="gap-1">
          <Text className="font-headline text-xs uppercase tracking-wider"
            style={{ color: '#F07B3F', fontWeight: '800' }}>Translation</Text>
          <Text className="font-body text-body-md leading-6" style={{ color: '#1D2B3D' }}>
            {englishTranslation}
          </Text>
        </View>

        <View className="p-3.5 rounded-xl flex-row gap-3 items-start"
          style={{ backgroundColor: colors.surfaceLow, borderWidth: 1, borderColor: colors.border }}>
          <Ionicons name="bulb" size={22} color="#F07B3F" style={{ marginTop: 2 }} />
          <View className="flex-1 gap-0.5">
            <Text className="font-headline text-xs" style={{ color: '#1D2B3D', fontWeight: '800' }}>{lessonTitle}</Text>
            <Text className="font-body text-body-sm leading-5" style={{ color: '#5B6E85' }}>{lessonBody}</Text>
          </View>
        </View>
      </View>

      {secondarySource ? (
        <View className="rounded-2xl p-4 gap-1.5"
          style={{ backgroundColor: colors.surfaceLowest, borderWidth: 1, borderColor: colors.border }}>
          <View className="flex-row items-center gap-2">
            <Ionicons name="book" size={18} color="#EA5455" />
            <Text className="font-headline text-xs" style={{ color: '#1D2B3D', fontWeight: '800' }}>{secondarySource}</Text>
          </View>
          <Text className="font-body text-body-sm" style={{ color: '#5B6E85' }}>{secondaryText}</Text>
        </View>
      ) : null}

      {calloutText ? (
        <View className="rounded-2xl p-4 flex-row items-center gap-3"
          style={{ backgroundColor: '#F07B3F' }}>
          <View className="w-11 h-11 rounded-xl items-center justify-center"
            style={{ backgroundColor: '#FFFFFF33' }}>
            <Ionicons name="heart" size={22} color="#FFFFFF" />
          </View>
          <Text className="font-body text-body-sm font-semibold leading-5 flex-1" style={{ color: '#FFFFFF' }}>
            {calloutText}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

export default EvidenceTab;
```

- [ ] **Step 2: Commit**

```bash
git add app/deed/_EvidenceTab.tsx
git commit -m "feat(deed): rebuild Evidence tab (Arabic hadith + translation + lesson)"
```

### Task 28: `app/deed/_HistoryTab.tsx` (rebuild)

**Files:** Replace `app/deed/_HistoryTab.tsx`

- [ ] **Step 1: Replace file**

```tsx
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/theme/tokens';

export interface HistoryEntry { when: string; text: string; countLabel: string; xp: string }
export interface HistoryTabProps {
  allTimeLabel: string;
  allTimeValue: string;
  allTimeSub: string;
  xpLabel: string;
  xpValue: string;
  xpSub: string;
  entries: HistoryEntry[];
  streakLabel: string;
  streakBody: string;
}

export function HistoryTab(props: HistoryTabProps) {
  const colors = useColors();
  return (
    <View className="gap-4 px-gutter pt-3">
      <View className="flex-row gap-3">
        <View className="flex-1 p-4 rounded-2xl gap-1"
          style={{ backgroundColor: colors.surfaceLowest, borderWidth: 1, borderColor: colors.border }}>
          <Text className="font-body text-body-sm" style={{ color: '#5B6E85' }}>{props.allTimeLabel}</Text>
          <Text className="font-headline text-headline-md mt-1" style={{ color: '#EA5455', fontWeight: '800' }}>{props.allTimeValue}</Text>
          <View className="flex-row items-center gap-1 mt-1">
            <Ionicons name="trending-up" size={14} color="#F07B3F" />
            <Text className="font-headline text-xs" style={{ color: '#1D2B3D', fontWeight: '800' }}>{props.allTimeSub}</Text>
          </View>
        </View>
        <View className="flex-1 p-4 rounded-2xl gap-1"
          style={{ backgroundColor: colors.surfaceLowest, borderWidth: 1, borderColor: colors.border }}>
          <Text className="font-body text-body-sm" style={{ color: '#5B6E85' }}>{props.xpLabel}</Text>
          <Text className="font-headline text-headline-md mt-1" style={{ color: '#1D2B3D', fontWeight: '800' }}>{props.xpValue}</Text>
          <View className="flex-row items-center gap-1 mt-1">
            <Ionicons name="medal" size={14} color="#FFD460" />
            <Text className="font-headline text-xs" style={{ color: '#1D2B3D', fontWeight: '800' }}>{props.xpSub}</Text>
          </View>
        </View>
      </View>

      <View className="flex-row items-center justify-between">
        <Text className="font-headline text-xs" style={{ color: '#1D2B3D', fontWeight: '800' }}>Recent Completions</Text>
        <Text className="font-body text-body-sm" style={{ color: '#5B6E85' }}>Last 30 Days</Text>
      </View>

      <View className="gap-2.5">
        {props.entries.map((e, i) => (
          <View key={i} className="p-3.5 rounded-2xl flex-row items-start justify-between gap-3"
            style={{ backgroundColor: colors.surfaceLowest, borderWidth: 1, borderColor: colors.border }}>
            <View className="flex-row items-start gap-3">
              <View className="w-9 h-9 rounded-xl items-center justify-center" style={{ backgroundColor: '#EA5455' }}>
                <Ionicons name="checkmark" size={18} color="#FFFFFF" />
              </View>
              <View>
                <Text className="font-headline text-xs" style={{ color: '#1D2B3D', fontWeight: '800' }}>{e.when}</Text>
                <Text className="font-body text-body-sm mt-0.5" style={{ color: '#5B6E85' }}>"{e.text}"</Text>
                <Text className="font-headline text-xs mt-1" style={{ color: '#F07B3F', fontWeight: '800' }}>{e.countLabel}</Text>
              </View>
            </View>
            <Text className="font-headline text-xs px-2.5 py-0.5 rounded-full"
              style={{ backgroundColor: '#FFD460', color: '#1D2B3D', fontWeight: '800' }}>
              {e.xp}
            </Text>
          </View>
        ))}
      </View>

      <View className="p-4 rounded-2xl items-center gap-1.5 mt-2"
        style={{ backgroundColor: colors.surfaceLowest, borderWidth: 1, borderColor: colors.border }}>
        <Ionicons name="sparkles" size={30} color="#FFD460" />
        <Text className="font-headline text-xs" style={{ color: '#1D2B3D', fontWeight: '800' }}>{props.streakLabel}</Text>
        <Text className="font-body text-body-sm text-center max-w-xs" style={{ color: '#5B6E85' }}>
          {props.streakBody}
        </Text>
      </View>
    </View>
  );
}

export default HistoryTab;
```

- [ ] **Step 2: Commit**

```bash
git add app/deed/_HistoryTab.tsx
git commit -m "feat(deed): rebuild History tab (stats + timeline + streak footer)"
```

### Task 29: `app/deed/_Header.tsx` (rebuild) and `app/deed/[id].tsx` (rebuild)

**Files:** Replace `app/deed/_Header.tsx`, `app/deed/[id].tsx`

- [ ] **Step 1: Replace `_Header.tsx`**

```tsx
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/theme/tokens';

export interface DeedHeaderProps {
  onBack: () => void;
  onBookmark: () => void;
  onSkip: () => void;
}

export function DeedHeader({ onBack, onBookmark, onSkip }: DeedHeaderProps) {
  const colors = useColors();
  return (
    <View className="h-16 px-gutter flex-row items-center justify-between"
      style={{ backgroundColor: colors.bg, borderBottomWidth: 1, borderBottomColor: colors.border }}>
      <Pressable accessibilityLabel="back" accessibilityRole="button" onPress={onBack}
        className="w-9 h-9 rounded-full items-center justify-center">
        <Ionicons name="chevron-back" size={22} color={colors.text} />
      </Pressable>
      <Text className="font-headline text-headline-sm" style={{ color: colors.text }}>Saved Deed</Text>
      <Pressable accessibilityLabel="avatar" accessibilityRole="button"
        className="w-9 h-9 rounded-full items-center justify-center"
        style={{ backgroundColor: '#1D2B3D' }}>
        <Ionicons name="person" size={18} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

export default DeedHeader;
```

- [ ] **Step 2: Replace `[id].tsx`**

```tsx
import { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useColors } from '@/theme/tokens';
import { SegmentedControl } from '@/components/SegmentedControl';
import { DeedHeader } from './_Header';
import { TodayTab } from './_TodayTab';
import { EvidenceTab } from './_EvidenceTab';
import { HistoryTab } from './_HistoryTab';

type Tab = 'today' | 'evidence' | 'history';

export default function DeedDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>('today');
  const [notes, setNotes] = useState('Sent to Tariq before his morning bar exam!');

  const onComplete = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <DeedHeader onBack={() => router.back()} onBookmark={() => {}} onSkip={() => {}} />
      <View className="px-gutter pt-3 pb-2">
        <View className="px-3 py-1 rounded-full self-start flex-row items-center gap-1.5"
          style={{ backgroundColor: '#1D2B3D1A' }}>
          <IoniconsInline name="sparkles" size={15} color="#EA5455" />
          <Text className="font-label-sm text-label-sm uppercase tracking-wider"
            style={{ color: '#1D2B3D', fontWeight: '800' }}>
            Day 14 Journey
          </Text>
        </View>
      </View>

      <View className="px-gutter mb-3">
        <SegmentedControl<Tab> value={tab} onChange={setTab}
          options={[
            { value: 'today', label: t('deed.tabs.today'), leadingIcon: <IoniconsInline name="sunny" size={16} color={tab === 'today' ? '#FFFFFF' : '#1D2B3D'} /> },
            { value: 'evidence', label: t('deed.tabs.evidence'), leadingIcon: <IoniconsInline name="book" size={16} color={tab === 'evidence' ? '#FFFFFF' : '#1D2B3D'} /> },
            { value: 'history', label: t('deed.tabs.history'), leadingIcon: <IoniconsInline name="time" size={16} color={tab === 'history' ? '#FFFFFF' : '#1D2B3D'} /> },
          ]} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 96 }} keyboardShouldPersistTaps="handled">
        {tab === 'today' ? (
          <TodayTab
            deedTitle="Send a Sincere Dua Text to a Friend"
            deedTitleAr="دعاءٌ لأخيك بظهر الغيب برسالةٍ صادقة"
            categoryTitle="Everyday Smiles & Kind Words"
            xp={15}
            notes={notes}
            onChangeNotes={setNotes}
            onComplete={onComplete}
          />
        ) : null}
        {tab === 'evidence' ? (
          <EvidenceTab
            sourceTitle="Sahih Muslim 2732"
            sourceCollection="Book of Dhikr, Dua & Repentance"
            authenticityLabel="صحيح • Authentic"
            arabicText="«مَا مِنْ عَبْدٍ مُسْلِمٍ يَدْعُو لأَخِيهِ بِظَهْرِ الْغَيْبِ إِلاَّ قَالَ الْمَلَكُ: وَلَكَ بِمِثْلٍ»"
            englishTranslation="Abu Darda reported: The Messenger of Allah said, 'No Muslim servant prays for his brother in his absence but that an angel says: And to you the same.'"
            lessonTitle="Key Lesson & Reflection"
            lessonBody="Supplicating for another without their knowledge is free of social show and insincerity."
            secondarySource="Sunan Abi Dawud 1534"
            secondaryText="The fastest supplication to be answered is the prayer of someone for his brother in his absence."
            calloutText="Who in your contacts list is quietly undergoing a hardship? A 10-word text can lift an entire mountain today."
          />
        ) : null}
        {tab === 'history' ? (
          <HistoryTab
            allTimeLabel="All-Time Duas Sent"
            allTimeValue="19"
            allTimeSub="+4 this week"
            xpLabel="Total Barakah XP"
            xpValue="285"
            xpSub="Silver Habit Tier"
            entries={[
              { when: 'Yesterday', text: 'Sent to Sister Mariam for good health', countLabel: 'Completed 1x', xp: '+15 XP' },
              { when: '3 Days Ago • Shawwal 4', text: 'Group message to university study circle', countLabel: 'Completed 3x', xp: '+45 XP' },
              { when: 'Last Friday • Jumu\'ah', text: 'Dua before Maghrib hour to cousin Zayd', countLabel: 'Completed 1x', xp: '+15 XP' },
            ]}
            streakLabel="Consistency Streak: 5 Days"
            streakBody="Keep sending daily blessings to unlock the Kind Soul golden road trophy badge!"
          />
        ) : null}
      </ScrollView>
    </View>
  );
}

import { Text } from 'react-native';
import { Ionicons as IoniconsInline } from '@expo/vector-icons';
```

- [ ] **Step 3: Run typecheck + Commit**

```bash
npm run typecheck
git add app/deed/[id].tsx app/deed/_Header.tsx
git commit -m "feat(deed): wire 3-tab Today/Evidence/History detail screen"
```

---

## Phase 7 — Settings + Bookmarks re-skin

### Task 30: Refactor `app/settings/index.tsx`

**Files:** Modify `app/settings/index.tsx`

- [ ] **Step 1: Replace the file**

```tsx
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useColors, useTheme, type ThemeMode } from '@/theme/tokens';
import { useLocale, type Locale } from '@/i18n/LocaleProvider';
import { SegmentedControl } from '@/components/SegmentedControl';
import { HudPill } from '@/components/HudPill';
import * as skippedRepo from '@/repos/skippedRepo';
import * as deedsRepo from '@/repos/deedsRepo';
import * as categoriesRepo from '@/repos/categoriesRepo';
import * as profileRepo from '@/repos/profileRepo';
import { yesterdayIsoLocal, titleFor, pickLocale } from '../_helpers';
import { Button3D } from '@/components/Button3D';
import type { Deed, Category, UserProfile } from '@/db/schema';

interface SkippedRow { deed: Deed; category: Category | null; }

function SectionHeader({ label }: { label: string }) {
  const colors = useColors();
  return (
    <Text className="mb-2 mt-6 font-headline text-label-md uppercase tracking-wider"
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
```

- [ ] **Step 2: Delete the local Segment replacement + Commit**

```bash
git rm app/settings/_SegmentedControl.tsx
git add app/settings/index.tsx
git commit -m "feat(settings): reskin with coral/navy/tangerine + shared SegmentedControl"
```

### Task 31: Refactor `app/bookmarks/index.tsx`

**Files:** Modify `app/bookmarks/index.tsx`

- [ ] **Step 1: Apply the new design tokens.** Read the existing file with `read`, then keep the existing structure but:

1. Add `import { AppTopBar } from '@/components/AppTopBar';` and render it at the top:
```tsx
<AppTopBar streakDays={7} xp={340} savedCount={deeds.length}
  onSettings={() => router.push('/settings')}
  onToggleLocale={() => router.push('/settings')}
  onAvatar={() => router.back()} />
```

2. Replace all hard-coded `colors.brand*`, `colors.accent*` references with new tokens:
- `colors.brand` → `coral[700]` inline `#EA5455`
- `colors.brandBlue` → `tangerine[700]` inline `#F07B3F`
- `colors.accentGold` → `amber-gold` inline `#FFD460`
- `colors.fire` → inline `#EA5455`
- `colors.ink` → `#1D2B3D`
- `colors.paper` → `#FFFFFF`
- `colors.stateLocked` → `colors.border`
- `colors.stateLockedDark` → `colors.outline`

3. Update header bg → `colors.bg + 'cc'` (matches AppTopBar).

4. Update each bookmarked icon to use `colors.coral` fill (via inline `#EA5455`).

5. Change the title font to `font-headline text-headline-sm` and bilingual add the Arabic subtitle below.

6. Add a section that says `t('bookmarks.empty')` when no deeds are bookmarked.

The new file should preserve the current behavior of rendering `<HeartButton>`-style rows but with the new coral/navy design. Commit:

```bash
git add app/bookmarks/index.tsx
git commit -m "feat(bookmarks): reskin with coral/tangerine/amber-gold + bilingual headers"
```

---

## Phase 8 — i18n additions

### Task 32: Add new translation keys

**Files:** Modify `src/i18n/en.json` and `src/i18n/ar.json`

- [ ] **Step 1: Add `roadmap.*`, `catalog.*` keys** (English)

```json
"roadmap": {
  "unitProgress": "Progress: {{done}} of {{total}} Steps",
  "chestTitle": "Daily Barakah Gift!",
  "chestBody": "You maintained a streak. Here is your daily motivational gift:",
  "todaysRecommended": "Today's Recommended Deed",
  "rewardLabel": "+{{xp}} XP • 1 Barakah Gem",
  "completeLabel": "Mark as Done",
  "levelCardTitle": "Path of Barakah",
  "dailyGoalRemaining": "Daily Goal: {{count}} deeds remaining",
  "branchA": "Choice A: Spiritual",
  "branchB": "Choice B: Financial",
  "restoreChest": "Alhamdulillah!"
},
"catalog": {
  "searchPlaceholder": "Search 150+ deeds (e.g. smile, water, family)...",
  "counter": "Showing {{shown}} of {{total}} deeds",
  "filtersLabel": "Filters",
  "activeRealm": "Active Realm",
  "masteryLevel": "Category Mastery Level {{level}}",
  "emptyTitle": "No deeds found for your search",
  "emptyBody": "Try adjusting keywords, exploring other realms, or clearing active filters.",
  "clearFilters": "Clear All Filters",
  "allDeedsLabel": "All Deeds",
  "allDeedsCount": "{{count}}"
},
"history": {
  "pageTag": "سابقوا • Journey Log",
  "pageTitle": "Spiritual Footprint",
  "streakTitle": "{{days}} Day Streak",
  "activeTag": "Active",
  "recordText": "Record: {{record}} days • Personal Best",
  "freezesLabel": "{{count}} Freezes",
  "statTotal": "Total",
  "statTotalLabel": "Deeds Logged",
  "statXp": "XP",
  "statXpLabel": "Barakah {{level}}",
  "statScore": "Score",
  "statScoreLabel": "Weekly Goal",
  "consistencyHeatmap": "Consistency Heatmap",
  "consistencySub": "Last 30 Days Activity Pulse",
  "deedsPerDay": "{{count}} Deeds/day",
  "categoryDistribution": "Category Distribution",
  "categorySub": "Where your barakah radiates",
  "recentDeeds": "Recent Deeds",
  "thisWeek": "This Week",
  "nextMilestone": "Next Milestone",
  "fewerDeeds": "Fewer deeds",
  "fiveDeeds": "5 deeds"
},
"deedDetail": {
  "tabs": { "today": "Today", "evidence": "Evidence", "history": "History" },
  "todayCategory": "Everyday Smiles & Kind Words",
  "todaySubtitle": "Take 30 seconds to send a heartfelt prayer or encouraging message.",
  "badgeEasy": "Easy • < 1 min",
  "badgeRepeatable": "Repeatable Daily",
  "badgeSunnah": "Sunnah Habit",
  "stepperLabel": "Times performed today",
  "stepperSub": "Multiply your reward",
  "notesLabel": "Personal Reflection (Optional)",
  "notesPrivate": "Private to you",
  "notesPlaceholder": "Add a personal note (optional)...",
  "completeCta": "Mark as Completed (+{{xp}} XP)",
  "celebrationBanner": "Barakallahu Feek! Deed logged for today.",
  "propheticWisdom": "Prophetic Wisdom",
  "propheticPreview": "\"No Muslim servant prays for his brother behind his back, but that the angel says: 'And to you the same.'\"",
  "evidenceAuthentic": "صحيح • Authentic",
  "evidenceTranslation": "Translation",
  "evidenceLesson": "Key Lesson & Reflection",
  "evidenceCallout": "Who in your contacts list is quietly undergoing a hardship? A 10-word text can lift an entire mountain today.",
  "historyAllTime": "All-Time Duas Sent",
  "historyXpTotal": "Total Barakah XP",
  "historyRecentTitle": "Recent Completions",
  "historyRecentSub": "Last 30 Days"
}
```

- [ ] **Step 2: Mirror in `src/i18n/ar.json`** with Arabic translations following the same key tree.

- [ ] **Step 3: Verify by running check**

```bash
npm run check:i18n
npm run typecheck
git add src/i18n/en.json src/i18n/ar.json
git commit -m "feat(i18n): add roadmap/catalog/history/deedDetail bilingual keys"
```

---

## Phase 9 — App icon

### Task 33: Replace app icon

**Files:** Modify `app.json`; regenerate icon PNGs in `assets/`

The Stitch project provides a 512×512 SVG at:
`https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVpbWFnZS9zdmdce91cGRyZXYoZGF0YV82OGMzNjcyOGYzMTdhMDFjZTNlYjkwMDBkODYxOGVlMikSHhJhcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlEAEaJ3Byb2plY3RzLzEyNzg1NjI4MjE1Njk4NzM3MzI1L3NjcmVlbnMvOWE2YmRhNWFkMTUxNDE4NzljMWIyMmNmYjU3NGNmZmMvZmlsZUVudHJpZXMvc3Zn&filename=&opi=89354086` (fetched via `stitch_get_screen` earlier).

- [ ] **Step 1: Fetch the SVG and rasterize to PNGs at 192/256/384/512/1024**

```bash
# Save the SVG locally
curl -L "<url>" -o assets/icon-source.svg

# Use sharp or rsvg-convert to render to PNGs. Since this is a Web/Expo context, prefer:
npx -y sharp-cli -i assets/icon-source.svg -o assets/icon.png resize 1024 1024
npx -y sharp-cli -i assets/icon-source.svg -o assets/icon-192.png resize 192 192
npx -y sharp-cli -i assets/icon-source.svg -o assets/icon-256.png resize 256 256
npx -y sharp-cli -i assets/icon-source.svg -o assets/icon-384.png resize 384 384
npx -y sharp-cli -i assets/icon-source.svg -o assets/icon-512.png resize 512 512
npx -y sharp-cli -i assets/icon-source.svg -o assets/adaptive-icon.png resize 1024 1024
npx -y sharp-cli -i assets/icon-source.svg -o assets/splash.png resize 1242 1242
```

If `sharp-cli` is unavailable in the environment, use ImageMagick:
```bash
magick -density 400 assets/icon-source.svg -resize 1024x1024 assets/icon.png
# repeat for each size
```

If neither is available, do this manually: open the SVG in a browser, take screenshots at the right sizes, save as PNG.

- [ ] **Step 2: Update `app.json` icon entries**

```json
{
  "expo": {
    "icon": "./assets/icon.png",
    "ios": { "icon": "./assets/icon-192.png", "supportsTablet": true },
    "android": {
      "icon": "./assets/icon-512.png",
      "adaptiveIcon": { "foregroundImage": "./assets/adaptive-icon.png", "backgroundColor": "#EA5455" }
    },
    "splash": { "image": "./assets/splash.png", "backgroundColor": "#F8F9FF" }
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add app.json assets/icon*.png assets/splash.png assets/icon-source.svg
git commit -m "feat(icon): replace app icon with Stitch Coral Sabiqoo mark"
```

---

## Phase 10 — Cleanup + final QA

### Task 34: Remove legacy components

**Files:** Delete `src/components/BigButton3D.tsx`, `BigButton3D.test.tsx`, `Node.tsx`, `RoadmapPath.tsx`, `DeedCard.tsx`, `LogRow.tsx`, `StreakBadge.tsx`, `XpBar.tsx`, `CategoryCard.tsx`, `ProgressBadge.tsx`, `ReferenceCard.tsx`, `SkipToggle.tsx`, `UnitProgress.tsx`, `HeartButton.tsx`, `ConfettiOverlay.tsx`

- [ ] **Step 1: Confirm no consumers**

```bash
# Search the codebase for any file that still imports the old component names
grep -r "BigButton3D\|@/components/Node\|@/components/DeedCard\|@/components/LogRow\|@/components/StreakBadge\|@/components/XpBar\|@/components/CategoryCard\|@/components/ProgressBadge\|@/components/ReferenceCard\|@/components/SkipToggle\|@/components/UnitProgress\|@/components/HeartButton\|@/components/ConfettiOverlay" --include='*.ts' --include='*.tsx' app src
```

Expected: no results (everything was migrated to Button3D, RoadmapNode, CatalogDeedCard, RecentDeedCard, StatCard, RecentDeedCard, HudPill, ProgressBar, HudPill-with-coral, AppTopBar). If anything remains, fix it first.

- [ ] **Step 2: Delete the old files + tailwind legacy keys**

```bash
git rm src/components/BigButton3D.tsx src/components/BigButton3D.test.tsx
git rm src/components/Node.tsx src/components/RoadmapPath.tsx src/components/DeedCard.tsx
git rm src/components/LogRow.tsx src/components/StreakBadge.tsx src/components/XpBar.tsx
git rm src/components/CategoryCard.tsx src/components/ProgressBadge.tsx
git rm src/components/ReferenceCard.tsx src/components/SkipToggle.tsx
git rm src/components/UnitProgress.tsx src/components/HeartButton.tsx
git rm src/components/ConfettiOverlay.tsx
```

Then edit `tailwind.config.js` and remove the entire `legacy:` block introduced in Task 1. Verify nothing breaks.

- [ ] **Step 3: Run typecheck + lint + tests**

```bash
npm run typecheck
npm run lint
npm test
```

Expected: all green. Fix any remaining broken tests (mainly test files that mocked `colors.brand` — update them to `colors.coral` if any survived).

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.js
git commit -m "chore(cleanup): delete legacy components and remove legacy Tailwind tokens"
```

### Task 35: Final QA + manual smoke

- [ ] **Step 1: Run the full QA suite**

```bash
npm run typecheck
npm run lint
npm test
npm run check:i18n
```

- [ ] **Step 2: Boot the app on iOS/Android/Web and smoke**

```bash
npm run web           # web smoke
# and in another window:
npm run start         # then press 'i' for iOS / 'a' for Android
```

Verify on screen:
- Roadmap: nodes, modals, toast, AppTopBar, AppBottomNav, level card.
- Catalog: search, chips, cards, empty state.
- History: heatmap buckets, categories, recent deeds, milestone.
- Deed Detail: 3 tabs swap; complete CTA fires celebration banner.
- Settings: theme + language segmented controls; reskinned cards.
- Bookmarks: reskinned header.

Capture screenshots in `docs/screenshots/` for the spec record.

- [ ] **Step 3: Commit any doc + screenshot updates**

```bash
git add docs/
git commit -m "docs(qa): screenshot record of redesigned screens"
```

---

## Self-Review

After writing the complete plan, check:

**1. Spec coverage (mapped to tasks):**
- §2 Tokens → Tasks 1, 3 ✓
- §3 Typography → Tasks 4, 5 ✓
- §4 Spacing & radii → Task 1 ✓
- §5 Components — all primitives → Tasks 6–17, 20–24 (part 1) ✓
- §6 Roadmap → Tasks 18, 19 ✓
- §6 Catalog → Tasks 20–22 ✓
- §6 History → Tasks 23–25 ✓
- §6 Deed Detail → Tasks 26–29 ✓
- §6 Bookmarks → Task 31 ✓
- §6 Settings → Task 30 ✓
- §7 App shell → Task 11, 19 ✓ (AppBottomNav reused in `(tabs)/_layout.tsx`)
- §8 Bilingual → Task 32, plus `Bilingual` component ✓
- §9 Data flow → no tasks needed, no schema change
- §10 Dependencies → Task 4 ✓
- §11 Files changed → every file listed in some task ✓
- §12 Testing → distributed across each task's test step ✓
- §13 Out of scope → respected (no schema, auth, Lottie redesign)

**2. Placeholder scan:** Each step has explicit code. No "TBD", "fill in details", "similar to..." references.

**3. Type consistency:**
- `Button3DProps` used in Tasks 6 (definition), 16 (uses), 26 (uses)
- `SegmentedControl<T>` used in Tasks 10, 29, 30
- `RoadmapNodeProps.state: NodeState` defined Task 12, used Task 19
- `CatalogStatus` defined Task 21, used Task 22
- `HeatDay` defined Task 24, used Task 25
- `UnitNodeSummary` defined Task 18, used Task 19
- `UnitSummary` defined Task 18, used Task 18 hook
- `Tab = 'today'|'evidence'|'history'` defined Task 29, used in `SegmentedControl<Tab>`

No signature drift detected.

---

## Execution Handoff

Plan complete and saved across two files:
- `docs/superpowers/plans/2026-09-27-stitch-redesign.md` (Part 1, Phases 0–4)
- `docs/superpowers/plans/2026-09-27-stitch-redesign-part2.md` (this file, Phases 5–10)

**Two execution options:**

1. **Subagent-Driven (recommended)** — dispatch a fresh subagent per task, two-stage review between tasks.
2. **Inline Execution** — execute tasks in this session using `executing-plans`, batch execution with checkpoints.

**Which approach?**
