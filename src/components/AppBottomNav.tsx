import { Pressable, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useColors } from '@/theme/tokens';

export type BottomTab = 'roadmap' | 'catalog' | 'history';
export interface AppBottomNavProps { active: BottomTab; onChange: (next: BottomTab) => void; }

const TABS: ReadonlyArray<{ key: BottomTab; labelKey: string; icon: any }> = [
  { key: 'roadmap', labelKey: 'home.title', icon: 'compass-outline' },
  { key: 'catalog', labelKey: 'catalog.title', icon: 'book-outline' },
  { key: 'history', labelKey: 'history.title', icon: 'trending-up-outline' },
];

export function AppBottomNav({ active, onChange }: AppBottomNavProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  return (
    <View
      style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 50,
        paddingBottom: insets.bottom,
        backgroundColor: colors.bg + 'ee',
        borderTopWidth: 1, borderTopColor: colors.border,
      }}>
      <View className="h-16 px-space-sm flex-row items-center justify-around" style={{ maxWidth: 480 }}>
        {TABS.map(tab => {
          const isActive = tab.key === active;
          const color = isActive ? '#EA5455' : colors.textPrimary + '99';
          return (
            <Pressable key={tab.key}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={t(tab.labelKey)}
              onPress={() => onChange(tab.key)}
              testID={`tab-${tab.key}`}
              className="min-w-16 min-h-12 py-1 px-space-xs items-center justify-center">
              <Ionicons name={tab.icon} size={24} color={color} />
              <Text className="font-label-sm text-label-sm mt-0.5"
                style={{ color, fontWeight: isActive ? '800' : '700' }}>
                {t(tab.labelKey)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default AppBottomNav;