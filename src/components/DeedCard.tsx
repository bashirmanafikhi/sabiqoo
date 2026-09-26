import { Pressable, View, Text, type AccessibilityState } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/theme/tokens';
import { HeartButton } from './HeartButton';
import { SkipToggle } from './SkipToggle';

export interface DeedCardProps {
  deed: {
    id: number;
    title: string;
    category_color: string;
    xp_reward: number;
    locked: boolean;
    bookmarked: boolean;
  };
  onPress: () => void;
  onToggleBookmark?: () => void;
  onToggleSkip?: () => void;
}

export function DeedCard({
  deed,
  onPress,
  onToggleBookmark,
  onToggleSkip,
}: DeedCardProps) {
  const colors = useColors();
  const a11yState: AccessibilityState = { disabled: deed.locked };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${deed.title}, ${deed.xp_reward} XP${
        deed.locked ? ', locked' : ''
      }`}
      accessibilityState={a11yState}
      disabled={deed.locked}
      onPress={onPress}
      style={{
        borderRadius: 14,
        backgroundColor: colors.elevated,
        borderWidth: 2,
        borderColor: colors.border,
        flexDirection: 'row',
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          width: 8,
          backgroundColor: deed.category_color,
        }}
      />
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          padding: 12,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            className="text-base font-bold"
            style={{ color: colors.textPrimary }}
            numberOfLines={2}
          >
            {deed.title}
          </Text>
          <Text
            className="mt-1 text-xs"
            style={{ color: colors.textMuted }}
          >
            +{deed.xp_reward} XP
          </Text>
        </View>
        {deed.locked ? (
          <View style={{ marginStart: 8 }}>
            <Ionicons
              name="lock-closed"
              size={18}
              color={colors.textMuted}
            />
          </View>
        ) : null}
        <View style={{ marginStart: 8 }}>
          <HeartButton
            deedId={deed.id}
            isFilled={deed.bookmarked}
            onToggle={onToggleBookmark}
          />
        </View>
        <View style={{ marginStart: 4 }}>
          <SkipToggle deedId={deed.id} active={false} onToggle={onToggleSkip} />
        </View>
      </View>
    </Pressable>
  );
}

export default DeedCard;