import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Appearance, View, type ColorSchemeName } from 'react-native';
import {
  ThemeContext,
  darkColors,
  lightColors,
  useTheme,
  type ThemeContextValue,
  type ThemeMode,
} from './tokens';

export { useTheme };

const STORAGE_KEY = 'app.theme';

function isThemeMode(value: string | null): value is ThemeMode {
  return value === 'light' || value === 'dark' || value === 'system';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [systemScheme, setSystemScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme(),
  );

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then(stored => {
        if (!mounted) return;
        if (isThemeMode(stored)) {
          setModeState(stored);
        }
      })
      .catch(() => {
        /* swallow persistence errors */
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (mode !== 'system') return;
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(colorScheme);
    });
    return () => sub.remove();
  }, [mode]);

  const isDark = mode === 'system' ? systemScheme === 'dark' : mode === 'dark';

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {
      /* swallow persistence errors */
    });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      setMode,
      colors: isDark ? darkColors : lightColors,
      isDark,
    }),
    [mode, setMode, isDark],
  );

  return (
    <ThemeContext.Provider value={value}>
      <View className={isDark ? 'dark' : ''} style={{ flex: 1 }}>
        {children}
      </View>
    </ThemeContext.Provider>
  );
}
