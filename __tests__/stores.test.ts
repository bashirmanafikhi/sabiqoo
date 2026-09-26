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

import {
  useLocaleStore,
  useProfileStore,
  useThemeStore,
} from '@/stores';

const baseProfile = {
  current_xp: 0,
  current_level: 1,
  current_streak: 0,
  longest_streak: 0,
  streak_freezes_left: 2,
  last_active_date: null,
};

describe('themeStore', () => {
  beforeEach(() => {
    useThemeStore.setState({ mode: 'system' });
  });

  test('setMode("dark") updates state to "dark"', async () => {
    await useThemeStore.getState().setMode('dark');
    expect(useThemeStore.getState().mode).toBe('dark');
  });

  test('isDark returns false when mode is "light" regardless of system', () => {
    useThemeStore.setState({ mode: 'light' });
    expect(useThemeStore.getState().isDark(false)).toBe(false);
    expect(useThemeStore.getState().isDark(true)).toBe(false);
  });

  test('isDark returns true when mode is "dark" regardless of system', () => {
    useThemeStore.setState({ mode: 'dark' });
    expect(useThemeStore.getState().isDark(false)).toBe(true);
    expect(useThemeStore.getState().isDark(true)).toBe(true);
  });

  test('isDark mirrors system when mode is "system"', () => {
    useThemeStore.setState({ mode: 'system' });
    expect(useThemeStore.getState().isDark(false)).toBe(false);
    expect(useThemeStore.getState().isDark(true)).toBe(true);
  });
});

describe('profileStore', () => {
  beforeEach(() => {
    useProfileStore.setState({ profile: null });
  });

  test('patchProfile merges fields into existing profile', () => {
    useProfileStore.setState({ profile: { ...baseProfile, current_xp: 100 } });
    useProfileStore.getState().patchProfile({ current_xp: 150 });
    const p = useProfileStore.getState().profile;
    expect(p).not.toBeNull();
    expect(p!.current_xp).toBe(150);
    expect(p!.current_level).toBe(1);
    expect(p!.current_streak).toBe(0);
    expect(p!.streak_freezes_left).toBe(2);
  });

  test('patchProfile is a no-op when profile is null', () => {
    expect(useProfileStore.getState().profile).toBeNull();
    useProfileStore.getState().patchProfile({ current_xp: 999 });
    expect(useProfileStore.getState().profile).toBeNull();
  });

  test('setProfile replaces the entire profile object', () => {
    useProfileStore.setState({ profile: { ...baseProfile } });
    const next = { ...baseProfile, current_level: 3, current_streak: 7 };
    useProfileStore.getState().setProfile(next);
    expect(useProfileStore.getState().profile).toEqual(next);
  });
});

describe('localeStore', () => {
  beforeEach(() => {
    useLocaleStore.setState({ locale: null });
  });

  test('isRTL returns false after setLocale("en")', () => {
    useLocaleStore.getState().setLocale('en');
    expect(useLocaleStore.getState().locale).toBe('en');
    expect(useLocaleStore.getState().isRTL()).toBe(false);
  });

  test('isRTL returns true after setLocale("ar")', () => {
    useLocaleStore.getState().setLocale('ar');
    expect(useLocaleStore.getState().isRTL()).toBe(true);
  });
});
