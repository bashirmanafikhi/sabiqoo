import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { SegmentedControl } from './SegmentedControl';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: { getItem: jest.fn().mockResolvedValue(null), setItem: jest.fn().mockResolvedValue(undefined), removeItem: jest.fn().mockResolvedValue(undefined) },
}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: 'en' } }),
}));

const wrap = (c: React.ReactNode) => React.createElement(ThemeProvider, null, c);

describe('SegmentedControl', () => {
  it('renders all labels', () => {
    const { getByText } = render(wrap(
      <SegmentedControl<'a'|'b'|'c'> value="a" onChange={() => {}}
        options={[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }, { value: 'c', label: 'C' }]} />
    ));
    expect(getByText('A')).toBeTruthy();
    expect(getByText('B')).toBeTruthy();
    expect(getByText('C')).toBeTruthy();
  });

  it('fires onChange', () => {
    const fn = jest.fn();
    const { getByText } = render(wrap(
      <SegmentedControl<'a'|'b'> value="a" onChange={fn}
        options={[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]} />
    ));
    fireEvent.press(getByText('B'));
    expect(fn).toHaveBeenCalledWith('b');
  });
});