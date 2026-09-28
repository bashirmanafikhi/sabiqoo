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