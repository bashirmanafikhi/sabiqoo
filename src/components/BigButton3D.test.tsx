import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { BigButton3D } from './BigButton3D';

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