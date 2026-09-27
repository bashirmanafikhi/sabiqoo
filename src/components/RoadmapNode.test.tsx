import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { RoadmapNode } from './RoadmapNode';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: { getItem: jest.fn().mockResolvedValue(null), setItem: jest.fn().mockResolvedValue(undefined), removeItem: jest.fn().mockResolvedValue(undefined) },
}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: 'en' } }),
}));

const wrap = (c: React.ReactNode) => React.createElement(ThemeProvider, null, c);

describe('RoadmapNode', () => {
  it.each(['mastered','completed','available','locked','skipped'] as const)(
    'renders %s state', (state) => {
      const { getByTestId } = render(wrap(
        <RoadmapNode state={state} label="Smile" xp={15} testID={`node-${state}`} />
      ));
      expect(getByTestId(`node-${state}-circle`)).toBeTruthy();
    });
});