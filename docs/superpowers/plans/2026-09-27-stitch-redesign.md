# Sabiqoo Stitch Redesign Implementation Plan — Part 1 (Phases 0–4)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current green/blue/gold design system with the new Stitch Coral / Navy / Tangerine / Amber-Gold system across all 4 main screens, plus re-skin Settings, Bookmarks, app icon, and add bilingual EN+AR pairs.

**Architecture:** In-place refactor (Approach A). Token + theme layer first, then primitive components, then screen rebuilds, then cleanup. Existing DB, repos, stores, and i18n infrastructure are untouched — only tokens, components, screens, and translation files change. RTL is handled at the root view via the existing `LocaleProvider`; no `I18nManager` flip is needed at runtime.

**Tech Stack:** Expo SDK 51, React Native 0.74, NativeWind v2 (Tailwind 3.2), Reanimated 3.10, react-native-svg 15.2, expo-haptics, i18next + react-i18next, expo-font.

**Spec:** `docs/superpowers/specs/2026-09-27-stitch-redesign-design.md`

> **Plan continues in:** `docs/superpowers/plans/2026-09-27-stitch-redesign-part2.md`

---

## Global Constraints

These apply to every task. Copy is verbatim from the spec.

### Tokens (Tailwind + `tokens.ts`)

```
coral:           #EA5455  / dark #FF8A8B   (primary)
coral-dark:      #C83E40  / dark #A53031   (bevel)
navy:            #2D4059  / dark #EAF1FF   (text / on-surface)
navy-dark:       #1D2B3D  / dark #0E1A2C   (bevel)
tangerine:       #F07B3F  / dark #FF9C66   (secondary)
tangerine-dark:  #CF6027  / dark #B8521D   (bevel)
amber-gold:      #FFD460                    (tertiary / gold)
amber-gold-dark: #D4A838  / dark #B8912A   (bevel)
background:           #F8F9FF  / dark #0E1A2C
surface-container-lowest: #FFFFFF / dark #16243A
surface-container-low:    #EFF4FF / dark #1B2C44
surface-container:        #E6EEFF / dark #1E2F49
surface-container-high:   #DCE9FF / dark #243651
surface-container-highest:#D3E4FE / dark #2A3E5E
on-surface:              #2D4059  / dark #EAF1FF
on-surface-variant:      #5B6E85  / dark #A6B6CC
outline:                 #8D706E  / dark #5B6E85
outline-variant:         #E1BFBC  / dark #3A4A66
```

Removed tokens (all references must be migrated): `brand-green*`, `brand-blue*`, `accent-gold*`, `slate-blue*`, `state-locked*`, `ink`, `paper`, `success`, `warning`, `danger`.

### Typography

- **Epilogue** (500/600/700/800/900) — headlines, labels.
- **Plus Jakarta Sans** (400/500/600/700/800) — body, buttons.
- **Cairo** (700/800/900) — Arabic subtitles, weight-mapped 800↔J800, 700↔J700, etc.

Type scale (size/line — weight — tracking):
`display-hero 36/44 800 -0.02em`
`display-hero-mobile 28/34 800 -0.01em`
`headline-lg 24/32 800 -0.01em`
`headline-md 20/28 700`
`headline-sm 18/24 700`
`body-lg 16/24 600`
`body-md 14/20 500`
`body-sm 12/16 500`
`label-lg 15/20 800 0.04em`
`label-md 12/16 800 0.05em`
`label-sm 10/14 800 0.06em`

### Spacing & radius

`gutter 1rem`, `margin 1.25rem`, `margin-mobile 1rem`,
`space-xs 0.25rem`, `space-sm 0.5rem`, `space-md 1rem`, `space-lg 1.5rem`, `space-xl 2.5rem`.
Radii: `sm 0.25rem`, `DEFAULT 0.5rem`, `md 0.75rem`, `lg 1rem`, `xl 1.5rem`, `full 9999px`.

### 3D bevel rule

Every elevated button / node / pill: solid color fill + a flat offset shape beneath, darker shade of same color, 3–5px tall, matching radius. On press, the foreground translates Y by the bevel height. No blur shadows.

### Project rules

- Tests use `@testing-library/react-native` with `jest-expo` preset.
- Wrap rendered components in `<ThemeProvider>` (mirror the pattern in existing `BigButton3D.test.tsx`).
- Component files: PascalCase, default export = named export.
- i18n key naming: `namespace.subKey`. No hard-coded English/Arabic strings in components.
- Run `npm run typecheck` and `npm run lint` after each task.
- Run `npx jest <test-path>` after each task that creates or modifies tests.

### Test mock snippet (use in every test file)

```ts
jest.mock('@react-native-async-storage/async-storage', () => ({
  default: { getItem: jest.fn().mockResolvedValue(null), setItem: jest.fn().mockResolvedValue(undefined), removeItem: jest.fn().mockResolvedValue(undefined) },
}));
jest.mock('expo-haptics', () => ({
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
  NotificationFeedbackType: { Success: 'success', Warning: 'warning', Error: 'error' },
  impactAsync: jest.fn().mockResolvedValue(undefined),
  notificationAsync: jest.fn().mockResolvedValue(undefined),
  selectionAsync: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: 'en' } }),
}));
const wrap = (c: React.ReactNode) => React.createElement(ThemeProvider, null, c);
```

---

## Phase 0 — Foundation

### Task 1: Update `tailwind.config.js` with new tokens

**Files:** Modify `tailwind.config.js`

- [ ] **Step 1: Replace the file**

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './nativewind-env.d.ts',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        coral:           { light: '#EA5455', dark: '#FF8A8B' },
        'coral-dark':    { light: '#C83E40', dark: '#A53031' },
        navy:            { light: '#2D4059', dark: '#EAF1FF' },
        'navy-dark':     { light: '#1D2B3D', dark: '#0E1A2C' },
        tangerine:       { light: '#F07B3F', dark: '#FF9C66' },
        'tangerine-dark':{ light: '#CF6027', dark: '#B8521D' },
        'amber-gold':    { light: '#FFD460', dark: '#FFD460' },
        'amber-gold-dark': { light: '#D4A838', dark: '#B8912A' },
        bg:              { light: '#F8F9FF', dark: '#0E1A2C' },
        'surface-lowest':{ light: '#FFFFFF', dark: '#16243A' },
        'surface-low':   { light: '#EFF4FF', dark: '#1B2C44' },
        surface:         { light: '#E6EEFF', dark: '#1E2F49' },
        'surface-high':  { light: '#DCE9FF', dark: '#243651' },
        'surface-highest': { light: '#D3E4FE', dark: '#2A3E5E' },
        'text-primary':  { light: '#2D4059', dark: '#EAF1FF' },
        'text-muted':    { light: '#5B6E85', dark: '#A6B6CC' },
        border:          { light: '#E1BFBC', dark: '#3A4A66' },
        outline:         { light: '#8D706E', dark: '#5B6E85' },
        'stripe-mastered':  '#EA5455',
        'stripe-completed': '#F07B3F',
        'stripe-available': '#FFD460',
        'stripe-locked':    '#E1BFBC',
        // Legacy — for migration only; remove in Cleanup phase
        legacy: {
          brand:   { light: '#58CC02', dark: '#58CC02' },
          'brand-dark': { light: '#58A700', dark: '#4A8E00' },
          'brand-blue':  { light: '#1CB0F6', dark: '#1CB0F6' },
          'brand-blue-dark': { light: '#0E8FCE', dark: '#0E8FCE' },
          'accent-gold': { light: '#FFC800', dark: '#FFC800' },
          fire: { light: '#FF4D4D', dark: '#FF7A7A' },
          'slate-blue': '#94A3B8',
          locked: '#E5E5E5',
          ink: '#1F1F1F',
          paper: '#FFFFFF',
        },
      },
      fontFamily: {
        sans:     ['PlusJakartaSans_500Medium', 'PlusJakartaSans_600SemiBold', 'PlusJakartaSans_700Bold', 'PlusJakartaSans_800ExtraBold'],
        headline: ['Epilogue_500Medium', 'Epilogue_600SemiBold', 'Epilogue_700Bold', 'Epilogue_800ExtraBold', 'Epilogue_900Black'],
        arabic:   ['Cairo_700Bold', 'Cairo_800ExtraBold', 'Cairo_900Black'],
      },
      borderRadius: {
        sm: '0.25rem', DEFAULT: '0.5rem', md: '0.75rem',
        lg: '1rem', xl: '1.5rem', full: '9999px', '4xl': '24px',
      },
      spacing: {
        gutter: '1rem', 'gutter-mobile': '0.75rem',
        margin: '1.25rem', 'margin-mobile': '1rem',
        'space-xs': '0.25rem', 'space-sm': '0.5rem',
        'space-md': '1rem', 'space-lg': '1.5rem', 'space-xl': '2.5rem',
      },
      fontSize: {
        'display-hero':        ['36px', { lineHeight: '44px', fontWeight: '800', letterSpacing: '-0.02em' }],
        'display-hero-mobile': ['28px', { lineHeight: '34px', fontWeight: '800', letterSpacing: '-0.01em' }],
        'headline-lg':         ['24px', { lineHeight: '32px', fontWeight: '800', letterSpacing: '-0.01em' }],
        'headline-md':         ['20px', { lineHeight: '28px', fontWeight: '700' }],
        'headline-sm':         ['18px', { lineHeight: '24px', fontWeight: '700' }],
        'body-lg':             ['16px', { lineHeight: '24px', fontWeight: '600' }],
        'body-md':             ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'body-sm':             ['12px', { lineHeight: '16px', fontWeight: '500' }],
        'label-lg':            ['15px', { lineHeight: '20px', fontWeight: '800', letterSpacing: '0.04em' }],
        'label-md':            ['12px', { lineHeight: '16px', fontWeight: '800', letterSpacing: '0.05em' }],
        'label-sm':            ['10px', { lineHeight: '14px', fontWeight: '800', letterSpacing: '0.06em' }],
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 2: Commit**

```bash
git add tailwind.config.js
git commit -m "feat(design): coral/navy/tangerine/gold palette + Epilogue/PlusJakarta fonts"
```

### Task 2: Update `global.css`

**Files:** Modify `global.css`

- [ ] **Step 1: Replace the file**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body { font-family: 'PlusJakartaSans_500Medium'; }
  .dark body { color: #EAF1FF; background-color: #0E1A2C; }
}

.btn-3d-coral      { box-shadow: 0 4px 0 #C83E40; }
.btn-3d-coral-dark { box-shadow: 0 4px 0 #A53031; }
.btn-3d-tangerine  { box-shadow: 0 4px 0 #CF6027; }
.btn-3d-navy       { box-shadow: 0 4px 0 #1D2B3D; }
.btn-3d-gold       { box-shadow: 0 4px 0 #D4A838; }
.btn-3d-pressed    { transform: translateY(3px); }
```

- [ ] **Step 2: Commit**

```bash
git add global.css
git commit -m "feat(design): new global.css base + 3D bevel helpers"
```

### Task 3: Update `src/theme/tokens.ts`

**Files:** Modify `src/theme/tokens.ts`

- [ ] **Step 1: Replace the file**

```ts
import { createContext, useContext } from 'react';

export type ColorPalette = {
  coral: string; coralDark: string;
  navy: string;  navyDark: string;
  tangerine: string; tangerineDark: string;
  gold: string; goldDark: string;
  bg: string;
  surfaceLowest: string; surfaceLow: string; surface: string;
  surfaceHigh: string; surfaceHighest: string;
  border: string; outline: string;
  text: string; textPrimary: string; textMuted: string;
  success: string; warning: string;
};

export const lightColors = {
  coral: '#EA5455', coralDark: '#C83E40',
  navy: '#2D4059',  navyDark: '#1D2B3D',
  tangerine: '#F07B3F', tangerineDark: '#CF6027',
  gold: '#FFD460', goldDark: '#D4A838',
  bg: '#F8F9FF',
  surfaceLowest: '#FFFFFF', surfaceLow: '#EFF4FF', surface: '#E6EEFF',
  surfaceHigh: '#DCE9FF', surfaceHighest: '#D3E4FE',
  border: '#E1BFBC', outline: '#8D706E',
  text: '#2D4059', textPrimary: '#2D4059', textMuted: '#5B6E85',
  success: '#EA5455', warning: '#F07B3F',
} as const satisfies ColorPalette;

export const darkColors = {
  coral: '#FF8A8B', coralDark: '#A53031',
  navy: '#EAF1FF',  navyDark: '#0E1A2C',
  tangerine: '#FF9C66', tangerineDark: '#B8521D',
  gold: '#FFD460', goldDark: '#B8912A',
  bg: '#0E1A2C',
  surfaceLowest: '#16243A', surfaceLow: '#1B2C44', surface: '#1E2F49',
  surfaceHigh: '#243651', surfaceHighest: '#2A3E5E',
  border: '#3A4A66', outline: '#5B6E85',
  text: '#EAF1FF', textPrimary: '#EAF1FF', textMuted: '#A6B6CC',
  success: '#FF8A8B', warning: '#FF9C66',
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
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}

export function useColors(): ColorPalette {
  return useTheme().colors;
}
```

- [ ] **Step 2: Commit** (tolerating type errors — components still reference old keys via `BigButton3D.tsx` etc.)

```bash
git add src/theme/tokens.ts
git commit -m "feat(design): ColorPalette (coral/navy/tangerine/gold)"
```

### Task 4: Install Google font packages

- [ ] **Step 1: Install**

```bash
npx expo install @expo-google-fonts/epilogue @expo-google-fonts/plus-jakarta-sans @expo-google-fonts/cairo
```

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat(deps): add Epilogue, PlusJakartaSans, Cairo Expo fonts"
```

### Task 5: `useFonts` hook + wire in root layout

**Files:** Create `src/theme/useFonts.ts`; modify `app/_layout.tsx`

- [ ] **Step 1: Create `src/theme/useFonts.ts`**

```ts
import { useFonts as useEpilogueFonts, Epilogue_500Medium, Epilogue_600SemiBold, Epilogue_700Bold, Epilogue_800ExtraBold, Epilogue_900Black } from '@expo-google-fonts/epilogue';
import { useFonts as useJakartaFonts, PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold, PlusJakartaSans_800ExtraBold } from '@expo-google-fonts/plus-jakarta-sans';
import { useFonts as useCairoFonts, Cairo_700Bold, Cairo_800ExtraBold, Cairo_900Black } from '@expo-google-fonts/cairo';

export function useAppFonts(): boolean {
  const [epilogueLoaded] = useEpilogueFonts({
    Epilogue_500Medium, Epilogue_600SemiBold, Epilogue_700Bold, Epilogue_800ExtraBold, Epilogue_900Black,
  });
  const [jakartaLoaded] = useJakartaFonts({
    PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold, PlusJakartaSans_800ExtraBold,
  });
  const [cairoLoaded] = useCairoFonts({
    Cairo_700Bold, Cairo_800ExtraBold, Cairo_900Black,
  });
  return !!(epilogueLoaded && jakartaLoaded && cairoLoaded);
}
```

- [ ] **Step 2: Replace `app/_layout.tsx`**

```tsx
import '../global.css';
import { Stack, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { initDb } from '@/db';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { LocaleProvider } from '@/i18n/LocaleProvider';
import { useAppFonts } from '@/theme/useFonts';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const fontsLoaded = useAppFonts();
  useEffect(() => { initDb().catch(err => console.error('[db] init failed', err)); }, []);
  useEffect(() => { if (fontsLoaded) SplashScreen.hideAsync().catch(() => {}); }, [fontsLoaded]);
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
```

- [ ] **Step 3: Commit**

```bash
git add src/theme/useFonts.ts app/_layout.tsx
git commit -m "feat(design): load Epilogue + PlusJakartaSans + Cairo, splash until ready"
```

---

## Phase 1 — Core primitives

### Task 6: `Button3D` + test

**Files:** Create `src/components/Button3D.tsx`, `Button3D.test.tsx`

- [ ] **Step 1: Write `Button3D.test.tsx`**

```tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { Button3D } from './Button3D';
// paste the test mock snippet from Global Constraints above

const wrap = (c: React.ReactNode) => React.createElement(ThemeProvider, null, c);

describe('Button3D', () => {
  it('renders label', () => {
    const { getByText } = render(wrap(<Button3D label="Mark Done" onPress={() => {}} variant="coral" />));
    expect(getByText('Mark Done')).toBeTruthy();
  });

  it('fires onPress when pressed', () => {
    const fn = jest.fn();
    const { getByRole } = render(wrap(<Button3D label="Go" onPress={fn} variant="coral" />));
    fireEvent.press(getByRole('button'));
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('does not fire when disabled', () => {
    const fn = jest.fn();
    const { getByRole } = render(wrap(<Button3D label="x" onPress={fn} variant="coral" disabled />));
    fireEvent.press(getByRole('button'));
    expect(fn).not.toHaveBeenCalled();
  });

  it('hides label while loading', () => {
    const { queryByText } = render(wrap(<Button3D label="Save" onPress={() => {}} variant="coral" loading />));
    expect(queryByText('Save')).toBeNull();
  });
});
```

- [ ] **Step 2: Run test (it should fail to import)**

```bash
npx jest src/components/Button3D.test.tsx
# expected: FAIL — cannot find module './Button3D'
```

- [ ] **Step 3: Create `src/components/Button3D.tsx`**

```tsx
import { useCallback } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useColors } from '@/theme/tokens';
import * as haptics from '@/utils/haptics';

export type Button3DVariant = 'coral' | 'tangerine' | 'navy' | 'gold' | 'ghost';

export interface Button3DProps {
  label: string;
  onPress: () => void;
  variant?: Button3DVariant;
  loading?: boolean;
  disabled?: boolean;
  size?: 'md' | 'lg' | 'square';
  accessibilityLabel?: string;
  testID?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

const HEIGHT = 52;
const BEVEL = 4;

const PALETTE = {
  coral:     { top: '#EA5455', bottom: '#C83E40' },
  tangerine: { top: '#F07B3F', bottom: '#CF6027' },
  navy:      { top: '#2D4059', bottom: '#1D2B3D' },
  gold:      { top: '#FFD460', bottom: '#D4A838' },
} as const;

export function Button3D({
  label, onPress, variant = 'coral', loading, disabled,
  size = 'md', accessibilityLabel, testID, leadingIcon, trailingIcon,
}: Button3DProps) {
  const colors = useColors();
  const pressed = useSharedValue(0);
  const top = useAnimatedStyle(() => ({ transform: [{ translateY: pressed.value }] }));

  const onPressIn = useCallback(() => {
    pressed.value = withTiming(BEVEL, { duration: 80 });
    haptics.selection();
  }, [pressed]);
  const onPressOut = useCallback(() => {
    pressed.value = withTiming(0, { duration: 120 });
  }, [pressed]);

  const pal = variant !== 'ghost' ? PALETTE[variant] : null;
  const topBg = pal?.top ?? colors.surfaceLowest;
  const bottomBg = pal?.bottom ?? colors.surface;
  const textColor = variant === 'gold' ? colors.navy : (variant === 'ghost' ? colors.text : '#FFFFFF');
  const w = size === 'square' ? 56 : undefined;

  return (
    <View testID={testID} style={{ width: w ?? '100%', height: HEIGHT + BEVEL }}>
      <View aria-hidden style={{
        position: 'absolute', top: BEVEL, left: 0, right: 0, bottom: 0,
        backgroundColor: bottomBg, borderRadius: 16,
      }} />
      <Animated.View style={[
        { position: 'absolute', top: 0, left: 0, right: 0, bottom: BEVEL,
          backgroundColor: topBg, borderRadius: 16 },
        top,
      ]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel ?? label}
          accessibilityState={{ disabled: !!disabled, busy: !!loading }}
          disabled={!!disabled || !!loading}
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          testID={testID ? `${testID}-pressable` : undefined}
          style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 14, paddingHorizontal: 16 }}
        >
          {loading ? (
            <ActivityIndicator color={textColor} />
          ) : (
            <>
              {leadingIcon}
              <Text className="font-label-lg text-label-lg uppercase" style={{ color: textColor, fontWeight: '800' }} numberOfLines={1}>
                {label}
              </Text>
              {trailingIcon}
            </>
          )}
        </Pressable>
      </Animated.View>
    </View>
  );
}

export default Button3D;
```

- [ ] **Step 4: Run + Commit**

```bash
npx jest src/components/Button3D.test.tsx
git add src/components/Button3D.tsx src/components/Button3D.test.tsx
git commit -m "feat(components): Button3D (coral/tangerine/navy/gold/ghost variants)"
```

### Task 7: `HudPill` + test

**Files:** Create `src/components/HudPill.tsx`, `HudPill.test.tsx`

- [ ] **Step 1: Test**

```tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { HudPill } from './HudPill';
// paste test mock snippet from Global Constraints
const wrap = (c: React.ReactNode) => React.createElement(ThemeProvider, null, c);

describe('HudPill', () => {
  it('renders label', () => {
    const { getByText } = render(wrap(<HudPill variant="coral" icon={<></>} label="7d" />));
    expect(getByText('7d')).toBeTruthy();
  });
  it('exposes button role when onPress provided', () => {
    const { getByRole } = render(wrap(<HudPill variant="gold" icon={<></>} label="340 XP" onPress={() => {}} />));
    expect(getByRole('button')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Create `HudPill.tsx`**

```tsx
import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';

export type HudPillVariant = 'coral' | 'gold' | 'navy' | 'outline';

export interface HudPillProps {
  variant: HudPillVariant;
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const PALETTE = {
  coral:   { bg: '#EA5455', fg: '#FFFFFF', stroke: 'transparent' },
  gold:    { bg: '#FFD46033', fg: '#1D2B3D', stroke: '#FFD46066' },
  navy:    { bg: '#2D4059',  fg: '#FFFFFF', stroke: 'transparent' },
  outline: { bg: '#DCE9FF', fg: '#1D2B3D', stroke: '#E1BFBC' },
} as const;

export function HudPill({ variant, icon, label, onPress, style, testID }: HudPillProps) {
  const pal = PALETTE[variant];
  const inner = (
    <View testID={testID} style={{
      flexDirection: 'row', alignItems: 'center', gap: 4,
      height: 36, paddingHorizontal: 12, borderRadius: 999,
      backgroundColor: pal.bg, borderWidth: 1, borderColor: pal.stroke,
      ...(style as object),
    }}>
      {icon}
      <Text className="font-label-md text-label-md uppercase" style={{ color: pal.fg, fontWeight: '800' }}>
        {label}
      </Text>
    </View>
  );
  if (!onPress) return inner;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress}>
      {inner}
    </Pressable>
  );
}

export default HudPill;
```

- [ ] **Step 3: Run + Commit**

```bash
npx jest src/components/HudPill.test.tsx
git add src/components/HudPill.tsx src/components/HudPill.test.tsx
git commit -m "feat(components): HudPill (4 variants)"
```

### Task 8: `Bilingual` + test

**Files:** Create `src/components/Bilingual.tsx`, `Bilingual.test.tsx`

- [ ] **Step 1: Test**

```tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { Bilingual } from './Bilingual';
const wrap = (c: React.ReactNode) => React.createElement(ThemeProvider, null, c);

describe('Bilingual', () => {
  it('renders primary and secondary when both provided', () => {
    const { getByText } = render(wrap(<Bilingual primary="Smiles" secondary="تبسم وكلمة طيبة" />));
    expect(getByText('Smiles')).toBeTruthy();
    expect(getByText('تبسم وكلمة طيبة')).toBeTruthy();
  });

  it('omits secondary when null', () => {
    const { queryByText, getByText } = render(wrap(<Bilingual primary="Smiles" secondary={null} />));
    expect(getByText('Smiles')).toBeTruthy();
    expect(queryByText(/تبسم/)).toBeNull();
  });

  it('uses dir=auto on Arabic fragment', () => {
    const { getByText } = render(wrap(<Bilingual primary="Smiles" secondary="تبسم" />));
    expect(getByText('تبسم').props.dir).toBe('auto');
  });
});
```

- [ ] **Step 2: Create `Bilingual.tsx`**

```tsx
import { Text, View } from 'react-native';
import { useColors } from '@/theme/tokens';
import { useLocale } from '@/i18n/LocaleProvider';

export interface BilingualProps {
  primary: string;
  secondary?: string | null;
  className?: string;
  testID?: string;
}

export function Bilingual({ primary, secondary, className, testID }: BilingualProps) {
  const colors = useColors();
  const { locale } = useLocale();
  const headingFont = locale === 'ar' ? 'font-arabic' : 'font-headline';
  return (
    <View testID={testID} className={className}>
      <Text className={`${headingFont} text-headline-md`} style={{ color: colors.text }}>{primary}</Text>
      {secondary ? (
        <Text
          className="font-arabic text-body-md"
          style={{ color: colors.textMuted, marginTop: 2 }}
          dir="auto"
        >
          {secondary}
        </Text>
      ) : null}
    </View>
  );
}

export default Bilingual;
```

- [ ] **Step 3: Run + Commit**

```bash
npx jest src/components/Bilingual.test.tsx
git add src/components/Bilingual.tsx src/components/Bilingual.test.tsx
git commit -m "feat(components): Bilingual with RTL-aware Arabic fragment"
```

### Task 9: `AppTopBar` + test

**Files:** Create `src/components/AppTopBar.tsx`, `AppTopBar.test.tsx`

- [ ] **Step 1: Test**

```tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { AppTopBar } from './AppTopBar';
// paste test mock snippet
const wrap = (c: React.ReactNode) => React.createElement(ThemeProvider, null, c);

describe('AppTopBar', () => {
  it('shows streak, xp, saved', () => {
    const { getByText } = render(wrap(
      <AppTopBar streakDays={7} xp={340} savedCount={4}
        onSettings={() => {}} onToggleLocale={() => {}} onAvatar={() => {}} />
    ));
    expect(getByText('7d')).toBeTruthy();
    expect(getByText('340 XP')).toBeTruthy();
    expect(getByText('4')).toBeTruthy();
  });

  it('fires settings on press', () => {
    const fn = jest.fn();
    const { getByLabelText } = render(wrap(
      <AppTopBar streakDays={7} xp={340} savedCount={4}
        onSettings={fn} onToggleLocale={() => {}} onAvatar={() => {}} />
    ));
    fireEvent.press(getByLabelText('settings'));
    expect(fn).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Create `AppTopBar.tsx`**

```tsx
import { Pressable, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/theme/tokens';
import { HudPill } from './HudPill';
import { useTranslation } from 'react-i18next';

export interface AppTopBarProps {
  streakDays: number;
  xp: number;
  savedCount: number;
  onSettings: () => void;
  onToggleLocale: () => void;
  onAvatar: () => void;
  rightSlot?: React.ReactNode;
}

export function AppTopBar({ streakDays, xp, savedCount, onSettings, onToggleLocale, onAvatar, rightSlot }: AppTopBarProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  return (
    <View
      style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50,
        paddingTop: insets.top,
        backgroundColor: colors.bg + 'cc',
        borderBottomWidth: 1, borderBottomColor: colors.border,
      }}
    >
      <View className="h-16 px-gutter flex-row items-center gap-space-xs" style={{ maxWidth: 480 }}>
        <HudPill variant="coral" icon={<Ionicons name="flame" size={18} color="#EA5455" />} label={`${streakDays}d`} />
        <HudPill variant="gold" icon={<Ionicons name="flash" size={18} color="#F07B3F" />} label={`${xp} XP`} />
        <View className="flex-1" />
        {rightSlot}
        <HudPill variant="outline" icon={<Ionicons name="heart" size={18} color="#EA5455" />} label={String(savedCount)} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('home.language')}
          onPress={onToggleLocale}
          className="h-9 px-space-sm rounded-full items-center justify-center"
          style={{ backgroundColor: colors.surfaceHigh }}
        >
          <Text className="font-label-md text-label-md" style={{ color: colors.textPrimary, fontWeight: '800' }}>ع / EN</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('home.settings')}
          onPress={onSettings}
          className="w-9 h-9 rounded-full items-center justify-center"
        >
          <Ionicons name="settings-outline" size={20} color={colors.textPrimary} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="avatar"
          onPress={onAvatar}
          className="w-8 h-8 rounded-full items-center justify-center"
          style={{ backgroundColor: '#2D4059' }}
        >
          <Ionicons name="person" size={18} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

export default AppTopBar;
```

- [ ] **Step 3: Run + Commit**

```bash
npx jest src/components/AppTopBar.test.tsx
git add src/components/AppTopBar.tsx src/components/AppTopBar.test.tsx
git commit -m "feat(components): AppTopBar (streak/XP/saved/lang/settings/avatar)"
```

### Task 10: `SegmentedControl` + test (shared, replaces `app/settings/_SegmentedControl.tsx`)

**Files:** Create `src/components/SegmentedControl.tsx`, `SegmentedControl.test.tsx`

- [ ] **Step 1: Test**

```tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { SegmentedControl } from './SegmentedControl';
// paste test mock snippet
const wrap = (c: React.ReactNode) => React.createElement(ThemeProvider, null, c);

describe('SegmentedControl', () => {
  it('renders all labels', () => {
    const { getByText } = render(wrap(
      <SegmentedControl<'a'|'b'|'c'> value="a" onChange={() => {}}
        options={[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }, { value: 'c', label: 'C' }]} />
    ));
    expect(getByText('A')).toBeTruthy();
    expect(getByText('B')).toBeTruthy();
    expect(getByText('C')).toBeTruthy();
  });

  it('fires onChange', () => {
    const fn = jest.fn();
    const { getByText } = render(wrap(
      <SegmentedControl<'a'|'b'> value="a" onChange={fn}
        options={[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]} />
    ));
    fireEvent.press(getByText('B'));
    expect(fn).toHaveBeenCalledWith('b');
  });
});
```

- [ ] **Step 2: Create `SegmentedControl.tsx`**

```tsx
import { Pressable, Text, View } from 'react-native';
import { useColors } from '@/theme/tokens';

export interface SegmentedControlProps<T extends string> {
  value: T;
  onChange: (next: T) => void;
  options: ReadonlyArray<{ value: T; label: string; leadingIcon?: React.ReactNode }>;
}

export function SegmentedControl<T extends string>({ value, onChange, options }: SegmentedControlProps<T>) {
  const colors = useColors();
  return (
    <View className="p-1 rounded-2xl flex-row gap-1"
      style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}>
      {options.map(opt => {
        const active = opt.value === value;
        return (
          <Pressable key={opt.value}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(opt.value)}
            testID={`seg-${opt.value}`}
            className="flex-1 py-2 px-3 rounded-xl items-center justify-center flex-row gap-1.5"
            style={{ backgroundColor: active ? '#EA5455' : 'transparent', shadowOpacity: active ? 0.1 : 0 }}>
            {opt.leadingIcon}
            <Text className="font-label-md text-label-md uppercase"
              style={{ color: active ? '#FFFFFF' : colors.text, fontWeight: '800' }}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default SegmentedControl;
```

- [ ] **Step 3: Run + Commit**

```bash
npx jest src/components/SegmentedControl.test.tsx
git add src/components/SegmentedControl.tsx src/components/SegmentedControl.test.tsx
git commit -m "feat(components): SegmentedControl (coral active 3-tab pill)"
```

### Task 11: `AppBottomNav` + test

**Files:** Create `src/components/AppBottomNav.tsx`, `AppBottomNav.test.tsx`

- [ ] **Step 1: Test**

```tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { AppBottomNav } from './AppBottomNav';
// paste test mock snippet
const wrap = (c: React.ReactNode) => React.createElement(ThemeProvider, null, c);

describe('AppBottomNav', () => {
  it('renders 3 tabs', () => {
    const { getByText } = render(wrap(<AppBottomNav active="roadmap" onChange={() => {}} />));
    expect(getByText('Roadmap')).toBeTruthy();
    expect(getByText('Catalog')).toBeTruthy();
    expect(getByText('History')).toBeTruthy();
  });

  it('fires onChange with new tab', () => {
    const fn = jest.fn();
    const { getByText } = render(wrap(<AppBottomNav active="roadmap" onChange={fn} />));
    fireEvent.press(getByText('Catalog'));
    expect(fn).toHaveBeenCalledWith('catalog');
  });
});
```

- [ ] **Step 2: Create `AppBottomNav.tsx`**

```tsx
import { Pressable, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useColors } from '@/theme/tokens';

export type BottomTab = 'roadmap' | 'catalog' | 'history';
export interface AppBottomNavProps { active: BottomTab; onChange: (next: BottomTab) => void; }

const TABS: ReadonlyArray<{ key: BottomTab; labelKey: string; icon: any }> = [
  { key: 'roadmap', labelKey: 'home.title', icon: 'compass-outline' },
  { key: 'catalog', labelKey: 'catalog.title', icon: 'book-outline' },
  { key: 'history', labelKey: 'history.title', icon: 'trending-up-outline' },
];

export function AppBottomNav({ active, onChange }: AppBottomNavProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  return (
    <View
      style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 50,
        paddingBottom: insets.bottom,
        backgroundColor: colors.bg + 'ee',
        borderTopWidth: 1, borderTopColor: colors.border,
      }}>
      <View className="h-16 px-space-sm flex-row items-center justify-around" style={{ maxWidth: 480 }}>
        {TABS.map(tab => {
          const isActive = tab.key === active;
          const color = isActive ? '#EA5455' : colors.textPrimary + '99';
          return (
            <Pressable key={tab.key}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={t(tab.labelKey)}
              onPress={() => onChange(tab.key)}
              testID={`tab-${tab.key}`}
              className="min-w-16 min-h-12 py-1 px-space-xs items-center justify-center">
              <Ionicons name={tab.icon} size={24} color={color} />
              <Text className="font-label-sm text-label-sm mt-0.5"
                style={{ color, fontWeight: isActive ? '800' : '700' }}>
                {t(tab.labelKey)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default AppBottomNav;
```

- [ ] **Step 3: Run + Commit**

```bash
npx jest src/components/AppBottomNav.test.tsx
git add src/components/AppBottomNav.tsx src/components/AppBottomNav.test.tsx
git commit -m "feat(components): AppBottomNav (Roadmap/Catalog/History)"
```

---

## Phase 2 — Roadmap components

### Task 12: `RoadmapNode` + test

**Files:** Create `src/components/RoadmapNode.tsx`, `RoadmapNode.test.tsx`

- [ ] **Step 1: Test**

```tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { RoadmapNode } from './RoadmapNode';
const wrap = (c: React.ReactNode) => React.createElement(ThemeProvider, null, c);

describe('RoadmapNode', () => {
  it.each(['mastered','completed','available','locked','skipped'] as const)(
    'renders %s state', (state) => {
      const { getByTestId } = render(wrap(
        <RoadmapNode state={state} label="Smile" xp={15} testID={`node-${state}`} />
      ));
      expect(getByTestId(`node-${state}-circle`)).toBeTruthy();
    });
});
```

- [ ] **Step 2: Create `RoadmapNode.tsx`**

```tsx
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type NodeState = 'mastered' | 'completed' | 'available' | 'locked' | 'skipped';
export interface RoadmapNodeProps {
  state: NodeState;
  label: string;
  xp?: number;
  onPress?: () => void;
  disabled?: boolean;
  testID?: string;
}

const SIZE = 64;
const BEVEL = 5;

const TOP = {
  mastered: '#FFD460', completed: '#FFD460', available: '#EA5455',
  locked: '#DCE9FF', skipped: '#DCE9FF',
} as const;

const BEVEL_COLOR = {
  mastered: '#D4A838', completed: '#D4A838', available: '#C83E40',
  locked: '#C5D4EC', skipped: '#C5D4EC',
} as const;

const ICON = {
  mastered:  { name: 'star',          fill: '#1D2B3D' },
  completed: { name: 'checkmark',     fill: '#1D2B3D' },
  available: { name: 'heart',         fill: '#FFFFFF' },
  locked:    { name: 'lock-closed',   fill: '#1D2B3D99' },
  skipped:   { name: 'eye-off',       fill: '#1D2B3DAA' },
};

export function RoadmapNode({ state, label, xp, onPress, disabled, testID }: RoadmapNodeProps) {
  const locked = state === 'locked' || disabled;
  const ic = ICON[state];

  const body = (
    <View className="items-center" testID={testID}>
      {state === 'available' && xp != null ? (
        <View className="mb-1 flex-row items-center gap-1 px-space-sm py-0.5 rounded-full"
          style={{ backgroundColor: '#EA5455' }}>
          <Ionicons name="flash" size={14} color="#FFD460" />
          <Text className="font-label-md text-label-md text-white" style={{ fontWeight: '800' }}>+{xp} XP</Text>
        </View>
      ) : null}

      <View style={{ width: SIZE, height: SIZE + BEVEL }} testID={`${testID}-circle`}>
        <View aria-hidden style={{
          position: 'absolute', top: BEVEL, left: 0, right: 0, bottom: 0,
          backgroundColor: BEVEL_COLOR[state], borderRadius: 999,
        }} />
        <View style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: BEVEL,
          backgroundColor: TOP[state], borderRadius: 999,
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Ionicons name={ic.name as any} size={state === 'available' ? 28 : 26} color={ic.fill} />
          {state === 'mastered' ? (
            <View style={{
              position: 'absolute', top: -6, right: -6, width: 22, height: 22, borderRadius: 11,
              backgroundColor: '#EA5455', alignItems: 'center', justifyContent: 'center',
            }}>
              <Ionicons name="flame" size={12} color="#FFFFFF" />
            </View>
          ) : null}
          {state === 'available' ? (
            <View style={{
              position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: 9,
              backgroundColor: '#FFD460', alignItems: 'center', justifyContent: 'center',
            }}>
              <Ionicons name="play" size={10} color="#1D2B3D" />
            </View>
          ) : null}
        </View>
      </View>

      <View className="mt-2 px-space-sm py-0.5 rounded-full"
        style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#1D2B3D1A' }}>
        <Text className="font-label-sm text-label-sm"
          style={{ color: state === 'locked' ? '#1D2B3D99' : '#1D2B3D', fontWeight: '700' }}
          numberOfLines={1}>
          {label}
        </Text>
      </View>
    </View>
  );

  if (locked) return <View accessibilityLabel={label}>{body}</View>;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label}
      accessibilityState={{ disabled: locked }} onPress={onPress} hitSlop={6}
      testID={testID ? `${testID}-pressable` : undefined}>
      {body}
    </Pressable>
  );
}

export default RoadmapNode;
```

- [ ] **Step 3: Run + Commit**

```bash
npx jest src/components/RoadmapNode.test.tsx
git add src/components/RoadmapNode.tsx src/components/RoadmapNode.test.tsx
git commit -m "feat(components): RoadmapNode (5 states with bevel shadows)"
```

### Task 13: `RoadmapPathSvg`

**Files:** Create `src/components/RoadmapPathSvg.tsx`

- [ ] **Step 1: Create**

```tsx
import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export interface RoadmapPathSvgProps {
  paths: ReadonlyArray<{
    id: string;
    d: string;
    color: string;
    trackColor?: string;
    width?: number;
    trackWidth?: number;
    dashed?: boolean;
    dashArray?: string;
  }>;
  width?: number;
  height?: number;
}

export function RoadmapPathSvg({ paths, width = 400, height = 600 }: RoadmapPathSvgProps) {
  const all = useMemo(() => paths, [paths]);
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFillObject, { zIndex: 0 }]}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" fill="none">
        {all.map(p => (
          <React.Fragment key={p.id}>
            <Path d={p.d} stroke={p.trackColor ?? '#DCE9FF'}
              strokeLinecap="round" strokeLinejoin="round" strokeWidth={p.trackWidth ?? 14} />
            <Path d={p.d} stroke={p.color}
              strokeLinecap="round" strokeLinejoin="round" strokeWidth={p.width ?? 6}
              strokeDasharray={p.dashed ? (p.dashArray ?? '4 8') : undefined} />
          </React.Fragment>
        ))}
      </Svg>
    </View>
  );
}

export default RoadmapPathSvg;
```

- [ ] **Step 2: Commit**

```bash
git add src/components/RoadmapPathSvg.tsx
git commit -m "feat(components): RoadmapPathSvg (serpentine connector)"
```

### Task 14: `ProgressBar`

**Files:** Create `src/components/ProgressBar.tsx`

- [ ] **Step 1: Create**

```tsx
import { View } from 'react-native';

export interface ProgressBarProps {
  value: number;
  fill?: string;
  track?: string;
  height?: number;
  inset?: number;
  testID?: string;
}

export function ProgressBar({
  value, fill = '#F07B3F', track = '#0003', height = 12, inset = 2, testID,
}: ProgressBarProps) {
  const v = Math.max(0, Math.min(1, value));
  return (
    <View testID={testID} style={{
      width: '100%', height, borderRadius: 999,
      backgroundColor: track, overflow: 'hidden',
      padding: inset, borderWidth: 1, borderColor: '#FFFFFF10',
    }}>
      <View style={{
        height: height - inset * 2, borderRadius: 999,
        backgroundColor: fill, width: `${v * 100}%`,
      }} />
    </View>
  );
}

export default ProgressBar;
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ProgressBar.tsx
git commit -m "feat(components): ProgressBar"
```

### Task 15: `UnitHeader`

**Files:** Create `src/components/UnitHeader.tsx`

- [ ] **Step 1: Create**

```tsx
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProgressBar } from './ProgressBar';

export interface UnitHeaderProps {
  unitNumber: number;
  unitNumberAr: string;
  titleEn: string;
  titleAr: string;
  iconName: keyof typeof Ionicons.glyphMap;
  progressDone: number;
  progressTotal: number;
}

export function UnitHeader({ unitNumber, unitNumberAr, titleEn, titleAr, iconName, progressDone, progressTotal }: UnitHeaderProps) {
  const pct = progressTotal > 0 ? progressDone / progressTotal : 0;
  return (
    <View className="rounded-2xl p-space-md mx-margin overflow-hidden"
      style={{ backgroundColor: '#2D4059',
        shadowColor: '#1A2636', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 1, shadowRadius: 0 }}>
      <View className="flex-row items-start justify-between">
        <View className="gap-0.5 flex-1">
          <View className="flex-row items-center gap-1.5">
            <Ionicons name="checkmark-circle" size={18} color="#FFD460" />
            <Text className="font-label-md text-label-md uppercase"
              style={{ color: '#FFD460', fontWeight: '800' }}>
              Unit {unitNumber} • {unitNumberAr}
            </Text>
          </View>
          <Text className="font-headline text-headline-lg text-white mt-0.5" style={{ fontWeight: '800' }}>{titleEn}</Text>
          <Text className="font-arabic text-body-md" style={{ color: '#FFFFFFE6', fontWeight: '700' }}>{titleAr}</Text>
        </View>
        <View className="w-12 h-12 rounded-2xl items-center justify-center"
          style={{ backgroundColor: '#FFFFFF1A', borderWidth: 1, borderColor: '#FFFFFF26' }}>
          <Ionicons name={iconName} size={28} color="#FFD460" />
        </View>
      </View>

      <View className="mt-4 pt-2 border-t" style={{ borderColor: '#FFFFFF1A' }}>
        <View className="flex-row items-center justify-between">
          <Text className="font-label-md text-label-md" style={{ color: '#FFFFFFE6' }}>
            Progress: {progressDone} of {progressTotal} Steps
          </Text>
          <Text className="font-label-md text-label-md" style={{ color: '#FFD460', fontWeight: '800' }}>
            {Math.round(pct * 100)}%
          </Text>
        </View>
        <View className="mt-1.5">
          <ProgressBar value={pct} fill="#F07B3F" track="#0003" />
        </View>
      </View>
    </View>
  );
}

export default UnitHeader;
```

- [ ] **Step 2: Commit**

```bash
git add src/components/UnitHeader.tsx
git commit -m "feat(components): UnitHeader (navy 3D banner with bilingual title)"
```

### Task 16: `ActiveDeedSheet`

**Files:** Create `src/components/ActiveDeedSheet.tsx`

- [ ] **Step 1: Create**

```tsx
import { Modal, Pressable, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button3D } from './Button3D';

export interface ActiveDeedSheetProps {
  visible: boolean;
  deedTitle: string;
  deedTitleAr?: string;
  iconName: keyof typeof Ionicons.glyphMap;
  rewardXp: number;
  rewardLabel?: string;
  hadith?: string;
  onClose: () => void;
  onComplete: () => void;
}

export function ActiveDeedSheet({
  visible, deedTitle, deedTitleAr, iconName, rewardXp, rewardLabel,
  hadith, onClose, onComplete,
}: ActiveDeedSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable accessibilityLabel="close-overlay" onPress={onClose}
        style={{ flex: 1, backgroundColor: '#2D405988', justifyContent: 'flex-end', padding: 16 }}>
        <Pressable onPress={() => {}}
          style={{ width: '100%', maxWidth: 380, alignSelf: 'center', backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20 }}>
          <Pressable accessibilityLabel="close" onPress={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full items-center justify-center"
            style={{ backgroundColor: '#EFF4FF' }}>
            <Ionicons name="close" size={20} color="#2D4059" />
          </Pressable>

          <View className="flex-row items-center gap-3">
            <View className="w-14 h-14 rounded-2xl items-center justify-center"
              style={{ backgroundColor: '#EA5455',
                shadowColor: '#C83E40', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 1, shadowRadius: 0 }}>
              <Ionicons name={iconName} size={32} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="font-label-sm text-label-sm uppercase" style={{ color: '#EA5455', fontWeight: '800' }}>
                Today's Recommended Deed
              </Text>
              <Text className="font-headline text-headline-md" style={{ color: '#1D2B3D' }}>{deedTitle}</Text>
              {deedTitleAr ? (
                <Text className="font-arabic text-body-sm" style={{ color: '#5B6E85' }} dir="auto">{deedTitleAr}</Text>
              ) : null}
            </View>
          </View>

          <View className="mt-4 p-3 rounded-xl flex-row items-center justify-between" style={{ backgroundColor: '#EFF4FF' }}>
            <View className="flex-row items-center gap-2">
              <Ionicons name="flash" size={20} color="#F07B3F" />
              <Text className="font-label-md text-label-md" style={{ color: '#1D2B3D', fontWeight: '800' }}>Reward</Text>
            </View>
            <Text className="font-label-md text-label-md px-2.5 py-0.5 rounded-full"
              style={{ backgroundColor: '#FFD460', fontWeight: '700' }}>
              +{rewardXp} XP{rewardLabel ? ` • ${rewardLabel}` : ''}
            </Text>
          </View>

          {hadith ? (
            <Text className="mt-3 font-body text-body-md" style={{ color: '#1D2B3DCC', lineHeight: 22 }}>{hadith}</Text>
          ) : null}

          <View className="mt-5">
            <Button3D label="Mark as Done" variant="coral" onPress={onComplete}
              leadingIcon={<Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default ActiveDeedSheet;
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ActiveDeedSheet.tsx
git commit -m "feat(components): ActiveDeedSheet (slide-up bottom sheet)"
```

### Task 17: `RewardChestModal` + `Toast` + test

**Files:** Create `src/components/RewardChestModal.tsx`, `Toast.tsx`, `Toast.test.tsx`

- [ ] **Step 1: Create `RewardChestModal.tsx`**

```tsx
import { Modal, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button3D } from './Button3D';

export interface RewardChestModalProps {
  visible: boolean;
  bonusXp: number;
  hadith?: string;
  onClose: () => void;
}

export function RewardChestModal({ visible, bonusXp, hadith, onClose }: RewardChestModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center p-4" style={{ backgroundColor: '#2D405988' }}>
        <View className="w-full max-w-xs items-center p-5 rounded-3xl" style={{ backgroundColor: '#FFFFFF' }}>
          <View className="w-16 h-16 rounded-full items-center justify-center mb-3"
            style={{ backgroundColor: '#FFD460',
              shadowColor: '#D4A838', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 0 }}>
            <Ionicons name="gift" size={36} color="#1D2B3D" />
          </View>
          <Text className="font-headline text-headline-md" style={{ color: '#1D2B3D' }}>Daily Barakah Gift!</Text>
          <Text className="font-body text-body-md text-center mt-1" style={{ color: '#5B6E85' }}>
            You maintained a streak. Here is your daily motivational gift:
          </Text>
          {hadith ? (
            <View className="mt-3 p-3 w-full rounded-2xl" style={{ backgroundColor: '#EFF4FF' }}>
              <Text className="font-headline text-headline-sm" style={{ color: '#F07B3F', fontWeight: '800' }}>+{bonusXp} Bonus XP</Text>
              <Text className="font-body text-body-sm mt-0.5" style={{ color: '#5B6E85' }}>{hadith}</Text>
            </View>
          ) : null}
          <View className="mt-4 w-full">
            <Button3D label="Alhamdulillah!" variant="navy" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default RewardChestModal;
```

- [ ] **Step 2: Create `Toast.test.tsx`**

```tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import { Toast } from './Toast';

describe('Toast', () => {
  it('renders message when visible', () => {
    const { getByText } = render(<Toast visible message="Saved" onHide={() => {}} />);
    expect(getByText('Saved')).toBeTruthy();
  });
});
```

- [ ] **Step 3: Create `Toast.tsx`**

```tsx
import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface ToastProps {
  visible: boolean;
  message: string;
  onHide: () => void;
  durationMs?: number;
}

export function Toast({ visible, message, onHide, durationMs = 3000 }: ToastProps) {
  useEffect(() => {
    if (!visible) return;
    const id = setTimeout(onHide, durationMs);
    return () => clearTimeout(id);
  }, [visible, durationMs, onHide]);

  return (
    <View pointerEvents="none" style={{
      position: 'absolute', bottom: 80, left: 0, right: 0, alignItems: 'center', zIndex: 50,
      opacity: visible ? 1 : 0, transform: [{ translateY: visible ? 0 : 16 }],
    }}>
      <View className="flex-row items-center gap-2 max-w-xs px-4 py-2.5 rounded-full"
        style={{ backgroundColor: '#1D2B3D', borderWidth: 1, borderColor: '#FFFFFF1A' }}>
        <Ionicons name="information-circle" size={18} color="#FFD460" />
        <Text className="font-label-md text-label-md text-white" style={{ fontWeight: '700' }}>{message}</Text>
      </View>
    </View>
  );
}

export default Toast;
```

- [ ] **Step 4: Run + Commit**

```bash
npx jest src/components/Toast.test.tsx
git add src/components/RewardChestModal.tsx src/components/Toast.tsx src/components/Toast.test.tsx
git commit -m "feat(components): RewardChestModal + Toast"
```

---

## Phase 3 — Roadmap screen

### Task 18: `useRoadmapUnits` adapter hook

**Files:** Create `src/gamification/useRoadmapUnits.ts`

- [ ] **Step 1: Create the adapter that maps existing data into the Stitch shape**

```ts
import { useMemo } from 'react';
import { useUnits } from './useUnits';
import type { UnitSummary } from './UnitSummary';

export function useRoadmapUnits(): { units: UnitSummary[]; isLoading: boolean; error: Error | null } {
  const { data, isLoading, error } = useUnits();
  return useMemo(() => {
    if (!data) return { units: [], isLoading, error: error ?? null };
    const units: UnitSummary[] = data.map((u, idx) => ({
      id: u.id,
      titleEn: u.titleEn,
      titleAr: u.titleAr,
      iconName: (u.iconName ?? 'heart-outline') as any,
      completed: u.completed ?? 0,
      total: u.total ?? u.nodes.length,
      nodes: u.nodes.map((n, i) => ({
        id: n.id,
        label: n.title,
        labelAr: n.titleAr ?? '',
        state: n.state,
        xp: n.xp,
        icon: n.icon,
        hadith: n.hadith,
      })),
    }));
    return { units, isLoading, error: error ?? null };
  }, [data, isLoading, error]);
}
```

- [ ] **Step 2: Create `src/gamification/UnitSummary.ts`** (types only)

```ts
export type NodeState = 'mastered' | 'completed' | 'available' | 'locked' | 'skipped';

export interface UnitNodeSummary {
  id: number;
  label: string;
  labelAr?: string;
  state: NodeState;
  xp: number;
  icon: string;
  hadith?: string;
}

export interface UnitSummary {
  id: number;
  titleEn: string;
  titleAr: string;
  iconName: keyof typeof import('@expo/vector-icons').Ionicons.glyphMap;
  completed: number;
  total: number;
  nodes: UnitNodeSummary[];
}
```

- [ ] **Step 3: Commit**

```bash
git add src/gamification/useRoadmapUnits.ts src/gamification/UnitSummary.ts
git commit -m "feat(gamification): useRoadmapUnits adapter to new UnitSummary shape"
```

### Task 19: Rebuild `app/(tabs)/index.tsx`

**Files:** Create `app/(tabs)/_RoadmapBody.tsx`; modify `app/(tabs)/index.tsx`

- [ ] **Step 1: Create `_RoadmapBody.tsx`**

```tsx
import { useCallback, useState } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { AppTopBar } from '@/components/AppTopBar';
import { RoadmapNode } from '@/components/RoadmapNode';
import { RoadmapPathSvg } from '@/components/RoadmapPathSvg';
import { UnitHeader } from '@/components/UnitHeader';
import { ActiveDeedSheet } from '@/components/ActiveDeedSheet';
import { RewardChestModal } from '@/components/RewardChestModal';
import { Toast } from '@/components/Toast';
import { useColors } from '@/theme/tokens';
import { useRoadmapUnits } from '@/gamification/useRoadmapUnits';
import type { UnitNodeSummary } from '@/gamification/UnitSummary';

export function RoadmapBody() {
  const router = useRouter();
  const colors = useColors();
  const { t } = useTranslation();
  const { units, isLoading } = useRoadmapUnits();
  const [sheet, setSheet] = useState<UnitNodeSummary | null>(null);
  const [chestOpen, setChestOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const onNodePress = useCallback((node: UnitNodeSummary) => setSheet(node), []);
  const onComplete = useCallback(() => {
    setSheet(null);
    setToast(t('home.deedCompleted'));
  }, [t]);

  const MAIN_PATH = `M 200 40 C 270 50, 290 90, 275 130 C 255 175, 140 180, 125 220 C 110 260, 160 285, 200 300`;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppTopBar streakDays={7} xp={340} savedCount={4}
        onSettings={() => router.push('/settings')}
        onToggleLocale={() => router.push('/settings')}
        onAvatar={() => router.push('/bookmarks')}
        rightSlot={null} />

      <ScrollView contentContainerStyle={{ paddingTop: 80, paddingBottom: 96 }} className="bg-bg">
        {/* Level Pill Card */}
        <View className="mx-margin mt-3 mb-2 p-space-md rounded-2xl"
          style={{ backgroundColor: colors.surfaceLow, borderWidth: 1, borderColor: '#1D2B3D0D' }}>
          <View className="flex-row items-center justify-between gap-space-sm">
            <View className="flex-row items-center gap-3">
              <View className="w-11 h-11 rounded-xl items-center justify-center"
                style={{ backgroundColor: '#FFD460',
                  shadowColor: '#D4A838', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 1, shadowRadius: 0 }}>
                <Ionicons name="trophy" size={24} color="#1D2B3D" />
                <View className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#EA5455' }}>
                  <Text className="font-label-sm text-label-sm text-white" style={{ fontWeight: '700' }}>L3</Text>
                </View>
              </View>
              <View className="gap-0.5">
                <View className="flex-row items-center gap-1.5">
                  <Text className="font-headline text-headline-sm" style={{ color: '#1D2B3D' }}>Path of Barakah</Text>
                  <Text className="font-label-sm text-label-sm px-1.5 py-0.5 rounded-full"
                    style={{ color: '#F07B3F', backgroundColor: '#F07B3F26', fontWeight: '700' }}>Level 3</Text>
                </View>
                <Text className="font-body text-body-sm" style={{ color: '#5B6E85' }}>Daily Goal: 2 deeds remaining</Text>
              </View>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel="chest" onPress={() => setChestOpen(true)}
              className="w-10 h-10 rounded-xl items-center justify-center"
              style={{ backgroundColor: '#FFD46033', borderWidth: 1, borderColor: '#FFD46080' }}>
              <Ionicons name="gift" size={24} color="#F07B3F" />
              <View className="absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#EA5455' }} />
            </Pressable>
          </View>
        </View>

        {isLoading ? null : units.map((unit, idx) => (
          <View key={unit.id} className="mt-2">
            <UnitHeader
              unitNumber={idx + 1}
              unitNumberAr={`الوحدة ${toArabicNum(idx + 1)}`}
              titleEn={unit.titleEn}
              titleAr={unit.titleAr}
              iconName={unit.iconName}
              progressDone={unit.completed}
              progressTotal={unit.total}
            />
            <View style={{ position: 'relative', minHeight: 480, paddingVertical: 24 }}>
              <RoadmapPathSvg
                width={400} height={580}
                paths={[
                  { id: 'track', d: MAIN_PATH, color: 'transparent', trackColor: '#DCE9FF', width: 0, trackWidth: 14 },
                  { id: 'main', d: MAIN_PATH, color: '#F07B3F', width: 6 },
                ]} />
              {unit.nodes.map((n, i) => (
                <View key={n.id} style={{
                  position: 'absolute',
                  left: ['28%', '72%', '26%', '50%', '50%'][i % 5],
                  top: 16 + i * 96,
                  transform: [{ translateX: -50 }],
                }}>
                  <RoadmapNode state={n.state} label={n.label} xp={n.xp}
                    onPress={() => onNodePress(n)} testID={`unit-${unit.id}-node-${i}`} />
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      <ActiveDeedSheet
        visible={!!sheet}
        deedTitle={sheet?.label ?? ''}
        deedTitleAr={sheet?.labelAr ?? ''}
        iconName={(sheet?.icon as any) ?? 'chatbox'}
        rewardXp={sheet?.xp ?? 15}
        rewardLabel="1 Barakah Gem"
        hadith={sheet?.hadith ?? '"The supplication of a Muslim for his brother in his absence will certainly be answered." — Sahih Muslim'}
        onClose={() => setSheet(null)}
        onComplete={onComplete}
      />
      <RewardChestModal visible={chestOpen} bonusXp={25}
        hadith="The most beloved deed to Allah is the most regular and constant."
        onClose={() => setChestOpen(false)} />
      <Toast visible={!!toast} message={toast ?? ''} onHide={() => setToast(null)} />
    </View>
  );
}

function toArabicNum(n: number): string {
  const m = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(n).split('').map(d => m[+d]).join('');
}
```

- [ ] **Step 2: Replace `app/(tabs)/index.tsx`**

```tsx
import { RoadmapBody } from './_RoadmapBody';
export default RoadmapBody;
```

- [ ] **Step 3: Add `home.deedCompleted` translation key**

In `src/i18n/en.json`:
```json
"home": {
  "title": "Roadmap",
  "streak": "{{days}}-day streak",
  "streak_unit": "days",
  "xpLevel": "Lvl {{level}}",
  "bookmarks": "My List",
  "language": "Language",
  "settings": "Settings",
  "deedCompleted": "Deed logged. MashaAllah!"
}
```

In `src/i18n/ar.json`:
```json
"home": {
  "title": "الخارطة",
  "streak": "سلسلة {{days}} أيام",
  "streak_unit": "أيام",
  "xpLevel": "المستوى {{level}}",
  "bookmarks": "قائمتي",
  "language": "اللغة",
  "settings": "الإعدادات",
  "deedCompleted": "تم تسجيل العمل. ما شاء الله!"
}
```

- [ ] **Step 4: Run typecheck + Commit**

```bash
npm run typecheck
git add app/(tabs)/index.tsx app/(tabs)/_RoadmapBody.tsx src/i18n/en.json src/i18n/ar.json
git commit -m "feat(roadmap): rebuild Roadmap screen with coral/navy/tangerine layout"
```

---

## Phase 4 — Catalog

### Task 20: `CategoryChip`

**Files:** Create `src/components/CategoryChip.tsx`

- [ ] **Step 1: Create**

```tsx
import { Pressable, Text, View } from 'react-native';

export interface CategoryChipProps {
  label: string;
  count?: number | string;
  progress?: number;
  progressColor?: string;
  active?: boolean;
  onPress?: () => void;
  leadingIcon?: React.ReactNode;
}

export function CategoryChip({ label, count, progress, progressColor = '#F07B3F', active, onPress, leadingIcon }: CategoryChipProps) {
  const bg = active ? '#EA5455' : '#DCE9FF';
  const fg = active ? '#FFFFFF' : '#1D2B3D';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!active }}
      onPress={onPress}
      className="flex-row items-center gap-2 h-10 px-space-md rounded-full"
      style={{
        backgroundColor: bg,
        shadowColor: active ? '#C83E40' : 'transparent',
        shadowOffset: { width: 0, height: 3 }, shadowOpacity: active ? 1 : 0, shadowRadius: 0,
      }}>
      {progress != null ? (
        <View className="w-4 h-4 relative items-center justify-center">
          <View className="w-4 h-4 rounded-full border-2" style={{ borderColor: '#FFFFFF40' }} />
          <View style={{
            position: 'absolute', top: 0, left: 0, width: 16, height: 16, borderRadius: 8,
            borderWidth: 2, borderColor: progressColor, borderTopColor: 'transparent',
            transform: [{ rotate: `${(progress ?? 0) * 360}deg` }],
          }} />
        </View>
      ) : null}
      {leadingIcon}
      <Text className="font-label-md text-label-md" style={{ color: fg, fontWeight: '800' }} numberOfLines={1}>
        {label}
      </Text>
      {count != null ? (
        <Text className="font-label-sm text-label-sm" style={{ color: active ? '#FFFFFFCC' : '#1D2B3DBB', fontWeight: '700' }}>
          {count}
        </Text>
      ) : null}
    </Pressable>
  );
}

export default CategoryChip;
```

- [ ] **Step 2: Commit**

```bash
git add src/components/CategoryChip.tsx
git commit -m "feat(components): CategoryChip"
```

### Task 21: `CatalogDeedCard` + test

**Files:** Create `src/components/CatalogDeedCard.tsx`, `CatalogDeedCard.test.tsx`

- [ ] **Step 1: Test**

```tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { CatalogDeedCard } from './CatalogDeedCard';
// paste test mock snippet
const wrap = (c: React.ReactNode) => React.createElement(ThemeProvider, null, c);

describe('CatalogDeedCard', () => {
  it('renders mastered card', () => {
    const { getByText } = render(wrap(
      <CatalogDeedCard title="Smile" titleAr="تبسم" status="mastered"
        statusLabel="Mastered (12x)" xp="+10 XP • Easy" onBookmark={() => {}} />
    ));
    expect(getByText('Smile')).toBeTruthy();
    expect(getByText('تبسم')).toBeTruthy();
  });

  it('renders locked card', () => {
    const { getByText } = render(wrap(
      <CatalogDeedCard title="Plant" status="locked" statusLabel="Unlocks at Lvl 5" xp="+40 XP" />
    ));
    expect(getByText('Plant')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Create `CatalogDeedCard.tsx`**

```tsx
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/theme/tokens';

export type CatalogStatus = 'mastered' | 'completed' | 'available' | 'locked' | 'skipped';

export interface CatalogDeedCardProps {
  title: string;
  titleAr?: string;
  status: CatalogStatus;
  statusLabel: string;
  xp: string;
  onPress?: () => void;
  onBookmark?: () => void;
  onHide?: () => void;
}

const STRIPE = {
  mastered: '#EA5455', completed: '#F07B3F', available: '#FFD460',
  locked: '#E1BFBC', skipped: 'transparent',
} as const;

const PILL_BG = {
  mastered: '#EA545526', completed: '#F07B3F26', available: '#FFD46033',
  locked: '#D3E4FE', skipped: '#DCE9FF',
} as const;

const PILL_FG = {
  mastered: '#EA5455', completed: '#F07B3F', available: '#1D2B3D',
  locked: '#1D2B3DBB', skipped: '#5B6E85',
} as const;

export function CatalogDeedCard({ title, titleAr, status, statusLabel, xp, onPress, onBookmark, onHide }: CatalogDeedCardProps) {
  const colors = useColors();
  const locked = status === 'locked';
  const skipped = status === 'skipped';

  const stripe = (
    <View style={{
      width: 6, alignSelf: 'stretch',
      borderTopRightRadius: 12, borderBottomRightRadius: 12,
      backgroundColor: STRIPE[status],
    }} />
  );

  const inner = (
    <View className="flex-1 flex-row items-center justify-between p-space-sm"
      style={{ backgroundColor: skipped ? colors.surface : colors.surfaceLowest, opacity: locked ? 0.85 : 1 }}>
      <View className="flex-1 flex-row items-center gap-space-sm min-w-0">
        <View className="flex-1 min-w-0">
          <View className="flex-row items-center gap-2">
            <View className="px-1.5 py-0.5 rounded-full" style={{ backgroundColor: PILL_BG[status] }}>
              <Text className="font-label-sm text-label-sm" style={{ color: PILL_FG[status], fontWeight: '800' }}>{statusLabel}</Text>
            </View>
            <Text className="font-label-sm text-label-sm" style={{ color: colors.outline }}>{xp}</Text>
          </View>
          <Text className="font-body-lg text-body-lg mt-0.5" style={{ color: colors.text, fontWeight: '800' }} numberOfLines={1}>{title}</Text>
          {titleAr ? (
            <Text className="font-arabic text-body-sm" style={{ color: colors.textMuted }} dir="auto" numberOfLines={1}>{titleAr}</Text>
          ) : null}
        </View>
      </View>

      <View className="flex-row items-center gap-1">
        {skipped ? (
          <Pressable accessibilityRole="button" accessibilityLabel="restore" onPress={onPress}
            className="h-8 px-space-md rounded-full items-center justify-center"
            style={{ backgroundColor: '#D3E4FE' }}>
            <Text className="font-label-sm text-label-sm" style={{ color: '#EA5455', fontWeight: '800' }}>Restore</Text>
          </Pressable>
        ) : (
          <>
            <Pressable accessibilityRole="button" accessibilityLabel="bookmark" onPress={onBookmark}
              disabled={locked} hitSlop={8} className="w-9 h-9 rounded-full items-center justify-center">
              <Ionicons name="heart" size={22} color={locked ? '#5B6E8555' : '#EA5455'} />
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="hide" onPress={onHide}
              hitSlop={8} className="w-9 h-9 rounded-full items-center justify-center">
              <Ionicons name={locked ? 'lock-closed' : 'eye-outline'} size={20}
                color={locked ? '#5B6E8555' : '#5B6E85'} />
            </Pressable>
          </>
        )}
      </View>
    </View>
  );

  const card = (
    <View className="flex-row items-stretch rounded-xl overflow-hidden min-h-22"
      style={{ backgroundColor: colors.surfaceLowest, borderWidth: 1, borderColor: colors.border }}>
      {stripe}
      {inner}
    </View>
  );

  if (skipped) return card;
  return (
    <Pressable accessibilityRole="button" onPress={onPress} testID="catalog-deed-card">
      {card}
    </Pressable>
  );
}

export default CatalogDeedCard;
```

- [ ] **Step 3: Run + Commit**

```bash
npx jest src/components/CatalogDeedCard.test.tsx
git add src/components/CatalogDeedCard.tsx src/components/CatalogDeedCard.test.tsx
git commit -m "feat(components): CatalogDeedCard (stripe-coded 5 statuses)"
```

### Task 22: Rebuild `app/(tabs)/catalog.tsx`

**Files:** Modify `app/(tabs)/catalog.tsx`

- [ ] **Step 1: Replace the file**

```tsx
import { useCallback, useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppTopBar } from '@/components/AppTopBar';
import { CategoryChip } from '@/components/CategoryChip';
import { CatalogDeedCard, type CatalogStatus } from '@/components/CatalogDeedCard';
import { useColors } from '@/theme/tokens';
import { useCategories } from '@/gamification/useCategories';
import { useDeeds } from '@/repos/deedsRepo';

export default function CatalogScreen() {
  const router = useRouter();
  const colors = useColors();
  const { t } = useTranslation();
  const { categories } = useCategories();
  const { deeds } = useDeeds();
  const [q, setQ] = useState('');

  const onCardPress = useCallback((id: number) => router.push(`/deed/${id}` as any), [router]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppTopBar streakDays={7} xp={340} savedCount={4}
        onSettings={() => router.push('/settings')}
        onToggleLocale={() => router.push('/settings')}
        onAvatar={() => router.push('/bookmarks')} />

      <ScrollView contentContainerStyle={{ paddingTop: 80, paddingBottom: 96 }} keyboardShouldPersistTaps="handled">
        <View className="px-gutter pt-3 pb-2 gap-space-sm">
          <View className="flex-row items-center w-full relative">
            <Ionicons name="search" size={22} color={colors.outline}
              style={{ position: 'absolute', left: 12, zIndex: 1 }} />
            <TextInput value={q} onChangeText={setQ}
              placeholder="Search 150+ deeds (e.g. smile, water, family)..."
              placeholderTextColor={colors.outline}
              className="w-full h-12 pl-11 pr-11 rounded-xl bg-surface"
              style={{ color: colors.text }} />
          </View>
          <View className="flex-row items-center justify-between px-1">
            <View className="flex-row items-center gap-1.5">
              <View className="w-2 h-2 rounded-full" style={{ backgroundColor: '#EA5455' }} />
              <Text className="font-label-md text-label-md" style={{ color: '#1D2B3DCC' }}>
                Showing {deeds.length} of 152 deeds
              </Text>
            </View>
            <Pressable accessibilityRole="button" className="flex-row items-center gap-1">
              <Ionicons name="options" size={16} color="#EA5455" />
              <Text className="font-label-md text-label-md" style={{ color: '#EA5455', fontWeight: '800' }}>Filters</Text>
            </Pressable>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingVertical: 4 }}>
          <CategoryChip label="All Deeds" count={152} active onPress={() => {}} />
          {categories.map((c: any, i: number) => (
            <CategoryChip key={c.id}
              label={c.titleEn}
              count={`${c.completed ?? 0}/${c.total ?? 0}`}
              progress={(c.completed ?? 0) / Math.max(1, c.total ?? 1)}
              progressColor={i % 2 === 0 ? '#F07B3F' : '#EA5455'}
              onPress={() => {}} />
          ))}
        </ScrollView>

        {/* Active realm banner */}
        <View className="mx-gutter mt-space-md">
          <View className="rounded-2xl p-space-md"
            style={{ backgroundColor: colors.surfaceLow, borderWidth: 1, borderColor: '#1D2B3D0D' }}>
            <View className="flex-row items-start justify-between gap-space-sm">
              <View className="flex-1 gap-1">
                <View className="flex-row items-center gap-1.5">
                  <Ionicons name="star" size={16} color="#F07B3F" />
                  <Text className="font-label-sm text-label-sm uppercase tracking-wider"
                    style={{ color: '#F07B3F', fontWeight: '800' }}>Active Realm</Text>
                </View>
                <Text className="font-headline text-headline-sm" style={{ color: '#1D2B3D' }}>Everyday Smiles & Kind Words</Text>
                <Text className="font-arabic text-body-sm" dir="auto">الكلمة الطيبة والمعنوية</Text>
              </View>
              <View className="w-14 h-14 rounded-2xl items-center justify-center"
                style={{ backgroundColor: '#FFD460',
                  shadowColor: '#D8A82D', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 1, shadowRadius: 0 }}>
                <Ionicons name="trophy" size={28} color="#1D2B3D" />
              </View>
            </View>
            <View className="mt-space-md gap-1.5">
              <View className="flex-row justify-between">
                <Text className="font-label-sm text-label-sm" style={{ color: '#1D2B3D99' }}>Category Mastery Level 2</Text>
                <Text className="font-label-sm text-label-sm" style={{ color: '#F07B3F', fontWeight: '800' }}>50% (6 / 12)</Text>
              </View>
              <View className="h-3 w-full rounded-full p-0.5" style={{ backgroundColor: colors.surfaceHighest }}>
                <View className="h-full rounded-full" style={{ backgroundColor: '#F07B3F', width: '50%' }} />
              </View>
            </View>
          </View>
        </View>

        <View className="px-gutter mt-space-md gap-space-sm">
          {deeds.map((d: any) => (
            <CatalogDeedCard
              key={d.id}
              title={d.title}
              titleAr={d.titleAr}
              status={mapStatus(d.state) as CatalogStatus}
              statusLabel={d.statusLabel}
              xp={d.xpLabel}
              onPress={() => onCardPress(d.id)} />
          ))}
        </View>

        {q.length > 0 && deeds.length === 0 ? (
          <View className="mx-gutter mt-space-lg mb-2 items-center justify-center p-space-lg rounded-2xl"
            style={{ backgroundColor: colors.surfaceLow, borderWidth: 1, borderColor: '#1D2B3D0D' }}>
            <View className="w-16 h-16 rounded-full items-center justify-center mb-space-sm"
              style={{ backgroundColor: colors.surfaceHighest }}>
              <Ionicons name="search" size={32} color="#EA5455" />
            </View>
            <Text className="font-headline text-headline-sm" style={{ color: '#1D2B3D' }}>No deeds found for your search</Text>
            <Text className="font-body text-body-md text-center mt-1 max-w-70" style={{ color: '#5B6E85' }}>
              Try adjusting keywords, exploring other realms, or clearing active filters.
            </Text>
            <Pressable accessibilityRole="button" onPress={() => setQ('')}
              className="mt-space-md h-10 px-space-lg rounded-xl items-center justify-center"
              style={{ backgroundColor: '#EA5455',
                shadowColor: '#C83E40', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 1, shadowRadius: 0 }}>
              <Text className="font-label-md text-label-md text-white" style={{ fontWeight: '800' }}>Clear All Filters</Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

function mapStatus(s: string): CatalogStatus {
  if (s === 'mastered') return 'mastered';
  if (s === 'completed') return 'completed';
  if (s === 'locked') return 'locked';
  if (s === 'skipped') return 'skipped';
  return 'available';
}
```

- [ ] **Step 2: Run typecheck + Commit**

```bash
npm run typecheck
git add app/(tabs)/catalog.tsx
git commit -m "feat(catalog): rebuild Catalog screen with chip/realm/cards"
```

---

End of Part 1. **Continue with `docs/superpowers/plans/2026-09-27-stitch-redesign-part2.md` for Phases 5–10.**
