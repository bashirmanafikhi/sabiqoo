import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';

export type HudPillVariant = 'coral' | 'gold' | 'navy' | 'outline';

export interface HudPillProps {
  variant: HudPillVariant;
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const PALETTE = {
  coral:   { bg: '#EA5455', fg: '#FFFFFF', stroke: 'transparent' },
  gold:    { bg: '#FFD46033', fg: '#1D2B3D', stroke: '#FFD46066' },
  navy:    { bg: '#2D4059',  fg: '#FFFFFF', stroke: 'transparent' },
  outline: { bg: '#DCE9FF', fg: '#1D2B3D', stroke: '#E1BFBC' },
} as const;

export function HudPill({ variant, icon, label, onPress, style, testID }: HudPillProps) {
  const pal = PALETTE[variant];
  const inner = (
    <View testID={testID} style={{
      flexDirection: 'row', alignItems: 'center', gap: 4,
      height: 36, paddingHorizontal: 12, borderRadius: 999,
      backgroundColor: pal.bg, borderWidth: 1, borderColor: pal.stroke,
      ...(style as object),
    }}>
      {icon}
      <Text className="font-label-md text-label-md uppercase" style={{ color: pal.fg, fontWeight: '800' }}>
        {label}
      </Text>
    </View>
  );
  if (!onPress) return inner;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress}>
      {inner}
    </Pressable>
  );
}

export default HudPill;
