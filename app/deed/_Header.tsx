import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { HeartButton } from '@/components/HeartButton';
import { SkipToggle } from '@/components/SkipToggle';
import { useColors } from '@/theme/tokens';
import { titleFor, type Locale } from './_helpers';
import type { Deed } from '@/db/schema';

export interface DeedHeaderProps {
  deed: Deed;
  bookmarked: boolean;
  skipped: boolean;
  onBack: () => void;
  onToggleBookmark: () => void;
  onToggleSkip: () => void;
  locale: Locale;
}

export function DeedHeader({
  deed,
  bookmarked,
  skipped,
  onBack,
  onToggleBookmark,
  onToggleSkip,
  locale,
}: DeedHeaderProps) {
  const colors = useColors();
  const { t } = useTranslation();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: colors.bg,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('common.close')}
        onPress={onBack}
        hitSlop={8}
        style={{ paddingHorizontal: 4 }}
      >
        <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
      </Pressable>
      <Text
        className="flex-1 text-base font-bold"
        style={{ color: colors.textPrimary, marginStart: 8 }}
        numberOfLines={1}
      >
        {titleFor(deed, locale)}
      </Text>
      <HeartButton
        deedId={deed.id}
        isFilled={bookmarked}
        onToggle={onToggleBookmark}
      />
      <SkipToggle
        deedId={deed.id}
        active={skipped}
        onToggle={onToggleSkip}
      />
    </View>
  );
}

export type TabKey = 'today' | 'evidence' | 'history';

export interface DeedTabsProps {
  tab: TabKey;
  onChange: (next: TabKey) => void;
}

export function DeedTabs({ tab, onChange }: DeedTabsProps) {
  const colors = useColors();
  const { t } = useTranslation();
  return (
    <View
      style={{
        flexDirection: 'row',
        marginHorizontal: 16,
        marginTop: 12,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: colors.ink,
        backgroundColor: colors.elevated,
        overflow: 'hidden',
      }}
    >
      {(['today', 'evidence', 'history'] as TabKey[]).map(key => {
        const active = tab === key;
        return (
          <Pressable
            key={key}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(key)}
            style={{
              flex: 1,
              paddingVertical: 10,
              alignItems: 'center',
              backgroundColor: active ? colors.brand : colors.elevated,
            }}
          >
            <Text
              className="text-sm font-bold"
              style={{ color: active ? colors.paper : colors.textPrimary }}
            >
              {key === 'today'
                ? t('deed.tabs.today')
                : key === 'evidence'
                  ? t('deed.tabs.evidence')
                  : t('deed.tabs.history')}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default DeedHeader;
