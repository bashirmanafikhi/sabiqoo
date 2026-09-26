import '../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { initDb } from '@/db';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { LocaleProvider } from '@/i18n/LocaleProvider';

export default function RootLayout() {
  useEffect(() => {
    initDb().catch(err => console.error('[db] init failed', err));
  }, []);

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
