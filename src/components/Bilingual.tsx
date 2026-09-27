import { Text, View } from 'react-native';
import { useColors } from '@/theme/tokens';
import { useLocale } from '@/i18n/LocaleProvider';

export interface BilingualProps {
  primary: string;
  secondary?: string | null;
  className?: string;
  testID?: string;
}

export function Bilingual({ primary, secondary, className, testID }: BilingualProps) {
  const colors = useColors();
  const { locale } = useLocale();
  const headingFont = locale === 'ar' ? 'font-arabic' : 'font-headline';
  return (
    <View testID={testID} className={className}>
      <Text className={`${headingFont} text-headline-md`} style={{ color: colors.text }}>{primary}</Text>
      {secondary ? (
        <Text
          className="font-arabic text-body-md"
          style={{ color: colors.textMuted, marginTop: 2 }}
          dir="auto"
        >
          {secondary}
        </Text>
      ) : null}
    </View>
  );
}

export default Bilingual;
