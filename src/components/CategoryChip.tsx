import { Pressable, Text, View } from 'react-native';

export interface CategoryChipProps {
  label: string;
  count?: number | string;
  progress?: number;
  progressColor?: string;
  active?: boolean;
  onPress?: () => void;
  leadingIcon?: React.ReactNode;
}

export function CategoryChip({ label, count, progress, progressColor = '#F07B3F', active, onPress, leadingIcon }: CategoryChipProps) {
  const bg = active ? '#EA5455' : '#DCE9FF';
  const fg = active ? '#FFFFFF' : '#1D2B3D';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!active }}
      onPress={onPress}
      className="flex-row items-center gap-2 h-10 px-space-md rounded-full"
      style={{
        backgroundColor: bg,
        shadowColor: active ? '#C83E40' : 'transparent',
        shadowOffset: { width: 0, height: 3 }, shadowOpacity: active ? 1 : 0, shadowRadius: 0,
      }}>
      {progress != null ? (
        <View className="w-4 h-4 relative items-center justify-center">
          <View className="w-4 h-4 rounded-full border-2" style={{ borderColor: '#FFFFFF40' }} />
          <View style={{
            position: 'absolute', top: 0, left: 0, width: 16, height: 16, borderRadius: 8,
            borderWidth: 2, borderColor: progressColor, borderTopColor: 'transparent',
            transform: [{ rotate: `${(progress ?? 0) * 360}deg` }],
          }} />
        </View>
      ) : null}
      {leadingIcon}
      <Text className="font-label-md text-label-md" style={{ color: fg, fontWeight: '800' }} numberOfLines={1}>
        {label}
      </Text>
      {count != null ? (
        <Text className="font-label-sm text-label-sm" style={{ color: active ? '#FFFFFFCC' : '#1D2B3DBB', fontWeight: '700' }}>
          {count}
        </Text>
      ) : null}
    </Pressable>
  );
}

export default CategoryChip;
