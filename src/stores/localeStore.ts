import { create } from 'zustand';

type Locale = 'ar' | 'en';

interface LocaleState {
  locale: Locale | null;
  setLocale: (l: Locale) => void;
  isRTL: () => boolean;
}

export const useLocaleStore = create<LocaleState>((set, get) => ({
  locale: null,
  setLocale: (locale) => set({ locale }),
  isRTL: () => get().locale === 'ar',
}));
