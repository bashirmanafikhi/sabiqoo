import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { Toast } from './Toast';

const wrap = (c: React.ReactNode) => React.createElement(ThemeProvider, null, c);

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: { getItem: jest.fn().mockResolvedValue(null), setItem: jest.fn().mockResolvedValue(undefined), removeItem: jest.fn().mockResolvedValue(undefined) },
}));

describe('Toast', () => {
  it('renders message when visible', () => {
    const { getByText } = render(wrap(<Toast visible message="Saved" onHide={() => {}} />));
    expect(getByText('Saved')).toBeTruthy();
  });
});
