import { createContext, useContext } from 'react';

export type ColorPalette = {
  coral: string;
  coralDark: string;
  navy: string;
  navyDark: string;
  tangerine: string;
  tangerineDark: string;
  gold: string;
  goldDark: string;
  bg: string;
  surfaceLowest: string;
  surfaceLow: string;
  surface: string;
  surfaceHigh: string;
  surfaceHighest: string;
  border: string;
  outline: string;
  text: string;
  textPrimary: string;
  textMuted: string;
  success: string;
  warning: string;
  overlay: string;
  onGold: string;
  onNavy: string;
  onNavyMuted: string;
  onNavyTrack: string;
  coralFill: string;
  onCoral: string;
  tangerineFill: string;
  onTangerine: string;
  tangerineFillDark: string;
};

export const lightColors = {
  coral: '#EA5455', coralDark: '#C83E40',
  navy: '#2D4059',  navyDark: '#1D2B3D',
  tangerine: '#F07B3F', tangerineDark: '#CF6027',
  gold: '#FFD460', goldDark: '#D4A838',
  bg: '#F8F9FF',
  surfaceLowest: '#FFFFFF',
  surfaceLow:    '#EFF4FF',
  surface:       '#E6EEFF',
  surfaceHigh:   '#DCE9FF',
  surfaceHighest:'#D3E4FE',
  border:        '#D9E3F2',
  outline:       '#65758B',
  text:          '#2D4059',
  textPrimary:   '#2D4059',
  textMuted:     '#5B6E85',
  success:       '#2F8F4E',
  warning:       '#F07B3F',
  overlay:       '#1D2B3DB3',
  onGold:        '#1D2B3D',
  onNavy:        '#FFFFFF',
  onNavyMuted:   '#E7EEF9E6',
  onNavyTrack:   '#FFFFFF33',
  coralFill:     '#C83E40',
  onCoral:       '#FFFFFF',
  tangerineFill: '#CF6027',
  onTangerine:   '#FFFFFF',
  tangerineFillDark: '#A84A18',
} as const satisfies ColorPalette;

export const darkColors = {
  coral: '#FF8A8B', coralDark: '#A53031',
  navy: '#EAF1FF',  navyDark: '#0E1A2C',
  tangerine: '#FF9C66', tangerineDark: '#B8521D',
  gold: '#FFD460', goldDark: '#B8912A',
  bg: '#0E1A2C',
  surfaceLowest: '#16243A',
  surfaceLow:    '#1B2C44',
  surface:       '#1E2F49',
  surfaceHigh:   '#243651',
  surfaceHighest:'#2A3E5E',
  border:        '#3A4A66',
  outline:       '#93A5BF',
  text:          '#EAF1FF',
  textPrimary:   '#EAF1FF',
  textMuted:     '#A6B6CC',
  success:       '#6FCB8B',
  warning:       '#FF9C66',
  overlay:       '#000000AA',
  onGold:        '#1D2B3D',
  onNavy:        '#EAF1FF',
  onNavyMuted:   '#E7EEF9E6',
  onNavyTrack:   '#FFFFFF33',
  coralFill:     '#FF8A8B',
  onCoral:       '#0E1A2C',
  tangerineFill: '#FF9C66',
  onTangerine:   '#0E1A2C',
  tangerineFillDark: '#B8521D',
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
