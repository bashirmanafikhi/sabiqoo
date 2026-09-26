import { Pressable, type AccessibilityState } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/theme/tokens';
import * as haptics from '@/utils/haptics';

export interface SkipToggleProps {
  deedId: number;
  size?: number;
  active: boolean;
  onToggle?: () => void;
  testID?: string;
}

export function SkipToggle({
  deedId,
  size = 24,
  active,
  onToggle,
  testID,
}: SkipToggleProps) {
  const colors = useColors();
  const handlePress = () => {
    haptics.selection();
    onToggle?.();
  };

  const a11yState: AccessibilityState = { selected: active };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={active ? 'unskip' : 'skip'}
      accessibilityState={a11yState}
      onPress={handlePress}
      hitSlop={8}
      testID={testID ?? `skip-${deedId}`}
      style={{ padding: 6 }}
    >
      <Ionicons
        name={active ? 'eye-off' : 'eye-outline'}
        size={size}
        color={active ? colors.slateBlue : colors.textMuted}
      />
    </Pressable>
  );
}

export default SkipToggle;