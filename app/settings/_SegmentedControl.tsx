import { Pressable, Text, View } from 'react-native';
import { useColors } from '@/theme/tokens';

export interface SegmentedControlProps<T extends string> {
  value: T;
  options: ReadonlyArray<{ value: T; label: string }>;
  onChange: (next: T) => void;
}

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
}: SegmentedControlProps<T>) {
  const colors = useColors();
  return (
    <View
      style={{
        flexDirection: 'row',
        padding: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.elevated,
      }}
    >
      {options.map(opt => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(opt.value)}
            style={{
              flex: 1,
              paddingVertical: 10,
              alignItems: 'center',
              backgroundColor: active ? colors.brand : colors.elevated,
              borderRadius: 10,
              marginHorizontal: 4,
              borderWidth: 1,
              borderColor: active ? colors.ink : colors.border,
            }}
          >
            <Text
              className="text-sm font-bold"
              style={{ color: active ? colors.paper : colors.textPrimary }}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
