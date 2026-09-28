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
