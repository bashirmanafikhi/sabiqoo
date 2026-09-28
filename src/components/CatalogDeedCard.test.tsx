import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { CatalogDeedCard } from './CatalogDeedCard';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: { getItem: jest.fn().mockResolvedValue(null), setItem: jest.fn().mockResolvedValue(undefined), removeItem: jest.fn().mockResolvedValue(undefined) },
}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: 'en' } }),
}));

const wrap = (c: React.ReactNode) => React.createElement(ThemeProvider, null, c);

describe('CatalogDeedCard', () => {
  it('renders mastered card', () => {
    const { getByText } = render(wrap(
      <CatalogDeedCard title="Smile" titleAr="تبسم" status="mastered"
        statusLabel="Mastered (12x)" xp="+10 XP • Easy" onBookmark={() => {}} />
    ));
    expect(getByText('Smile')).toBeTruthy();
    expect(getByText('تبسم')).toBeTruthy();
  });

  it('renders locked card', () => {
    const { getByText } = render(wrap(
      <CatalogDeedCard title="Plant" status="locked" statusLabel="Unlocks at Lvl 5" xp="+40 XP" />
    ));
    expect(getByText('Plant')).toBeTruthy();
  });
});
