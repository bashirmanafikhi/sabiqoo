import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { QuantityStepper } from './QuantityStepper';

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