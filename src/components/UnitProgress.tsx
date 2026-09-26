import { View, Text } from 'react-native';
import { useColors } from '@/theme/tokens';

export interface UnitProgressProps {
  unitTitle: string;
  done: number;
  total: number;
  locale: 'ar' | 'en';
}

function formatNum(n: number, locale: 'ar' | 'en'): string {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar' : 'en-US').format(n);
}

export function UnitProgress({
  unitTitle,
  done,
  total,
  locale,
}: UnitProgressProps) {
  const colors = useColors();
  const percent = total === 0 ? 0 : Math.min(1, Math.max(0, done / total));
  const complete = done === total && total > 0;

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: total, now: done }}
      style={{ width: '100%' }}
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
          className="text-base font-bold"
          style={{ color: colors.textPrimary }}
          numberOfLines={1}
        >
          {unitTitle}
        </Text>
        <Text
          className="text-sm"
          style={{ color: colors.textMuted }}
        >
          {formatNum(done, locale)}/{formatNum(total, locale)}
        </Text>
      </View>
      <View
        style={{
          height: 10,
          borderRadius: 5,
          backgroundColor: colors.border,
          overflow: 'hidden',
          borderWidth: 1.5,
          borderColor: colors.ink,
        }}
      >
        <View
          style={{
            height: '100%',
            width: `${percent * 100}%`,
            backgroundColor: complete ? colors.gold : colors.brand,
          }}
        />
      </View>
    </View>
  );
}

export default UnitProgress;