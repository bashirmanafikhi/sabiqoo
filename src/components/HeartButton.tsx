import { Pressable, Text, View, type AccessibilityState } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/theme/tokens';
import * as haptics from '@/utils/haptics';

export interface HeartButtonProps {
  deedId: number;
  size?: number;
  withBadge?: boolean;
  isFilled?: boolean;
  onToggle?: () => void;
  testID?: string;
}

export function HeartButton({
  deedId,
  size = 24,
  withBadge = false,
  isFilled = false,
  onToggle,
  testID,
}: HeartButtonProps) {
  const colors = useColors();
  const handlePress = () => {
    haptics.selection();
    onToggle?.();
  };

  const a11yState: AccessibilityState = { selected: isFilled };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={isFilled ? 'unbookmark' : 'bookmark'}
      accessibilityState={a11yState}
      onPress={handlePress}
      hitSlop={8}
      testID={testID ?? `heart-${deedId}`}
      style={{ padding: 6 }}
    >
      <Ionicons
        name={isFilled ? 'heart' : 'heart-outline'}
        size={size}
        color={isFilled ? colors.fire : colors.textMuted}
      />
      {withBadge && isFilled ? (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 2,
            end: 2,
            minWidth: 14,
            height: 14,
            borderRadius: 7,
            paddingHorizontal: 3,
            backgroundColor: colors.fire,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{ color: colors.paper, fontSize: 9, fontWeight: '700' }}
          >
            •
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}

export default HeartButton;