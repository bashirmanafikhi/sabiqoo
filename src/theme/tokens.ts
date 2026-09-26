import { createContext, useContext } from 'react';

export type ColorPalette = {
  bg: string;
  surface: string;
  elevated: string;
  border: string;
  text: string;
  textPrimary: string;
  textMuted: string;
  brand: string;
  brandDark: string;
  brandBlue: string;
  brandBlueDark: string;
  gold: string;
  goldDark: string;
  fire: string;
  fireSoft: string;
  slateBlue: string;
  slateBlueDark: string;
  stateLocked: string;
  stateLockedDark: string;
  ink: string;
  paper: string;
  success: string;
  warning: string;
  danger: string;
};

export const lightColors = {
  bg: '#FFFFFF',
  surface: '#F7F7F7',
  elevated: '#FFFFFF',
  border: '#E5E5E5',
  text: '#1F1F1F',
  textPrimary: '#1F1F1F',
  textMuted: '#777777',
  brand: '#58CC02',
  brandDark: '#58A700',
  brandBlue: '#1CB0F6',
  brandBlueDark: '#0E8FCE',
  gold: '#FFC800',
  goldDark: '#E5A800',
  fire: '#FF4D4D',
  fireSoft: '#FF7A7A',
  slateBlue: '#94A3B8',
  slateBlueDark: '#64748B',
  stateLocked: '#E5E5E5',
  stateLockedDark: '#BFBFBF',
  ink: '#1F1F1F',
  paper: '#FFFFFF',
  success: '#58CC02',
  warning: '#FFC800',
  danger: '#FF4D4D',
} as const satisfies ColorPalette;

export const darkColors = {
  bg: '#0B1220',
  surface: '#121A2B',
  elevated: '#1A2438',
  border: '#22304D',
  text: '#F4F4F5',
  textPrimary: '#F4F4F5',
  textMuted: '#A1A1AA',
  brand: '#58CC02',
  brandDark: '#4A8E00',
  brandBlue: '#1CB0F6',
  brandBlueDark: '#0E8FCE',
  gold: '#FFC800',
  goldDark: '#E5A800',
  fire: '#FF7A7A',
  fireSoft: '#FF9999',
  slateBlue: '#94A3B8',
  slateBlueDark: '#64748B',
  stateLocked: '#2A3344',
  stateLockedDark: '#3A4459',
  ink: '#1F1F1F',
  paper: '#0B1220',
  success: '#58CC02',
  warning: '#FFC800',
  danger: '#FF7A7A',
} as const satisfies ColorPalette;

export type ThemeMode = 'light' | 'dark' | 'system';

export type ThemeContextValue = {
  mode: ThemeMode;
  setMode: (next: ThemeMode) => void;
  colors: ColorPalette;
  isDark: boolean;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}

export function useColors(): ColorPalette {
  return useTheme().colors;
}
