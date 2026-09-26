import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { BigButton3D } from '@/components/BigButton3D';
import { QuantityStepper } from '@/components/QuantityStepper';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn().mockResolvedValue(null),
    setItem: jest.fn().mockResolvedValue(undefined),
    removeItem: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('expo-haptics', () => ({
  __esModule: true,
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
  },
  impactAsync: jest.fn().mockResolvedValue(undefined),
  notificationAsync: jest.fn().mockResolvedValue(undefined),
  selectionAsync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string) => k,
    i18n: { language: 'en' },
  }),
}));

const wrap = (children: React.ReactNode): React.ReactElement =>
  React.createElement(ThemeProvider, null, children);

describe('BigButton3D', () => {
  test('renders the label', () => {
    const { getByText } = render(
      wrap(<BigButton3D label="Tap me" onPress={() => {}} />),
    );
    expect(getByText('Tap me')).toBeTruthy();
  });

  test('exposes role="button" with label fallback', () => {
    const { getByRole } = render(
      wrap(<BigButton3D label="Tap me" onPress={() => {}} />),
    );
    const btn = getByRole('button');
    expect(btn.props.accessibilityRole).toBe('button');
    expect(btn.props.accessibilityLabel).toBe('Tap me');
  });

  test('uses accessibilityLabel prop when provided', () => {
    const { getByRole } = render(
      wrap(
        <BigButton3D
          label="Mark"
          onPress={() => {}}
          accessibilityLabel="Mark as Completed"
        />,
      ),
    );
    expect(getByRole('button').props.accessibilityLabel).toBe(
      'Mark as Completed',
    );
  });

  test('fires onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      wrap(<BigButton3D label="Go" onPress={onPress} />),
    );
    fireEvent.press(getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('does not fire onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      wrap(<BigButton3D label="Go" onPress={onPress} disabled />),
    );
    fireEvent.press(getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  test('does not fire onPress when loading', () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      wrap(<BigButton3D label="Save" onPress={onPress} loading />),
    );
    fireEvent.press(getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  test('shows ActivityIndicator and hides label when loading', () => {
    const { queryByText } = render(
      wrap(<BigButton3D label="Save" onPress={() => {}} loading />),
    );
    expect(queryByText('Save')).toBeNull();
  });

  test('accessibilityState.busy=true when loading', () => {
    const { getByRole } = render(
      wrap(<BigButton3D label="Save" onPress={() => {}} loading />),
    );
    expect(getByRole('button').props.accessibilityState.busy).toBe(true);
  });

  test('accessibilityState.disabled=true when disabled', () => {
    const { getByRole } = render(
      wrap(<BigButton3D label="Save" onPress={() => {}} disabled />),
    );
    expect(getByRole('button').props.accessibilityState.disabled).toBe(true);
  });
});

describe('QuantityStepper', () => {
  test('exposes role="adjustable" with value/min/max', () => {
    const { getByRole } = render(
      wrap(<QuantityStepper value={5} onChange={() => {}} min={1} max={50} />),
    );
    const adj = getByRole('adjustable');
    expect(adj.props.accessibilityValue).toEqual({
      min: 1,
      max: 50,
      now: 5,
    });
  });

  test('uses default min=1, max=50', () => {
    const { getByRole } = render(
      wrap(<QuantityStepper value={5} onChange={() => {}} />),
    );
    expect(getByRole('adjustable').props.accessibilityValue).toEqual({
      min: 1,
      max: 50,
      now: 5,
    });
  });

  test('+ button increments value', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      wrap(<QuantityStepper value={5} onChange={onChange} testID="qty" />),
    );
    fireEvent.press(getByTestId('qty-inc'));
    expect(onChange).toHaveBeenCalledWith(6);
  });

  test('- button decrements value', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      wrap(<QuantityStepper value={5} onChange={onChange} testID="qty" />),
    );
    fireEvent.press(getByTestId('qty-dec'));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  test('- button does nothing at min', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      wrap(<QuantityStepper value={1} onChange={onChange} testID="qty" />),
    );
    fireEvent.press(getByTestId('qty-dec'));
    expect(onChange).not.toHaveBeenCalled();
  });

  test('+ button does nothing at max', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      wrap(<QuantityStepper value={50} onChange={onChange} testID="qty" />),
    );
    fireEvent.press(getByTestId('qty-inc'));
    expect(onChange).not.toHaveBeenCalled();
  });

  test('- button is disabled at min', () => {
    const { getByTestId } = render(
      wrap(<QuantityStepper value={1} onChange={() => {}} testID="qty" />),
    );
    expect(getByTestId('qty-dec').props.accessibilityState.disabled).toBe(
      true,
    );
  });

  test('+ button is disabled at max', () => {
    const { getByTestId } = render(
      wrap(<QuantityStepper value={50} onChange={() => {}} testID="qty" />),
    );
    expect(getByTestId('qty-inc').props.accessibilityState.disabled).toBe(
      true,
    );
  });

  test('displays current value', () => {
    const { getByTestId } = render(
      wrap(<QuantityStepper value={7} onChange={() => {}} testID="qty" />),
    );
    const valueText = getByTestId('qty-value');
    expect(valueText.props.children).toBe(7);
  });
});