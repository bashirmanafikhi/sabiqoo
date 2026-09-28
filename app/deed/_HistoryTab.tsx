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