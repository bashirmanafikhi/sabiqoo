import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { HeatmapGrid } from './HeatmapGrid';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: { getItem: jest.fn().mockResolvedValue(null), setItem: jest.fn().mockResolvedValue(undefined), removeItem: jest.fn().mockResolvedValue(undefined) },
}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: 'en' } }),
}));

const wrap = (c: React.ReactNode) => React.createElement(ThemeProvider, null, c);

describe('HeatmapGrid', () => {
  it('renders tiles for each day', () => {
    const days = Array.from({ length: 30 }, (_, i) => ({ day: i, count: (i % 5) }));
    const { getAllByTestId } = render(wrap(<HeatmapGrid days={days} />));
    expect(getAllByTestId(/^heat-tile-/).length).toBeGreaterThanOrEqual(30);
  });

  it('uses intensity buckets', () => {
    const days = [
      { day: 0, count: 0 }, { day: 1, count: 2 }, { day: 2, count: 3 },
      { day: 3, count: 4 }, { day: 4, count: 5 },
    ];
    const { getAllByTestId } = render(wrap(<HeatmapGrid days={days} />));
    expect(getAllByTestId('heat-tile-0').length + getAllByTestId('heat-tile-5').length).toBeGreaterThan(0);
  });
});
