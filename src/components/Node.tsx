import { useEffect } from 'react';
import { Pressable, View, type AccessibilityState } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useColors } from '@/theme/tokens';
import * as haptics from '@/utils/haptics';

export type NodeState =
  | 'locked'
  | 'available'
  | 'completed'
  | 'mastered'
  | 'skipped';

export interface NodeProps {
  state: NodeState;
  deedId: number;
  onPress?: () => void;
}

const SIZE = 64;

type AnyIonicons = React.ComponentType<{
  name: string;
  size?: number;
  color?: string;
}>;
const AnyIcon = Ionicons as unknown as AnyIonicons;

const ICON_MAP: Record<NodeState, { name: string; size: number }> = {
  locked: { name: 'lock-closed', size: 22 },
  available: { name: 'star', size: 26 },
  completed: { name: 'star', size: 26 },
  mastered: { name: 'star', size: 26 },
  skipped: { name: 'eye-off', size: 22 },
};

const LABEL_KEYS: Record<NodeState, string> = {
  locked: 'catalog.locked',
  available: 'roadmap.available',
  completed: 'roadmap.completed',
  mastered: 'roadmap.mastered',
  skipped: 'skip.toggle',
};

export function Node({ state, deedId, onPress }: NodeProps) {
  const colors = useColors();
  const { t } = useTranslation();
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (state === 'available') {
      pulse.value = withRepeat(
        withTiming(1.08, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        -1,
        true,
      );
    } else {
      cancelAnimation(pulse);
      pulse.value = withTiming(1, { duration: 200 });
    }
    return () => cancelAnimation(pulse);
  }, [pulse, state]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const disabled = state === 'locked' || !onPress;
  const handlePress = () => {
    if (disabled) return;
    haptics.selection();
    onPress?.();
  };

  const palette = (() => {
    switch (state) {
      case 'locked':
        return {
          fill: colors.stateLocked,
          glyph: colors.textMuted,
          outline: colors.stateLockedDark,
        };
      case 'available':
        return {
          fill: colors.brand,
          glyph: colors.paper,
          outline: colors.ink,
        };
      case 'completed':
        return {
          fill: colors.gold,
          glyph: colors.ink,
          outline: colors.ink,
        };
      case 'mastered':
        return {
          fill: colors.gold,
          glyph: colors.ink,
          outline: colors.ink,
        };
      case 'skipped':
        return {
          fill: colors.slateBlue,
          glyph: colors.paper,
          outline: colors.slateBlueDark,
        };
    }
  })();

  const icon = ICON_MAP[state];

  const a11yState: AccessibilityState = {
    disabled,
    selected: state === 'mastered' || state === 'completed',
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t(LABEL_KEYS[state], { deedId })}
      accessibilityState={a11yState}
      disabled={disabled}
      onPress={handlePress}
      hitSlop={8}
      testID={`node-${deedId}`}
      style={{
        width: SIZE + 16,
        height: SIZE + 16,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Animated.View
        style={[
          {
            width: SIZE,
            height: SIZE,
            borderRadius: SIZE / 2,
            backgroundColor: palette.fill,
            borderWidth: 2,
            borderColor: palette.outline,
            alignItems: 'center',
            justifyContent: 'center',
          },
          animatedStyle,
        ]}
      >
        <AnyIcon name={icon.name} size={icon.size} color={palette.glyph} />
        {state === 'mastered' ? (
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              bottom: -2,
              end: -2,
              width: 26,
              height: 26,
              borderRadius: 13,
              backgroundColor: colors.fire,
              borderWidth: 2,
              borderColor: colors.ink,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AnyIcon name="flame" size={12} color={colors.paper} />
          </View>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

export default Node;