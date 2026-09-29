import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/theme/tokens';

export interface EvidenceTabProps {
  sourceTitle: string;
  sourceCollection: string;
  authenticityLabel: string;
  arabicText: string;
  englishTranslation: string;
  lessonTitle: string;
  lessonBody: string;
  secondarySource?: string;
  secondaryText?: string;
  calloutText?: string;
}

export function EvidenceTab({
  sourceTitle, sourceCollection, authenticityLabel,
  arabicText, englishTranslation,
  lessonTitle, lessonBody, secondarySource, secondaryText, calloutText,
}: EvidenceTabProps) {
  const colors = useColors();
  return (
    <View className="gap-4 px-gutter pt-3">
      <View className="rounded-2xl p-5 gap-4"
        style={{ backgroundColor: colors.surfaceLowest, borderWidth: 1, borderColor: colors.border }}>
        <View className="flex-row items-center justify-between pb-2 border-b" style={{ borderColor: colors.border }}>
          <View className="flex-row items-center gap-2">
            <View className="w-8 h-8 rounded-full items-center justify-center" style={{ backgroundColor: '#1D2B3D' }}>
              <Ionicons name="checkmark" size={18} color="#FFD460" />
            </View>
            <View>
              <Text className="font-headline text-label-md" style={{ color: '#1D2B3D', fontWeight: '800' }}>{sourceTitle}</Text>
              <Text className="font-body text-xs" style={{ color: '#5B6E85' }}>{sourceCollection}</Text>
            </View>
          </View>
          <Text className="px-2.5 py-0.5 rounded-full"
            style={{ backgroundColor: '#FFD46033', borderWidth: 1, borderColor: '#FFD46080' }}>
            <Text className="font-headline text-xs" style={{ color: '#1D2B3D', fontWeight: '800' }}>{authenticityLabel}</Text>
          </Text>
        </View>

        <View className="p-4 rounded-xl"
          style={{ backgroundColor: colors.surfaceLow, borderWidth: 1, borderColor: colors.border }}>
          <Text className="font-arabic text-headline-sm text-right leading-9"
            style={{ color: '#1D2B3D', fontWeight: '700' }} dir="rtl">{arabicText}</Text>
        </View>

        <View className="gap-1">
          <Text className="font-headline text-xs uppercase"
            style={{ color: '#F07B3F', fontWeight: '800' }}>Translation</Text>
          <Text className="font-body text-body-md leading-6" style={{ color: '#1D2B3D' }}>
            {englishTranslation}
          </Text>
        </View>

        <View className="p-3.5 rounded-xl flex-row gap-3 items-start"
          style={{ backgroundColor: colors.surfaceLow, borderWidth: 1, borderColor: colors.border }}>
          <Ionicons name="bulb" size={22} color="#F07B3F" style={{ marginTop: 2 }} />
          <View className="flex-1 gap-0.5">
            <Text className="font-headline text-xs" style={{ color: '#1D2B3D', fontWeight: '800' }}>{lessonTitle}</Text>
            <Text className="font-body text-body-sm leading-5" style={{ color: '#5B6E85' }}>{lessonBody}</Text>
          </View>
        </View>
      </View>

      {secondarySource ? (
        <View className="rounded-2xl p-4 gap-1.5"
          style={{ backgroundColor: colors.surfaceLowest, borderWidth: 1, borderColor: colors.border }}>
          <View className="flex-row items-center gap-2">
            <Ionicons name="book" size={18} color="#EA5455" />
            <Text className="font-headline text-xs" style={{ color: '#1D2B3D', fontWeight: '800' }}>{secondarySource}</Text>
          </View>
          <Text className="font-body text-body-sm" style={{ color: '#5B6E85' }}>{secondaryText}</Text>
        </View>
      ) : null}

      {calloutText ? (
        <View className="rounded-2xl p-4 flex-row items-center gap-3"
          style={{ backgroundColor: '#F07B3F' }}>
          <View className="w-11 h-11 rounded-xl items-center justify-center"
            style={{ backgroundColor: '#FFFFFF33' }}>
            <Ionicons name="heart" size={22} color="#FFFFFF" />
          </View>
          <Text className="font-body text-body-sm font-semibold leading-5 flex-1" style={{ color: '#FFFFFF' }}>
            {calloutText}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

export default EvidenceTab;