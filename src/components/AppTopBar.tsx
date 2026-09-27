import { Pressable, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/theme/tokens';
import { HudPill } from './HudPill';
import { useTranslation } from 'react-i18next';

export interface AppTopBarProps {
  streakDays: number;
  xp: number;
  savedCount: number;
  onSettings: () => void;
  onToggleLocale: () => void;
  onAvatar: () => void;
  rightSlot?: React.ReactNode;
}

export function AppTopBar({ streakDays, xp, savedCount, onSettings, onToggleLocale, onAvatar, rightSlot }: AppTopBarProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  return (
    <View
      style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50,
        paddingTop: insets.top,
        backgroundColor: colors.bg + 'cc',
        borderBottomWidth: 1, borderBottomColor: colors.border,
      }}
    >
      <View className="h-16 px-gutter flex-row items-center gap-space-xs" style={{ maxWidth: 480 }}>
        <HudPill variant="coral" icon={<Ionicons name="flame" size={18} color="#EA5455" />} label={`${streakDays}d`} />
        <HudPill variant="gold" icon={<Ionicons name="flash" size={18} color="#F07B3F" />} label={`${xp} XP`} />
        <View className="flex-1" />
        {rightSlot}
        <HudPill variant="outline" icon={<Ionicons name="heart" size={18} color="#EA5455" />} label={String(savedCount)} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('home.language')}
          onPress={onToggleLocale}
          className="h-9 px-space-sm rounded-full items-center justify-center"
          style={{ backgroundColor: colors.surfaceHigh }}
        >
          <Text className="font-label-md text-label-md" style={{ color: colors.textPrimary, fontWeight: '800' }}>ع / EN</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('settings')}
          onPress={onSettings}
          className="w-9 h-9 rounded-full items-center justify-center"
        >
          <Ionicons name="settings-outline" size={20} color={colors.textPrimary} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="avatar"
          onPress={onAvatar}
          className="w-8 h-8 rounded-full items-center justify-center"
          style={{ backgroundColor: '#2D4059' }}
        >
          <Ionicons name="person" size={18} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

export default AppTopBar;
