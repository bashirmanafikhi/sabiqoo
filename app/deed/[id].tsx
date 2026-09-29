import { useCallback, useState } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
          <Ionicons name="sparkles" size={15} color="#EA5455" />
          <Text className="font-label-sm text-label-sm uppercase"
            style={{ color: '#1D2B3D', fontWeight: '800' }}>
            Day 14 Journey
          </Text>
        </View>
      </View>

      <View className="px-gutter mb-3">
        <SegmentedControl<Tab> value={tab} onChange={setTab}
          options={[
            { value: 'today', label: t('deed.tabs.today'), leadingIcon: <Ionicons name="sunny" size={16} color={tab === 'today' ? '#FFFFFF' : '#1D2B3D'} /> },
            { value: 'evidence', label: t('deed.tabs.evidence'), leadingIcon: <Ionicons name="book" size={16} color={tab === 'evidence' ? '#FFFFFF' : '#1D2B3D'} /> },
            { value: 'history', label: t('deed.tabs.history'), leadingIcon: <Ionicons name="time" size={16} color={tab === 'history' ? '#FFFFFF' : '#1D2B3D'} /> },
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