import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useColors } from '@/theme/tokens';

export interface ReferenceCardProps {
  reference: {
    type: 'quran' | 'hadith' | 'athkar';
    text_ar: string;
    text_en?: string;
    source: string;
    narrator?: string;
    lesson_ar?: string;
    lesson_en?: string;
  };
  locale: 'ar' | 'en';
}

const TYPE_KEYS = {
  quran: 'deed.reference.quran',
  hadith: 'deed.reference.hadith',
  athkar: 'deed.reference.athkar',
} as const;

export function ReferenceCard({ reference, locale }: ReferenceCardProps) {
  const colors = useColors();
  const { t } = useTranslation();
  const typeLabel = t(TYPE_KEYS[reference.type]);
  const lesson =
    locale === 'ar' ? reference.lesson_ar : reference.lesson_en;

  return (
    <View
      style={{
        backgroundColor: colors.elevated,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: colors.border,
        padding: 14,
      }}
    >
      <View
        style={{
          marginBottom: 8,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 999,
            backgroundColor: colors.brand,
            borderWidth: 1.5,
            borderColor: colors.ink,
            marginEnd: 8,
          }}
        >
          <Text
            className="text-xs font-bold"
            style={{ color: colors.paper }}
          >
            {typeLabel}
          </Text>
        </View>
        <Text
          className="flex-1 text-xs"
          style={{ color: colors.textMuted }}
          numberOfLines={1}
        >
          {reference.source}
        </Text>
      </View>
      <Text
        className="text-base"
        style={{
          color: colors.textPrimary,
          textAlign: 'right',
          writingDirection: 'rtl',
        }}
      >
        {reference.text_ar}
      </Text>
      {reference.narrator ? (
        <Text
          className="mt-1 text-xs italic"
          style={{ color: colors.textMuted }}
        >
          {reference.narrator}
        </Text>
      ) : null}
      {reference.text_en ? (
        <Text
          className="mt-2 text-sm"
          style={{ color: colors.textPrimary }}
        >
          {reference.text_en}
        </Text>
      ) : null}
      {lesson ? (
        <Text
          className="mt-2 text-sm italic"
          style={{ color: colors.textMuted }}
        >
          {t('deed.reference.lesson')} {lesson}
        </Text>
      ) : null}
    </View>
  );
}

export default ReferenceCard;