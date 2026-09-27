import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { Bilingual } from './Bilingual';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: { getItem: jest.fn().mockResolvedValue(null), setItem: jest.fn().mockResolvedValue(undefined), removeItem: jest.fn().mockResolvedValue(undefined) },
}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: 'en' } }),
}));
jest.mock('@/i18n/LocaleProvider', () => ({
  useLocale: () => ({ locale: 'en', isRTL: false, setLocale: async () => {}, ready: true }),
}));

const wrap = (c: React.ReactNode) => React.createElement(ThemeProvider, null, c);

describe('Bilingual', () => {
  it('renders primary and secondary when both provided', () => {
    const { getByText } = render(wrap(<Bilingual primary="Smiles" secondary="تبسم وكلمة طيبة" />));
    expect(getByText('Smiles')).toBeTruthy();
    expect(getByText('تبسم وكلمة طيبة')).toBeTruthy();
  });

  it('omits secondary when null', () => {
    const { queryByText, getByText } = render(wrap(<Bilingual primary="Smiles" secondary={null} />));
    expect(getByText('Smiles')).toBeTruthy();
    expect(queryByText(/تبسم/)).toBeNull();
  });

  it('uses dir=auto on Arabic fragment', () => {
    const { getByText } = render(wrap(<Bilingual primary="Smiles" secondary="تبسم" />));
    expect(getByText('تبسم').props.dir).toBe('auto');
  });
});
