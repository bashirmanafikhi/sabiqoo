import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useColors } from '@/theme/tokens';
import { xpIntoLevel } from '@/gamification/level';

export interface XpBarProps {
  xp: number;
  level: number;
  locale?: 'ar' | 'en';
}

function formatNum(n: number, locale: 'ar' | 'en'): string {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar' : 'en-US').format(n);
}

export function XpBar({ xp, level, locale = 'en' }: XpBarProps) {
  const colors = useColors();
  const { current, needed, percent } = xpIntoLevel(xp);
  const widthSv = useSharedValue(percent);

  useEffect(() => {
    widthSv.value = withTiming(percent, { duration: 600 });
  }, [percent, widthSv]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${widthSv.value * 100}%`,
  }));

  return (
    <View
      style={{ width: '100%' }}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: needed, now: current }}
    >
      <View
        style={{
          marginBottom: 8,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text
          className="text-sm font-bold"
          style={{ color: colors.textPrimary }}
        >
          Level {level} — Xp {formatNum(current, locale)} /{' '}
          {formatNum(needed, locale)}
        </Text>
      </View>
      <View
        style={{
          height: 16,
          borderRadius: 8,
          backgroundColor: colors.border,
          overflow: 'hidden',
          borderWidth: 2,
          borderColor: colors.ink,
        }}
      >
        <Animated.View
          style={[
            {
              height: '100%',
              backgroundColor: colors.brand,
            },
            fillStyle,
          ]}
        />
      </View>
      <View
        style={{
          marginTop: 4,
          alignItems: 'center',
        }}
      >
        <Ionicons name="star" size={16} color={colors.gold} />
      </View>
    </View>
  );
}

export default XpBar;