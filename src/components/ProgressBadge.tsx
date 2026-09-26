import { View, Text } from 'react-native';
import { useColors } from '@/theme/tokens';

export interface ProgressBadgeProps {
  done: number;
  total: number;
  locale?: 'ar' | 'en';
}

function formatNum(n: number, locale: 'ar' | 'en'): string {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar' : 'en-US').format(n);
}

export function ProgressBadge({
  done,
  total,
  locale = 'en',
}: ProgressBadgeProps) {
  const colors = useColors();
  const complete = done === total && total > 0;

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={`${done} of ${total}`}
      style={{
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        borderWidth: 2,
        backgroundColor: complete ? colors.gold : colors.bg,
        borderColor: complete ? colors.ink : colors.border,
      }}
    >
      <Text
        className="text-xs font-bold"
        style={{ color: complete ? colors.ink : colors.textMuted }}
      >
        {formatNum(done, locale)}/{formatNum(total, locale)}
      </Text>
    </View>
  );
}

export default ProgressBadge;