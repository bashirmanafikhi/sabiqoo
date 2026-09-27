import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { AppTopBar } from './AppTopBar';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: { getItem: jest.fn().mockResolvedValue(null), setItem: jest.fn().mockResolvedValue(undefined), removeItem: jest.fn().mockResolvedValue(undefined) },
}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: 'en' } }),
}));
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

const wrap = (c: React.ReactNode) => React.createElement(ThemeProvider, null, c);

describe('AppTopBar', () => {
  it('shows streak, xp, saved', () => {
    const { getByText } = render(wrap(
      <AppTopBar streakDays={7} xp={340} savedCount={4}
        onSettings={() => {}} onToggleLocale={() => {}} onAvatar={() => {}} />
    ));
    expect(getByText('7d')).toBeTruthy();
    expect(getByText('340 XP')).toBeTruthy();
    expect(getByText('4')).toBeTruthy();
  });

  it('fires settings on press', () => {
    const fn = jest.fn();
    const { getByLabelText } = render(wrap(
      <AppTopBar streakDays={7} xp={340} savedCount={4}
        onSettings={fn} onToggleLocale={() => {}} onAvatar={() => {}} />
    ));
    fireEvent.press(getByLabelText('settings'));
    expect(fn).toHaveBeenCalled();
  });
});
