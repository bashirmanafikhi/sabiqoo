import { View, Text } from 'react-native';
import { useColors } from '@/theme/tokens';

export interface StreakBadgeProps {
  streak: number;
  locale?: 'ar' | 'en';
}

function formatNum(n: number, locale: 'ar' | 'en'): string {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar' : 'en-US').format(n);
}

export function StreakBadge({ streak, locale = 'en' }: StreakBadgeProps) {
  const colors = useColors();
  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={`streak ${streak} days`}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: colors.fireSoft,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <Text style={{ fontSize: 14 }} accessibilityElementsHidden>
        {'🔥 '}
      </Text>
      <Text
        className="ms-1 text-sm font-bold"
        style={{ color: colors.textPrimary }}
      >
        {formatNum(streak, locale)}
      </Text>
    </View>
  );
}

export default StreakBadge;