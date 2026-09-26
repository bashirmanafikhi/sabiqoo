import { View, Text } from 'react-native';
import { useColors } from '@/theme/tokens';

export interface LogRowProps {
  log: {
    quantity: number;
    xp_earned: number;
    completed_at: string;
    note?: string | null;
  };
  deedTitle: string;
  locale: 'ar' | 'en';
}

function formatNum(n: number, locale: 'ar' | 'en'): string {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar' : 'en-US').format(n);
}

export function LogRow({ log, deedTitle, locale }: LogRowProps) {
  const colors = useColors();
  const date = new Date(log.completed_at);
  const time = new Intl.DateTimeFormat(locale === 'ar' ? 'ar' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);

  return (
    <View
      accessibilityRole="text"
      style={{
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <Text
        className="text-sm"
        style={{ color: colors.textMuted, minWidth: 56 }}
      >
        {time}
      </Text>
      <View style={{ flex: 1, marginStart: 12 }}>
        <Text
          className="text-sm font-bold"
          style={{ color: colors.textPrimary }}
          numberOfLines={1}
        >
          {deedTitle}
        </Text>
        {log.note ? (
          <Text
            className="mt-0.5 text-xs"
            style={{ color: colors.textMuted }}
            numberOfLines={1}
          >
            {log.note}
          </Text>
        ) : null}
      </View>
      <View style={{ marginStart: 12, alignItems: 'flex-end' }}>
        <Text
          className="text-sm font-bold"
          style={{ color: colors.brand }}
        >
          ×{formatNum(log.quantity, locale)}
        </Text>
        <Text
          className="mt-0.5 text-xs"
          style={{ color: colors.gold }}
        >
          +{formatNum(log.xp_earned, locale)} XP
        </Text>
      </View>
    </View>
  );
}

export default LogRow;