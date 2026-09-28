import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/theme/tokens';

export type CatalogStatus = 'mastered' | 'completed' | 'available' | 'locked' | 'skipped';

export interface CatalogDeedCardProps {
  title: string;
  titleAr?: string;
  status: CatalogStatus;
  statusLabel: string;
  xp: string;
  onPress?: () => void;
  onBookmark?: () => void;
  onHide?: () => void;
}

const STRIPE = {
  mastered: '#EA5455', completed: '#F07B3F', available: '#FFD460',
  locked: '#E1BFBC', skipped: 'transparent',
} as const;

const PILL_BG = {
  mastered: '#EA545526', completed: '#F07B3F26', available: '#FFD46033',
  locked: '#D3E4FE', skipped: '#DCE9FF',
} as const;

const PILL_FG = {
  mastered: '#EA5455', completed: '#F07B3F', available: '#1D2B3D',
  locked: '#1D2B3DBB', skipped: '#5B6E85',
} as const;

export function CatalogDeedCard({ title, titleAr, status, statusLabel, xp, onPress, onBookmark, onHide }: CatalogDeedCardProps) {
  const colors = useColors();
  const locked = status === 'locked';
  const skipped = status === 'skipped';

  const stripe = (
    <View style={{
      width: 6, alignSelf: 'stretch',
      borderTopRightRadius: 12, borderBottomRightRadius: 12,
      backgroundColor: STRIPE[status],
    }} />
  );

  const inner = (
    <View className="flex-1 flex-row items-center justify-between p-space-sm"
      style={{ backgroundColor: skipped ? colors.surface : colors.surfaceLowest, opacity: locked ? 0.85 : 1 }}>
      <View className="flex-1 flex-row items-center gap-space-sm min-w-0">
        <View className="flex-1 min-w-0">
          <View className="flex-row items-center gap-2">
            <View className="px-1.5 py-0.5 rounded-full" style={{ backgroundColor: PILL_BG[status] }}>
              <Text className="font-label-sm text-label-sm" style={{ color: PILL_FG[status], fontWeight: '800' }}>{statusLabel}</Text>
            </View>
            <Text className="font-label-sm text-label-sm" style={{ color: colors.outline }}>{xp}</Text>
          </View>
          <Text className="font-body-lg text-body-lg mt-0.5" style={{ color: colors.text, fontWeight: '800' }} numberOfLines={1}>{title}</Text>
          {titleAr ? (
            <Text className="font-arabic text-body-sm" style={{ color: colors.textMuted }} dir="auto" numberOfLines={1}>{titleAr}</Text>
          ) : null}
        </View>
      </View>

      <View className="flex-row items-center gap-1">
        {skipped ? (
          <Pressable accessibilityRole="button" accessibilityLabel="restore" onPress={onPress}
            className="h-8 px-space-md rounded-full items-center justify-center"
            style={{ backgroundColor: '#D3E4FE' }}>
            <Text className="font-label-sm text-label-sm" style={{ color: '#EA5455', fontWeight: '800' }}>Restore</Text>
          </Pressable>
        ) : (
          <>
            <Pressable accessibilityRole="button" accessibilityLabel="bookmark" onPress={onBookmark}
              disabled={locked} hitSlop={8} className="w-9 h-9 rounded-full items-center justify-center">
              <Ionicons name="heart" size={22} color={locked ? '#5B6E8555' : '#EA5455'} />
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="hide" onPress={onHide}
              hitSlop={8} className="w-9 h-9 rounded-full items-center justify-center">
              <Ionicons name={locked ? 'lock-closed' : 'eye-outline'} size={20}
                color={locked ? '#5B6E8555' : '#5B6E85'} />
            </Pressable>
          </>
        )}
      </View>
    </View>
  );

  const card = (
    <View className="flex-row items-stretch rounded-xl overflow-hidden min-h-22"
      style={{ backgroundColor: colors.surfaceLowest, borderWidth: 1, borderColor: colors.border }}>
      {stripe}
      {inner}
    </View>
  );

  if (skipped) return card;
  return (
    <Pressable accessibilityRole="button" onPress={onPress} testID="catalog-deed-card">
      {card}
    </Pressable>
  );
}

export default CatalogDeedCard;
