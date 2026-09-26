import { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { BigButton3D } from '@/components/BigButton3D';
import { QuantityStepper } from '@/components/QuantityStepper';
import { useColors } from '@/theme/tokens';
import {
  categoryName,
  titleFor,
  type Locale,
} from './_helpers';
import type { Category, Deed } from '@/db/schema';

export interface TodayTabProps {
  deed: Deed;
  category: Category | null;
  predictedXp: number;
  onComplete: () => Promise<void> | void;
  busy: boolean;
  locale: Locale;
}

const FeatherIcon = Feather as unknown as React.ComponentType<{
  name: string;
  size?: number;
  color?: string;
}>;

export function TodayTab({
  deed,
  category,
  predictedXp,
  onComplete,
  busy,
  locale,
}: TodayTabProps) {
  const colors = useColors();
  const { t } = useTranslation();
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState('');

  const handlePress = useCallback(() => {
    onComplete();
  }, [onComplete]);

  return (
    <ScrollView
      contentContainerStyle={{ padding: 16, paddingBottom: 48 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ alignItems: 'center', marginTop: 12 }}>
        <View
          style={{
            width: 96,
            height: 96,
            borderRadius: 48,
            backgroundColor: (category?.colorCode ?? colors.brand) + '22',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: category?.colorCode ?? colors.brand,
          }}
        >
          <FeatherIcon
            name={category?.iconName ?? 'star'}
            size={44}
            color={category?.colorCode ?? colors.brand}
          />
        </View>
        <Text
          className="mt-4 text-center text-xl font-bold"
          style={{ color: colors.textPrimary }}
        >
          {titleFor(deed, locale)}
        </Text>
        {category ? (
          <View
            style={{
              marginTop: 8,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 999,
              backgroundColor: category.colorCode + '22',
              borderWidth: 1,
              borderColor: category.colorCode,
            }}
          >
            <Text
              className="text-xs font-bold"
              style={{ color: colors.textPrimary }}
            >
              {categoryName(category, locale)}
            </Text>
          </View>
        ) : null}
        <Text className="mt-2 text-base" style={{ color: colors.brand }}>
          +{deed.xpReward} XP
        </Text>
      </View>

      <View style={{ marginTop: 28 }}>
        <QuantityStepper value={qty} onChange={setQty} />
      </View>

      <View style={{ marginTop: 16 }}>
        <TextInput
          multiline
          placeholder={t('deed.notePlaceholder')}
          placeholderTextColor={colors.textMuted}
          value={note}
          onChangeText={setNote}
          accessibilityLabel={t('deed.notePlaceholder')}
          accessibilityHint={t('deed.noteHint')}
          style={{
            minHeight: 80,
            padding: 12,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: colors.border,
            backgroundColor: colors.elevated,
            color: colors.textPrimary,
            textAlignVertical: 'top',
          }}
        />
      </View>

      <View style={{ marginTop: 20 }}>
        <BigButton3D
          label={t('deed.markCompleted', { xp: predictedXp })}
          onPress={handlePress}
          loading={busy}
        />
      </View>
    </ScrollView>
  );
}

export default TodayTab;
