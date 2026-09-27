import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { Button3D } from './Button3D';

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

describe('Button3D', () => {
  it('renders label', () => {
    const { getByText } = render(
      wrap(<Button3D label="Mark Done" onPress={() => {}} variant="coral" />),
    );
    expect(getByText('Mark Done')).toBeTruthy();
  });

  it('fires onPress when pressed', () => {
    const fn = jest.fn();
    const { getByRole } = render(
      wrap(<Button3D label="Go" onPress={fn} variant="coral" />),
    );
    fireEvent.press(getByRole('button'));
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('does not fire when disabled', () => {
    const fn = jest.fn();
    const { getByRole } = render(
      wrap(<Button3D label="x" onPress={fn} variant="coral" disabled />),
    );
    fireEvent.press(getByRole('button'));
    expect(fn).not.toHaveBeenCalled();
  });

  it('hides label while loading', () => {
    const { queryByText } = render(
      wrap(<Button3D label="Save" onPress={() => {}} variant="coral" loading />),
    );
    expect(queryByText('Save')).toBeNull();
  });
});
