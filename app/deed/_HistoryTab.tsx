import { ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LogRow } from '@/components/LogRow';
import { useColors } from '@/theme/tokens';
import { dayKey, dayLabel, titleFor, type Locale } from './_helpers';
import type { Deed, UserLog } from '@/db/schema';

export interface HistoryTabProps {
  deed: Deed;
  logs: UserLog[];
  locale: Locale;
  today: string;
}

export function HistoryTab({ deed, logs, locale, today }: HistoryTabProps) {
  const colors = useColors();
  const { t } = useTranslation();

  if (logs.length === 0) {
    return (
      <View style={{ padding: 24, alignItems: 'center' }}>
        <Text
          className="text-base"
          style={{ color: colors.textMuted, textAlign: 'center' }}
        >
          {t('deed.history.empty')}
        </Text>
      </View>
    );
  }

  const grouped = new Map<string, UserLog[]>();
  for (const l of logs) {
    const key = dayKey(l.dayBucket);
    const arr = grouped.get(key) ?? [];
    arr.push(l);
    grouped.set(key, arr);
  }
  const sections = Array.from(grouped.entries()).sort(([a], [b]) =>
    a < b ? 1 : -1,
  );

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 48 }}>
      {sections.map(([bucket, items]) => (
        <View key={bucket}>
          <Text
            className="my-2 text-xs font-bold"
            style={{ color: colors.textMuted }}
          >
            {dayLabel(bucket, locale, today)}
          </Text>
          <View
            style={{
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.elevated,
            }}
          >
            {items.map((log, idx) => (
              <LogRow
                key={log.id ?? idx}
                log={{
                  quantity: log.quantity,
                  xp_earned: log.xpEarned,
                  completed_at: log.completedAt,
                  note: log.note,
                }}
                deedTitle={titleFor(deed, locale)}
                locale={locale}
              />
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

export default HistoryTab;
