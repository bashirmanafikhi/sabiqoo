import React from 'react';
import { Text } from 'react-native';
import { act, render } from '@testing-library/react-native';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn().mockResolvedValue(null),
    setItem: jest.fn().mockResolvedValue(undefined),
    removeItem: jest.fn().mockResolvedValue(undefined),
  },
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('expo-haptics', () => ({
  __esModule: true,
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
  NotificationFeedbackType: { Success: 'success', Warning: 'warning', Error: 'error' },
  impactAsync: jest.fn().mockResolvedValue(undefined),
  notificationAsync: jest.fn().mockResolvedValue(undefined),
  selectionAsync: jest.fn().mockResolvedValue(undefined),
}));

import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';
import {
  darkColors,
  lightColors,
  useColors,
} from '@/theme/tokens';
import * as Haptics from 'expo-haptics';
import * as haptics from '@/utils/haptics';

const wrap = (children: React.ReactNode): React.ReactElement =>
  React.createElement(ThemeProvider, null, children);

describe('theme tokens', () => {
  test('lightColors.bg and darkColors.bg are distinct locked hexes', () => {
    expect(lightColors.bg).toBe('#FFFFFF');
    expect(darkColors.bg).toBe('#0B1220');
    expect(lightColors.brand).toBe('#58CC02');
    expect(darkColors.brand).toBe('#58CC02');
  });
});

describe('ThemeProvider', () => {
  test('colors.bg resolves to light hex by default', async () => {
    let captured: ReturnType<typeof useColors> | null = null;
    const Probe = (): null => {
      captured = useColors();
      return null;
    };
    render(wrap(React.createElement(Probe)));
    await act(async () => {});
    expect(captured!.bg).toBe(lightColors.bg);
  });

  test('switching setMode to dark updates colors.bg', async () => {
    let themeApi: ReturnType<typeof useTheme> | null = null;
    const Probe = (): null => {
      themeApi = useTheme();
      return null;
    };
    render(wrap(React.createElement(Probe)));
    await act(async () => {
      themeApi!.setMode('dark');
    });
    expect(themeApi!.isDark).toBe(true);
    expect(themeApi!.colors.bg).toBe(darkColors.bg);
  });

  test('Provider renders children', () => {
    const { getByText } = render(
      wrap(React.createElement(Text, null, 'hello world')),
    );
    expect(getByText('hello world')).toBeTruthy();
  });

  test('rerender with new mode does not crash', async () => {
    let themeApi: ReturnType<typeof useTheme> | null = null;
    const Probe = (): null => {
      themeApi = useTheme();
      return null;
    };
    const { rerender } = render(wrap(React.createElement(Probe)));
    await act(async () => {
      themeApi!.setMode('dark');
    });
    expect(() => {
      rerender(wrap(React.createElement(Probe)));
    }).not.toThrow();
    expect(themeApi!.colors.bg).toBe(darkColors.bg);
  });
});

describe('haptics', () => {
  beforeEach(() => {
    (Haptics.impactAsync as jest.Mock).mockClear();
    (Haptics.notificationAsync as jest.Mock).mockClear();
    (Haptics.selectionAsync as jest.Mock).mockClear();
  });

  test('medium() calls expo-haptics impactAsync with Medium', () => {
    haptics.medium();
    expect(Haptics.impactAsync).toHaveBeenCalledWith('medium');
  });

  test('each wrapper safely catches errors and does not throw', () => {
    (Haptics.impactAsync as jest.Mock).mockImplementationOnce(() => {
      throw new Error('boom');
    });
    (Haptics.notificationAsync as jest.Mock).mockImplementationOnce(() => {
      throw new Error('boom');
    });
    (Haptics.selectionAsync as jest.Mock).mockImplementationOnce(() => {
      throw new Error('boom');
    });
    expect(() => haptics.light()).not.toThrow();
    expect(() => haptics.heavy()).not.toThrow();
    expect(() => haptics.success()).not.toThrow();
    expect(() => haptics.warning()).not.toThrow();
    expect(() => haptics.selection()).not.toThrow();
  });
});
