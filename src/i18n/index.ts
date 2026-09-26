import 'intl-pluralrules';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ar from './ar.json';
import en from './en.json';

const STORAGE_KEY = 'app.locale';

async function detectLocale(): Promise<'ar' | 'en'> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  if (stored === 'ar' || stored === 'en') return stored;
  const device = Localization.getLocales()?.[0]?.languageCode;
  if (device && device.startsWith('ar')) return 'ar';
  if (device && device.startsWith('en')) return 'en';
  return 'ar';
}

export async function initI18n() {
  const lng = await detectLocale();
  await i18n.use(initReactI18next).init({
    resources: { ar: { translation: ar }, en: { translation: en } },
    lng,
    fallbackLng: 'ar',
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    compatibilityJSON: 'v4',
  });
  return i18n;
}

export async function setLocale(lng: 'ar' | 'en') {
  await AsyncStorage.setItem(STORAGE_KEY, lng);
  await i18n.changeLanguage(lng);
}

export function currentLocale(): 'ar' | 'en' {
  return i18n.language as 'ar' | 'en';
}
export function isRTL(): boolean {
  return currentLocale() === 'ar';
}
export default i18n;
