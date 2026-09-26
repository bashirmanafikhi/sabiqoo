import { Pressable, View, Text, type AccessibilityState } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/theme/tokens';
import * as haptics from '@/utils/haptics';
import { ProgressBadge } from './ProgressBadge';

export interface CategoryCardProps {
  category: {
    id: number;
    name_ar: string;
    name_en: string;
    color_code: string;
    icon_name: string;
  };
  done: number;
  total: number;
  isActive: boolean;
  onPress: () => void;
}

const FeatherIcon = Feather as unknown as React.ComponentType<{
  name: string;
  size?: number;
  color?: string;
}>;

export function CategoryCard({
  category,
  done,
  total,
  isActive,
  onPress,
}: CategoryCardProps) {
  const colors = useColors();
  const handlePress = () => {
    haptics.selection();
    onPress();
  };
  const completed = done === total && total > 0;
  const a11yState: AccessibilityState = { selected: isActive };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={category.name_en}
      accessibilityState={a11yState}
      onPress={handlePress}
      style={{
        borderRadius: 16,
        backgroundColor: colors.elevated,
        borderWidth: 2,
        borderColor: isActive ? colors.brand : colors.border,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          height: 8,
          backgroundColor: category.color_code,
        }}
      />
      <View style={{ padding: 16 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: `${category.color_code}22`,
                alignItems: 'center',
                justifyContent: 'center',
                marginEnd: 12,
              }}
            >
              <FeatherIcon
                name={category.icon_name}
                size={22}
                color={category.color_code}
              />
            </View>
            <Text
              className="flex-1 text-base font-bold"
              style={{ color: colors.textPrimary }}
              numberOfLines={2}
            >
              {category.name_en}
            </Text>
          </View>
          <ProgressBadge done={done} total={total} />
        </View>
        {completed ? (
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              bottom: 8,
              end: 8,
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: colors.gold,
              borderWidth: 2,
              borderColor: colors.ink,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FeatherIcon name="award" size={14} color={colors.ink} />
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

export default CategoryCard;