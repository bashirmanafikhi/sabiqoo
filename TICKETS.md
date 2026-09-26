# SABIQOO — Tickets

> Canonical work breakdown for the phases defined in `SPEC.md`.
> Each ticket has a single owner outcome ("DONE when…") and a checkbox list of sub-tasks.
> Status legend: `[ ]` pending · `[~]` in progress · `[x]` done

---

## Phase 1 — Foundation & Design System

### P1-T01 — Bootstrap Expo project
**DONE when** `npx expo start` boots a blank app called `sabiqoo` with TypeScript strict mode.

- [ ] Run `npx create-expo-app sabiqoo --template default` (or init in current repo with Expo CLI)
- [ ] Add app.json `name: "Sabiqoo"`, `slug: "sabiqoo"`, `scheme: "sabiqoo"`
- [ ] Set `experiments.typedRoutes: true`
- [ ] Enable TS strict (`tsconfig.json` `"strict": true`, `"noUncheckedIndexedAccess": true`)
- [ ] Pin Expo SDK + verify `package.json` peer ranges match

### P1-T02 — Install core deps
**DONE when** `package.json` lists every dependency from SPEC §2 at compatible versions.

- [ ] `expo-router`, `react-native-screens`, `react-native-safe-area-context`, `react-native-gesture-handler`
- [ ] `nativewind`, `tailwindcss@^3`, `postcss`, `autoprefixer`
- [ ] `react-native-reanimated`, `react-native-svg`, `lottie-react-native`
- [ ] `expo-haptics`, `expo-av`, `expo-localization`, `expo-splash-screen`
- [ ] `expo-sqlite`, `drizzle-orm`, `drizzle-kit`, `better-sqlite3` (dev only, for migrations)
- [ ] `zustand`, `@react-native-async-storage/async-storage`
- [ ] `i18next`, `react-i18next`
- [ ] `@expo/vector-icons`
- [ ] Dev: `jest`, `@testing-library/react-native`, `jest-expo`, `typescript`, `eslint`, `prettier`

### P1-T03 — Configure NativeWind + theme tokens
**DONE when** `className="bg-bg text-text-primary dark:bg-bg"` renders correctly in light + dark.

- [ ] `tailwind.config.js` with `darkMode: 'class'`, `content: ['./app/**/*.{ts,tsx}','./src/**/*.{ts,tsx}']`
- [ ] Import SPEC §9.1 color tokens
- [ ] Wrap root in `<ThemeProvider>` that toggles root `dark` class
- [ ] Add `nativewind-env.d.ts` for `className` types
- [ ] Smoke test: button with `className="bg-bg dark:bg-bg"` swaps colors when mode flips

### P1-T04 — Localization scaffolding
**DONE when** `t('home.greeting')` returns Arabic by default and English when locale is `en`, including RTL flip.

- [ ] `src/i18n/index.ts` initializing i18next + `expo-localization`
- [ ] `src/i18n/ar.json`, `src/i18n/en.json` with sectioned keys (home, deed, catalog, history, settings, common)
- [ ] AsyncStorage key `app.locale` for overrides
- [ ] `<LocaleProvider>` calls `I18nManager.allowRTL(true)` + `forceRTL(isRTL)` before mount
- [ ] `scripts/check-i18n.ts` fails CI if `en.json` keys ⊉ `ar.json` keys (or vice versa, configurable)

### P1-T05 — ESLint + RTL enforcement
**DONE when** `npm run lint` flags `ml-4` / `text-right` in component files.

- [ ] Add `eslint`, `@typescript-eslint/*`, `eslint-plugin-react`, `eslint-plugin-react-native-a11y`
- [ ] Custom rule (or `no-restricted-syntax` config) banning `ml-*`, `mr-*`, `text-left`, `text-right`
- [ ] Prettier with `prettier-plugin-tailwindcss`

### P1-T06 — Drizzle schema + migrations
**DONE when** `drizzle-kit generate` produces a migration file containing every table from SPEC §4.

- [ ] `src/db/schema.ts` with `units`, `categories`, `deeds` (incl. `slug TEXT UNIQUE NOT NULL`), `user_logs`, `user_profile`
- [ ] `drizzle.config.ts` pointing at `expo-sqlite` `openDatabaseAsync` path
- [ ] Generate first migration; verify SQL matches SPEC §4.1
- [ ] Apply migration on app boot via a one-shot `runMigrations()` helper inside `app/_layout.tsx`

### P1-T07 — Seed data (7 categories + ~50 deeds)
**DONE when** fresh DB contains 7 categories and ≥ 50 deeds spanning all 7 categories.

- [ ] `scripts/seed.ts` inserting categories + units + deeds via `INSERT OR IGNORE` keyed by `slug`
- [ ] Translate the PRD's 30 example deeds into the bilingual `title_ar`/`title_en`/`description_ar`/`description_en` shape
- [ ] Top up to ≥ 50 by drafting 20+ more entries, balanced across categories
- [ ] `unit_id` and `branch_group` assigned such that roadmap groups are well-balanced

### P1-T08 — Repos layer
**DONE when** `deedsRepo.listByUnit(unitId)` returns typed `Deed[]` from SQLite.

- [ ] `src/repos/unitsRepo.ts`, `categoriesRepo.ts`, `deedsRepo.ts`, `logsRepo.ts`, `profileRepo.ts`
- [ ] One file per repo with typed `select`/`insert`/`update` functions only — no UI imports
- [ ] Unit tests with in-memory Drizzle SQLite for each repo

### P1-T09 — Zustand stores
**DONE when** `useThemeStore.getState().mode` returns the persisted value after a cold restart.

- [ ] `src/stores/themeStore.ts` (`mode: 'light'|'dark'|'system'`, `setMode`)
- [ ] `src/stores/localeStore.ts` (`locale`, `setLocale`)
- [ ] `src/stores/profileStore.ts` (mirror of `user_profile` for derived selectors; refetch on focus)

### P1-T10 — `BigButton3D`
**DONE when** button visibly depresses on press and fires haptic + onPress.

- [ ] `src/components/BigButton3D.tsx`
- [ ] `border-b-4` style + `active:translate-y-1` press animation
- [ ] `Pressable` with `Haptics.selectionAsync()` on press-in
- [ ] `accessibilityRole="button"`, `accessibilityLabel` from prop
- [ ] Variant prop: `primary` (brand-green), `secondary` (brand-blue), `ghost`
- [ ] RNTL snapshot in light + dark + AR/EN

### P1-T11 — App layout providers
**DONE when** app launches in a single second with no layout warnings.

- [ ] `app/_layout.tsx` with provider order: `GestureHandlerRootView → SafeAreaProvider → ThemeProvider → LocaleProvider → Stack`
- [ ] Custom splash screen via `expo-splash-screen`
- [ ] Pin DB path (single source of truth in `src/db/path.ts`)

### P1-T12 — Phase 1 demo build
**DONE when** an APK build installs and shows the seeded roadmap (nodes in correct states).

- [ ] Stub `app/index.tsx` rendering a placeholder roadmap list (real impl in Phase 2)
- [ ] `eas build --profile preview` produces a working APK

---

## Phase 2 — Core Screens

### P2-T01 — Roadmap `RoadmapPath` SVG layout
**DONE when** a curving, branching node path renders for Unit 1 with seeded deeds.

- [ ] `src/components/RoadmapPath.tsx` consuming `units`, `deeds`, `theme`
- [ ] Bezier curves between nodes drawn with `react-native-svg` `<Path>`
- [ ] Compute branch lanes from `deed.branch_group`; merge lanes at the next single node
- [ ] Reanimated pulse on `Available` nodes
- [ ] Snaps to scroll position via `Animated.ScrollView` page transitions

### P2-T02 — Node component + states
**DONE when** node color/icon matches each of `Locked` / `Available` / `Completed` / `Mastered`.

- [ ] `src/components/Node.tsx` with size by state
- [ ] Lock icon for `Locked`, pulsing ring for `Available`, gold star for `Completed`, flame overlay for `Mastered`
- [ ] Press navigates to `/deed/[id]`
- [ ] Tap-target min 44×44

### P2-T03 — Roadmap screen wiring
**DONE when** Roadmap screen shows correct unit, branch, and node state from DB.

- [ ] `app/index.tsx` queries `unitsRepo.list()` + `deedsRepo.listAll()`
- [ ] Compose `RoadmapPath` per unit; respect user unlock state (deed.unlocked_by dependency graph from JSON in repo, or simple linear-with-branch)
- [ ] Top bar with `<StreakBadge>` and `<XpBar>`

### P2-T04 — Unlock dependency graph
**DONE when** completing the last node of a branch unlocks the merge node.

- [ ] Define a `unlocks` relationship table or encode in seed JSON
- [ ] Repo function `deedsRepo.unlockedIds(profile)` returning deeds the user can attempt
- [ ] Unit tests covering branch-finish, parallel-unlock, and locked-merge cases

### P2-T05 — Challenge Detail — `Today` tab
**DONE when** completing a deed writes a `user_logs` row and updates XP+level.

- [ ] `app/deed/[id].tsx` with `<Tabs>` from `expo-router` (Today · History)
- [ ] `<QuantityStepper>` (min 1, max 50)
- [ ] Optional `<TextInput multiline>` for `note`
- [ ] `<BigButton3D label={t('deed.markCompleted', {xp})}/>`
- [ ] On submit: write log, update profile, navigate back, fire `<ConfettiOverlay>`

### P2-T06 — Challenge Detail — `History` tab
**DONE when** the History tab lists every prior log of that deed in reverse-chronological order.

- [ ] Query `logsRepo.listByDeed(id)`
- [ ] Group by `day_bucket` with sticky date headers
- [ ] Empty-state copy + illustration

### P2-T07 — Catalog screen
**DONE when** searching "الصدقة" / "charity" returns matching deeds and filter chips narrow results.

- [ ] `app/catalog/index.tsx` with `<TextInput>` search + `<FlatList>` of `<DeedCard>`
- [ ] `<CategoryChips>` horizontal scroll, multi-select toggle
- [ ] Locale-aware fuzzy match on title + description

### P2-T08 — History + analytics screen
**DONE when** the 30-day heatmap and category donut render with seeded log data.

- [ ] `app/history/index.tsx`
- [ ] Heatmap from `logsRepo.countByDay(30)`
- [ ] Donut from `logsRepo.countByCategory()`
- [ ] Reverse-chronological log list

### P2-T09 — Settings screen
**DONE when** changing theme/language persists across cold restart and re-renders app.

- [ ] `app/settings/index.tsx` with `<Picker>` for theme and locale
- [ ] Manual "Use a streak freeze" button (consumes one freeze)
- [ ] About section with version

### P2-T10 — Deep linking & shared element transitions
**DONE when** tapping a node via deep link `sabiqoo://deed/42` opens detail.

- [ ] `app.json` `scheme: "sabiqoo"`
- [ ] Expo Router typed routes enabled
- [ ] Shared-element transition (experimental flag) on detail open

### P2-T11 — Phase 2 demo build
**DONE when** all four primary screens demo without console errors in Preview APK.

- [ ] Manual smoke matrix recorded (see SPEC §11)
- [ ] `eas build --profile preview`

---

## Phase 3 — Gamification, Polish & Launch

### P3-T01 — XP engine
**DONE when** `xpEarned = deed.xp_reward * quantity * difficulty_multiplier` and level increments correctly.

- [ ] `src/gamification/xp.ts` pure function `computeXpEarned(deed, quantity)`
- [ ] `src/gamification/level.ts` `levelFromXp(xp)`, `xpIntoLevel(xp)`, `xpForLevel(n)`
- [ ] Unit tests for triangular curve and multi-level-ups

### P3-T02 — Streak engine
**DONE when** streak increments, freezes, breaks, and refills per SPEC §7.3.

- [ ] `src/gamification/streak.ts` pure function `nextStreakOnLog(profile, dayBucket)`
- [ ] Consumes freeze when applicable, increments streak, updates longest, refills
- [ ] Unit tests for: same-day, consecutive, missed-1-day-with-freeze, missed-2-days, refill day, freeze cap

### P3-T03 — GamificationProvider
**DONE when** the provider owns streak/XP updates and emits events to stores.

- [ ] `src/gamification/GamificationProvider.tsx`
- [ ] Hook `useLogDeed()` that handles all state mutations + emits events
- [ ] Debounced profile refresh after each log

### P3-T04 — Confetti / Lottie celebration overlay
**DONE when** completion shows a 1/2/3-star overlay scaled to XP and respects reduce-motion.

- [ ] `assets/animations/confetti.json` (Lottie)
- [ ] `src/components/ConfettiOverlay.tsx`
- [ ] Star count derived from XP per SPEC §7.4
- [ ] Reduce-motion fallback: brief banner

### P3-T05 — Haptics + sound
**DONE when** button press and completion fire the right feedback and the mute toggle works.

- [ ] `src/utils/haptics.ts` wrapping `expo-haptics` with safe fallbacks
- [ ] `assets/sounds/click.mp3`, `assets/sounds/chime.mp3`; `expo-av` player with debounce
- [ ] Settings toggle for sound

### P3-T06 — Accessibility audit
**DONE when** all Phase 1 + 2 components pass `eslint-plugin-react-native-a11y` and Lighthouse-style checks.

- [ ] Add labels to all icon-only buttons
- [ ] Verify reduce-motion path
- [ ] Tap-targets ≥ 44×44 audited

### P3-T07 — Contrast audit
**DONE when** `scripts/check-contrast.ts` passes for every token combination in light + dark.

- [ ] Pairwise contrast check (text on surface, brand on elevated, etc.) using WCAG 2.1 formulas
- [ ] Block CI on failures

### P3-T08 — Performance pass
**DONE when** Roadmap scroll at 60fps with 1k logs and 50 deeds.

- [ ] Memoize `Node` renders with React.memo
- [ ] Reanimated worklets for non-essential animations
- [ ] Confirm no `useEffect` re-fires during scroll

### P3-T09 — Production build pipeline
**DONE when** `eas build --profile production` produces signed AAB + IPA for store submission.

- [ ] `eas.json` profiles: `preview`, `production`, `ad-hoc`
- [ ] Configure iOS bundle id, Android package id, app icon set, adaptive icon, splash
- [ ] Privacy manifest (iOS), data safety form (Android) generated from SPEC §1 non-goals
- [ ] Submit checklist doc in `docs/launch.md`

### P3-T10 — Launch readiness review
**DONE when** README + store metadata are ready.

- [ ] Update README with screenshots, architecture diagram, dev/setup/test/build/run instructions
- [ ] Store screenshots in both AR and EN, light and dark, both stores
- [ ] Final stakeholder sign-off

---

## Cross-cutting Backlog (post-v1, not in scope)

- Cloud sync via Supabase / Firebase
- Friend feed / leaderboards
- Reminders (daily push) via `expo-notifications`
- Onboarding tutorial
- Charity org deep links (deeds → vetted orgs)
- Widget (iOS / Android)

---

_End of TICKETS.md_
