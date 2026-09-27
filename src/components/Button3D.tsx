import { useCallback } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useColors } from '@/theme/tokens';
import * as haptics from '@/utils/haptics';

export type Button3DVariant = 'coral' | 'tangerine' | 'navy' | 'gold' | 'ghost';

export interface Button3DProps {
  label: string;
  onPress: () => void;
  variant?: Button3DVariant;
  loading?: boolean;
  disabled?: boolean;
  size?: 'md' | 'lg' | 'square';
  accessibilityLabel?: string;
  testID?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

const HEIGHT = 52;
const BEVEL = 4;

const PALETTE = {
  coral:     { top: '#EA5455', bottom: '#C83E40' },
  tangerine: { top: '#F07B3F', bottom: '#CF6027' },
  navy:      { top: '#2D4059', bottom: '#1D2B3D' },
  gold:      { top: '#FFD460', bottom: '#D4A838' },
} as const;

export function Button3D({
  label, onPress, variant = 'coral', loading, disabled,
  size = 'md', accessibilityLabel, testID, leadingIcon, trailingIcon,
}: Button3DProps) {
  const colors = useColors();
  const pressed = useSharedValue(0);
  const top = useAnimatedStyle(() => ({ transform: [{ translateY: pressed.value }] }));

  const onPressIn = useCallback(() => {
    pressed.value = withTiming(BEVEL, { duration: 80 });
    haptics.selection();
  }, [pressed]);
  const onPressOut = useCallback(() => {
    pressed.value = withTiming(0, { duration: 120 });
  }, [pressed]);

  const pal = variant !== 'ghost' ? PALETTE[variant] : null;
  const topBg = pal?.top ?? colors.surfaceLowest;
  const bottomBg = pal?.bottom ?? colors.surface;
  const textColor = variant === 'gold' ? colors.navy : (variant === 'ghost' ? colors.text : '#FFFFFF');
  const w = size === 'square' ? 56 : undefined;

  return (
    <View testID={testID} style={{ width: w ?? '100%', height: HEIGHT + BEVEL }}>
      <View aria-hidden style={{
        position: 'absolute', top: BEVEL, left: 0, right: 0, bottom: 0,
        backgroundColor: bottomBg, borderRadius: 16,
      }} />
      <Animated.View style={[
        { position: 'absolute', top: 0, left: 0, right: 0, bottom: BEVEL,
          backgroundColor: topBg, borderRadius: 16 },
        top,
      ]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel ?? label}
          accessibilityState={{ disabled: !!disabled, busy: !!loading }}
          disabled={!!disabled || !!loading}
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          testID={testID ? `${testID}-pressable` : undefined}
          style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 14, paddingHorizontal: 16 }}
        >
          {loading ? (
            <ActivityIndicator color={textColor} />
          ) : (
            <>
              {leadingIcon}
              <Text className="font-label-lg text-label-lg uppercase" style={{ color: textColor, fontWeight: '800' }} numberOfLines={1}>
                {label}
              </Text>
              {trailingIcon}
            </>
          )}
        </Pressable>
      </Animated.View>
    </View>
  );
}

export default Button3D;
