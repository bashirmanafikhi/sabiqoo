import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { AppBottomNav } from './AppBottomNav';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: { getItem: jest.fn().mockResolvedValue(null), setItem: jest.fn().mockResolvedValue(undefined), removeItem: jest.fn().mockResolvedValue(undefined) },
}));
jest.mock('react-i18next', () => ({
  useTranslation: () => {
    const dict: Record<string, string> = {
      'home.title': 'Roadmap',
      'catalog.title': 'Catalog',
      'history.title': 'History',
    };
    return { t: (k: string) => dict[k] ?? k, i18n: { language: 'en' } };
  },
}));
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

const wrap = (c: React.ReactNode) => React.createElement(ThemeProvider, null, c);

describe('AppBottomNav', () => {
  it('renders 3 tabs', () => {
    const { getByText } = render(wrap(<AppBottomNav active="roadmap" onChange={() => {}} />));
    expect(getByText('Roadmap')).toBeTruthy();
    expect(getByText('Catalog')).toBeTruthy();
    expect(getByText('History')).toBeTruthy();
  });

  it('fires onChange with new tab', () => {
    const fn = jest.fn();
    const { getByText } = render(wrap(<AppBottomNav active="roadmap" onChange={fn} />));
    fireEvent.press(getByText('Catalog'));
    expect(fn).toHaveBeenCalledWith('catalog');
  });
});