import { Pressable, Text, View } from 'react-native';
import { useColors } from '@/theme/tokens';

export interface SegmentedControlProps<T extends string> {
  value: T;
  onChange: (next: T) => void;
  options: ReadonlyArray<{ value: T; label: string; leadingIcon?: React.ReactNode }>;
}

export function SegmentedControl<T extends string>({ value, onChange, options }: SegmentedControlProps<T>) {
  const colors = useColors();
  return (
    <View className="p-1 rounded-2xl flex-row gap-1"
      style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}>
      {options.map(opt => {
        const active = opt.value === value;
        return (
          <Pressable key={opt.value}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(opt.value)}
            testID={`seg-${opt.value}`}
            className="flex-1 py-2 px-3 rounded-xl items-center justify-center flex-row gap-1.5"
            style={{ backgroundColor: active ? '#EA5455' : 'transparent', shadowOpacity: active ? 0.1 : 0 }}>
            {opt.leadingIcon}
            <Text className="font-label-md text-label-md uppercase"
              style={{ color: active ? '#FFFFFF' : colors.text, fontWeight: '800' }}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default SegmentedControl;