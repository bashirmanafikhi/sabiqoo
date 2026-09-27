import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { HudPill } from './HudPill';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: { getItem: jest.fn().mockResolvedValue(null), setItem: jest.fn().mockResolvedValue(undefined), removeItem: jest.fn().mockResolvedValue(undefined) },
}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: 'en' } }),
}));

const wrap = (c: React.ReactNode) => React.createElement(ThemeProvider, null, c);

describe('HudPill', () => {
  it('renders label', () => {
    const { getByText } = render(wrap(<HudPill variant="coral" icon={<></>} label="7d" />));
    expect(getByText('7d')).toBeTruthy();
  });
  it('exposes button role when onPress provided', () => {
    const { getByRole } = render(wrap(<HudPill variant="gold" icon={<></>} label="340 XP" onPress={() => {}} />));
    expect(getByRole('button')).toBeTruthy();
  });
});
