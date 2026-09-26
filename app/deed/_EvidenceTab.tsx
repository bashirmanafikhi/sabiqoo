import { ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ReferenceCard } from '@/components/ReferenceCard';
import { useColors } from '@/theme/tokens';
import type { DeedReference } from '@/db/schema';
import type { Locale } from './_helpers';

export interface EvidenceTabProps {
  refs: DeedReference[];
  locale: Locale;
}

export function EvidenceTab({ refs, locale }: EvidenceTabProps) {
  const colors = useColors();
  const { t } = useTranslation();

  if (refs.length === 0) {
    return (
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 48 }}>
        <Text
          className="text-base"
          style={{
            color: colors.textMuted,
            textAlign: 'center',
            marginTop: 24,
          }}
        >
          {t('deed.reference.empty')}
        </Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 48 }}>
      <View style={{ gap: 12 }}>
        {refs.map((r, idx) => (
          <ReferenceCard
            key={r.id ?? idx}
            reference={{
              type: (r.type === 'quran' ||
              r.type === 'hadith' ||
              r.type === 'athkar'
                ? r.type
                : 'hadith') as 'quran' | 'hadith' | 'athkar',
              text_ar: r.textAr,
              text_en: r.textEn ?? undefined,
              source: r.source,
              narrator: r.narrator ?? undefined,
              lesson_ar: r.lessonAr ?? undefined,
              lesson_en: r.lessonEn ?? undefined,
            }}
            locale={locale}
          />
        ))}
      </View>
    </ScrollView>
  );
}

export default EvidenceTab;
