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
