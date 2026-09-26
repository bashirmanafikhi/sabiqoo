import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { I18nManager, View } from 'react-native';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18nInstance, {
  currentLocale,
  initI18n,
  isRTL as isI18nRTL,
  setLocale as persistLocale,
} from './index';

export type Locale = 'ar' | 'en';

export interface LocaleContextValue {
  locale: Locale;
  setLocale: (lng: Locale) => Promise<void>;
  isRTL: boolean;
  ready: boolean;
}

const STORAGE_KEY = 'app.locale';

const LocaleContext = createContext<LocaleContextValue | null>(null);

let rtlApplied = false;
function applyRTLOnce(rtl: boolean) {
  if (rtlApplied) return;
  rtlApplied = true;
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(rtl);
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ar');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then(stored => {
        if (!mounted) return;
        if (stored === 'ar' || stored === 'en') {
          setLocaleState(stored);
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
    let mounted = true;
    initI18n()
      .then(() => {
        if (!mounted) return;
        const detected = currentLocale();
        applyRTLOnce(isI18nRTL());
        setLocaleState(detected);
        setReady(true);
      })
      .catch(() => {
        if (!mounted) return;
        applyRTLOnce(true);
        setReady(true);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const setLocale = useCallback(async (lng: Locale) => {
    await persistLocale(lng);
    setLocaleState(lng);
    applyRTLOnce(lng === 'ar');
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      isRTL: locale === 'ar',
      ready,
    }),
    [locale, setLocale, ready],
  );

  return (
    <I18nextProvider i18n={i18nInstance}>
      <LocaleContext.Provider value={value}>
        <View className="flex-1">{children}</View>
      </LocaleContext.Provider>
    </I18nextProvider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error('useLocale must be used within a <LocaleProvider>');
  }
  return ctx;
}

export function useAppTranslation() {
  const { t, i18n } = useTranslation();
  const lng = (i18n.language as Locale) || 'ar';
  return { t, i18n, locale: lng };
}
