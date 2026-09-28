import { useCallback } from 'react';
import {
  Pressable,
  Text,
  View,
  type AccessibilityState,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/theme/tokens';
import * as haptics from '@/utils/haptics';

export interface QuantityStepperProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  testID?: string;
}

const BUTTON_SIZE = 64;

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 50,
  testID,
}: QuantityStepperProps) {
  const colors = useColors();

  const dec = useCallback(() => {
    if (value > min) {
      haptics.selection();
      onChange(value - 1);
    }
  }, [value, min, onChange]);

  const inc = useCallback(() => {
    if (value < max) {
      haptics.selection();
      onChange(value + 1);
    }
  }, [value, max, onChange]);

  const canDec = value > min;
  const canInc = value < max;

  return (
    <View
      accessibilityRole="adjustable"
      accessibilityValue={{ min, max, now: value }}
      accessibilityLabel={`quantity ${value}`}
      accessible
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      testID={testID}
    >
      <StepperButton
        key="dec"
        onPress={dec}
        disabled={!canDec}
        iconName="remove"
        a11yLabel="decrement"
        testID={testID ? `${testID}-dec` : undefined}
      />
      <View
        style={{
          marginHorizontal: 12,
          minWidth: 48,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          className="text-2xl font-bold"
          style={{ color: colors.textPrimary }}
          testID={testID ? `${testID}-value` : undefined}
        >
          {value}
        </Text>
      </View>
      <StepperButton
        key="inc"
        onPress={inc}
        disabled={!canInc}
        iconName="add"
        a11yLabel="increment"
        testID={testID ? `${testID}-inc` : undefined}
      />
    </View>
  );
}

interface StepperButtonProps {
  onPress: () => void;
  disabled: boolean;
  iconName: 'remove' | 'add';
  a11yLabel: string;
  testID?: string;
}

function StepperButton({
  onPress,
  disabled,
  iconName,
  a11yLabel,
  testID,
}: StepperButtonProps) {
  const colors = useColors();
  const a11yState: AccessibilityState = { disabled };
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      accessibilityState={a11yState}
      disabled={disabled}
      onPress={onPress}
      testID={testID}
      style={{
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: disabled ? colors.border : colors.navyDark,
        backgroundColor: disabled ? colors.surface : colors.surfaceLowest,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Ionicons
        name={iconName}
        size={28}
        color={disabled ? colors.textMuted : colors.textPrimary}
      />
    </Pressable>
  );
}

export default QuantityStepper;