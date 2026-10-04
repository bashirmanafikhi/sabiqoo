import i18nDefault, {
  currentLocale,
  initI18n,
  isRTL,
  setLocale,
} from '@/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () => {
  const store = new Map<string, string>();
  return {
    __esModule: true,
    default: {
      getItem: jest.fn(async (key: string) => store.get(key) ?? null),
      setItem: jest.fn(async (key: string, value: string) => {
        store.set(key, value);
      }),
      removeItem: jest.fn(async (key: string) => {
        store.delete(key);
      }),
    },
  };
});

jest.mock('expo-localization', () => ({
  __esModule: true,
  getLocales: () => [{ languageCode: 'ar', languageTag: 'ar', regionCode: null }],
}));

describe('i18n', () => {
  beforeEach(async () => {
    await AsyncStorage.removeItem('app.locale');
  });

  test('boots with Arabic by default and exposes the Arabic app name', async () => {
    await initI18n();
    expect(currentLocale()).toBe('ar');
    expect(i18nDefault.t('app.name')).toBe('سابقوا');
    expect(i18nDefault.t('tabs.discover')).toBe('اكتشاف');
    expect(i18nDefault.t('tabs.history')).toBe('السجل');
    expect(isRTL()).toBe(true);
  });

  test('setLocale("en") flips to English and isRTL becomes false', async () => {
    await initI18n();
    expect(isRTL()).toBe(true);

    await setLocale('en');

    expect(currentLocale()).toBe('en');
    expect(i18nDefault.t('app.name')).toBe('Sabiqoo');
    expect(i18nDefault.t('tabs.discover')).toBe('Discover');
    expect(i18nDefault.t('tabs.history')).toBe('History');
    expect(isRTL()).toBe(false);
  });

  test('interpolation and plurals work for both locales', async () => {
    await initI18n();
    expect(i18nDefault.t('discover.donePillAria', { count: 3, deeds: i18nDefault.t('plurals.deeds', { count: 3 }) }))
      .toBe('أنجزت 3 أعمال حتى الآن');
    expect(i18nDefault.t('plurals.deeds', { count: 1 })).toBe('عمل');

    await setLocale('en');
    expect(i18nDefault.t('discover.donePillAria', { count: 1, deeds: i18nDefault.t('plurals.deeds', { count: 1 }) }))
      .toBe('You have completed 1 deed so far');
    expect(i18nDefault.t('plurals.deeds', { count: 5 })).toBe('deeds');
  });
});
