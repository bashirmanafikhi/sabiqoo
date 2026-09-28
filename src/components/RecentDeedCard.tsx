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
