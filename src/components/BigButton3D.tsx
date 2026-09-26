import { useCallback } from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
  type AccessibilityState,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useColors } from '@/theme/tokens';
import * as haptics from '@/utils/haptics';

export type BigButton3DVariant = 'primary' | 'secondary' | 'ghost';

export interface BigButton3DProps {
  label: string;
  onPress: () => void;
  variant?: BigButton3DVariant;
  loading?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
  testID?: string;
}

const HEIGHT = 56;
const SHADOW_OFFSET = 4;

export function BigButton3D({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  accessibilityLabel,
  testID,
}: BigButton3DProps) {
  const colors = useColors();
  const pressed = useSharedValue(0);

  const topStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: pressed.value }],
  }));

  const palette = (() => {
    if (variant === 'primary') {
      return {
        top: colors.brand,
        bottom: colors.brandDark,
        text: colors.paper,
        outline: colors.ink,
      };
    }
    if (variant === 'secondary') {
      return {
        top: colors.brandBlue,
        bottom: colors.brandBlueDark,
        text: colors.paper,
        outline: colors.ink,
      };
    }
    return {
      top: colors.elevated,
      bottom: 'transparent',
      text: colors.textPrimary,
      outline: colors.border,
    };
  })();

  const isInactive = disabled || loading;
  const borderColor = variant === 'ghost' ? colors.border : colors.ink;

  const handlePressIn = useCallback(() => {
    pressed.value = withTiming(SHADOW_OFFSET, { duration: 80 });
    haptics.selection();
  }, [pressed]);

  const handlePressOut = useCallback(() => {
    pressed.value = withTiming(0, { duration: 120 });
  }, [pressed]);

  const a11yState: AccessibilityState = {
    disabled: !!disabled,
    busy: !!loading,
  };

  return (
    <View
      testID={testID}
      style={{
        width: '100%',
        height: HEIGHT + SHADOW_OFFSET,
      }}
    >
      {variant !== 'ghost' && (
        <View
          aria-hidden
          style={{
            position: 'absolute',
            top: SHADOW_OFFSET,
            start: 0,
            end: 0,
            bottom: 0,
            backgroundColor: palette.bottom,
            borderRadius: 14,
            borderWidth: 2,
            borderColor: colors.ink,
          }}
        />
      )}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            start: 0,
            end: 0,
            bottom: variant === 'ghost' ? 0 : SHADOW_OFFSET,
            backgroundColor: palette.top,
            borderRadius: 14,
            borderWidth: 2,
            borderColor,
          },
          topStyle,
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel ?? label}
          accessibilityState={a11yState}
          disabled={isInactive}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 12,
          }}
          testID={testID ? `${testID}-pressable` : undefined}
        >
          {loading ? (
            <ActivityIndicator color={palette.text} />
          ) : (
            <Text
              className="text-base font-bold"
              style={{ color: palette.text }}
              numberOfLines={1}
            >
              {label}
            </Text>
          )}
        </Pressable>
      </Animated.View>
    </View>
  );
}

export default BigButton3D;