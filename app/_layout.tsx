import '../global.css';
import { Stack, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { initDb } from '@/db';
import { seedDemoHistoryIfEmpty } from '@/dev/seedDemoHistory';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { LocaleProvider } from '@/i18n/LocaleProvider';
import { useAppFonts } from '@/theme/useFonts';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const fontsLoaded = useAppFonts();

  useEffect(() => {
    initDb()
      .then(() => seedDemoHistoryIfEmpty())
      .catch(err => console.error('[db] init failed', err));
  }, []);

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <LocaleProvider>
            <Stack screenOptions={{ headerShown: false }} />
            <StatusBar style="auto" />
          </LocaleProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
