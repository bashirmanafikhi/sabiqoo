import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

const STORAGE_KEY = 'app.theme';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  hydrate: () => Promise<void>;
  setMode: (m: ThemeMode) => Promise<void>;
  isDark: (systemIsDark: boolean) => boolean;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: 'system',
  hydrate: async () => {
    const v = await AsyncStorage.getItem(STORAGE_KEY);
    if (v === 'light' || v === 'dark' || v === 'system') set({ mode: v });
  },
  setMode: async (m) => {
    await AsyncStorage.setItem(STORAGE_KEY, m);
    set({ mode: m });
  },
  isDark: (systemIsDark) => {
    const m = get().mode;
    if (m === 'system') return systemIsDark;
    return m === 'dark';
  },
}));
