import { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Pressable,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useColors } from '@/theme/tokens';
import { StreakBadge } from './StreakBadge';

export interface ConfettiOverlayProps {
  visible: boolean;
  xpEarned: number;
  onDone: () => void;
  streak?: number;
}

function starCount(xp: number): number {
  if (xp >= 60) return 3;
  if (xp >= 30) return 2;
  return 1;
}

const STAR_COUNT = 3;

export function ConfettiOverlay({
  visible,
  xpEarned,
  onDone,
  streak,
}: ConfettiOverlayProps) {
  const colors = useColors();
  const { t } = useTranslation();
  const [reduceMotion, setReduceMotion] = useState(false);

  const scalesRef = useRef<Animated.Value[]>(
    Array.from({ length: STAR_COUNT }, () => new Animated.Value(0)),
  );
  const fadeRef = useRef(new Animated.Value(0));

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((v) => {
        if (mounted) setReduceMotion(!!v);
      })
      .catch(() => undefined);
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!visible) return;
    const scales = scalesRef.current;
    const fade = fadeRef.current;
    scales.forEach((s) => s.setValue(0));
    fade.setValue(0);

    if (reduceMotion) {
      fade.setValue(1);
      return;
    }

    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      ...scales.map((s, idx) =>
        Animated.spring(s, {
          toValue: 1,
          friction: 4,
          tension: 80,
          delay: idx * 80,
          useNativeDriver: true,
        }),
      ),
    ]).start();

    const id = setTimeout(onDone, 1500);
    return () => clearTimeout(id);
  }, [visible, reduceMotion, onDone]);

  if (!visible) return null;

  const count = starCount(xpEarned);
  const scales = scalesRef.current;

  return (
    <Pressable
      accessibilityRole="alert"
      accessibilityLabel={t('reward.celebrate')}
      onPress={onDone}
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        start: 0,
        end: 0,
        backgroundColor: 'rgba(0,0,0,0.45)',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Animated.View
        style={{
          opacity: fadeRef.current,
          backgroundColor: colors.elevated,
          borderRadius: 24,
          borderWidth: 2,
          borderColor: colors.ink,
          padding: 24,
          alignItems: 'center',
          minWidth: 240,
        }}
      >
        <Text
          className="mb-2 text-2xl font-bold"
          style={{ color: colors.textPrimary }}
        >
          {t('reward.celebrate')}
        </Text>
        <Text
          className="mb-4 text-base"
          style={{ color: colors.textMuted }}
        >
          +{xpEarned} XP
        </Text>
        <View
          style={{
            marginBottom: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {Array.from({ length: count }).map((_, idx) => {
            const sv = scales[idx] ?? scales[0];
            if (!sv) return null;
            return (
              <Animated.View
                key={idx}
                style={{
                  marginHorizontal: 6,
                  transform: [{ scale: sv }],
                }}
              >
                <Ionicons name="star" size={48} color={colors.gold} />
              </Animated.View>
            );
          })}
        </View>
        {typeof streak === 'number' && streak > 0 ? (
          <StreakBadge streak={streak} />
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

export default ConfettiOverlay;