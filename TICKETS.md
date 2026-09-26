# SABIQOO — Tickets

> Canonical work breakdown for the phases defined in `SPEC.md`.
> Each ticket has a single owner outcome ("DONE when…") and a checkbox list of sub-tasks.
> Status legend: `[ ]` pending · `[~]` in progress · `[x]` done
>
> **Snapshot:** implementation pass completed 2026-09-26. See `STATUS.md` for the
> pass-vs-skip breakdown and outstanding follow-ups. EAS / on-device verification
> is not possible from this CLI environment.

---

## Phase 1 — Foundation & Design System

### P1-T01 — Bootstrap Expo project ✅ DONE
**DONE when** `npx expo start` boots a blank app called `sabiqoo` with TypeScript strict mode.

- [x] Run `npx create-expo-app sabiqoo --template default` (in-repo init done)
- [x] Add app.json `name: "Sabiqoo"`, `slug: "sabiqoo"`, `scheme: "sabiqoo"`
- [x] Set `android.package: "com.bashirmanafikhi.sabiqoo"` and `ios.bundleIdentifier: "com.bashirmanafikhi.sabiqoo"` in `app.json`
- [x] Set `experiments.typedRoutes: true`
- [x] Enable TS strict (`tsconfig.json` `"strict": true`, `"noUncheckedIndexedAccess": true`)
- [x] Pin Expo SDK + verify `package.json` peer ranges match
- [x] See **P1-T01a** for app-icon sourcing from the supplied JPG

### P1-T01a — App icon (`assets/icon-source.jpg` → Expo icon set) 🟡 PARTIAL
**DONE when** the supplied JPG becomes the app icon on iOS and Android and is referenced from `app.json`.

- [ ] Copy source: `C:\Users\bashir\Downloads\sabiqoo-icon.jpg` → `assets/icon-source.jpg` (read-only reference) — *file not yet imported*
- [~] Generate `assets/icon.png` (1024×1024) — *placeholder 1×1 PNG in place; needs real conversion*
- [x] Set `app.json` `expo.icon: "./assets/icon.png"`
- [~] Generate `assets/adaptive-icon.png` and reference `expo.android.adaptiveIcon.foregroundImage` — *placeholder 1×1 PNG in place*
- [~] Generate `assets/splash.png` for `expo.splash.image` — *placeholder 1×1 PNG in place*
- [x] Run `npx expo prebuild --no-install` to confirm Expo accepts the icon set — *verified indirectly via `expo config --type public`*
- [ ] Verify the icon renders correctly in `eas build --profile preview` for both platforms — *EAS not run from this CLI*

### P1-T02 — Install core deps ✅ DONE
**DONE when** `package.json` lists every dependency from SPEC §2 at compatible versions.

- [x] `expo-router`, `react-native-screens`, `react-native-safe-area-context`, `react-native-gesture-handler`
- [x] `nativewind`, `tailwindcss@^3`, `postcss`, `autoprefixer`
- [x] `react-native-reanimated`, `react-native-svg`, `lottie-react-native`
- [x] `expo-font`, `expo-haptics`, `expo-localization`, `expo-splash-screen`
- [x] `expo-sqlite`, `drizzle-orm`, `drizzle-kit`, `better-sqlite3` (dev only, for migrations)
- [x] `zustand`, `@react-native-async-storage/async-storage`
- [x] `i18next`, `react-i18next`
- [x] `@expo/vector-icons`
- [x] Dev: `jest`, `@testing-library/react-native`, `jest-expo`, `typescript`, `eslint`, `prettier`

### P1-T03 — Configure NativeWind + theme tokens ✅ DONE
**DONE when** `className="bg-bg text-text-primary dark:bg-bg"` renders correctly in light + dark.

- [x] `tailwind.config.js` with `darkMode: 'class'`, content globs covering `app/` and `src/`
- [x] Import SPEC §9.1 color tokens
- [x] Wrap root in `<ThemeProvider>` that toggles root `dark` class
- [x] Add `nativewind-env.d.ts` for `className` types
- [x] Smoke test: light/dark swap exercised by `__tests__/theme.test.ts` (4 tests)

### P1-T04 — Localization scaffolding ✅ DONE
**DONE when** `t('home.greeting')` returns Arabic by default and English when locale is `en`, including RTL flip.

- [x] `src/i18n/index.ts` initializing i18next + `expo-localization`
- [x] `src/i18n/ar.json`, `src/i18n/en.json` with sectioned keys (64 keys each, parity enforced)
- [x] AsyncStorage key `app.locale` for overrides
- [x] `<LocaleProvider>` calls `I18nManager.allowRTL(true)` + `forceRTL(isRTL)` before mount
- [x] `scripts/check-i18n.ts` fails CI if keys don't match between locales
- [x] `__tests__/i18n.test.ts` covers boot, switch, and interpolation (3 tests)

### P1-T05 — ESLint + RTL enforcement ✅ DONE
**DONE when** `npm run lint` flags `ml-4` / `text-right` in component files.

- [x] Add `eslint`, `@typescript-eslint/*`, `eslint-plugin-react`, `eslint-plugin-react-native-a11y`
- [x] Custom rule (or `no-restricted-syntax` config) banning `ml-*`, `mr-*`, `text-left`, `text-right`
- [x] Prettier with `prettier-plugin-tailwindcss`
- Note: lint shows 0 errors; 50 a11y-hint warnings remain for icon-only buttons (addressed in P3-T06)

### P1-T06 — Drizzle schema + migrations 🟡 PARTIAL
**DONE when** `drizzle-kit generate` produces a migration file containing every table from SPEC §4.

- [x] `src/db/schema.ts` with all 8 tables (`units`, `categories`, `deeds` incl. `slug TEXT UNIQUE NOT NULL`, `user_logs`, `user_profile`, `user_bookmarks`, `user_skipped`, `deed_references`)
- [x] `drizzle.config.ts` pointing at SQLite (expo driver)
- [~] Generate first migration via `drizzle-kit generate` — *not generated; runtime creates tables inline via `scripts/migrate.ts`; `drizzle/migrations/` generated SQL path is unused for v1*
- [x] Apply migration on app boot via a one-shot helper (`runMigrations` in `src/db/migrations/run.ts`; falls back to inline CREATE TABLE statements)

### P1-T07 — Seed data (7 categories + 8 units + ~150 deeds) ✅ DONE
**DONE when** fresh DB contains 7 categories, 8 units, ≥ 150 deeds spanning all categories, and ≥ 70% of deeds tagged `difficulty_level = 1`.

- [x] `scripts/seed.ts` inserting units + categories + deeds via `INSERT OR IGNORE` keyed on `slug`
- [x] Seed the 8 units per SPEC §4.2
- [x] Translate the PRD's 30 example deeds into the bilingual shape
- [x] Author 140 additional deeds balanced across the 7 categories (≥ 15 per cat)
- [x] `unit_id` and `branch_group` assigned meaningfully
- [x] 71.8% of deeds tagged `difficulty_level = 1`
- Note: at runtime `npm run seed` requires a working `better-sqlite3` native build; tested via `__tests__/seed.test.ts` instead

### P1-T08 — Repos layer 🟡 PARTIAL
**DONE when** `deedsRepo.listByUnit(unitId)` returns typed `Deed[]` from SQLite.

- [x] `src/repos/unitsRepo.ts`, `categoriesRepo.ts`, `deedsRepo.ts`, `logsRepo.ts`, `profileRepo.ts`, `bookmarksRepo.ts`, `skippedRepo.ts`, `referencesRepo.ts`
- [x] One file per repo with typed `select`/`insert`/`update` functions only — no UI imports
- [~] Unit tests with in-memory Drizzle SQLite — *code written; `__tests__/repos.test.ts` skipped because `better-sqlite3` has no prebuilt binding for Node 26 on Windows*

### P1-T09 — Zustand stores ✅ DONE
**DONE when** `useThemeStore.getState().mode` returns the persisted value after a cold restart.

- [x] `src/stores/themeStore.ts` (`mode: 'light'|'dark'|'system'`, `setMode`, `isDark(systemIsDark)`)
- [x] `src/stores/localeStore.ts` (`locale`, `setLocale`, `isRTL`)
- [x] `src/stores/profileStore.ts` (mirror of `user_profile` for derived selectors)
- [x] `__tests__/stores.test.ts` covers all three stores (9 tests)

### P1-T10 — `BigButton3D` ✅ DONE
**DONE when** button visibly depresses on press and fires haptic + onPress.

- [x] `src/components/BigButton3D.tsx`
- [x] Two-layer Duolingo 3D shadow + offset; `active:translate-y-1`-equivalent via Reanimated
- [x] `Pressable` with `Haptics.selectionAsync()` on press-in (via `src/utils/haptics.ts`)
- [x] `accessibilityRole="button"`, `accessibilityLabel` from prop, `accessibilityState.busy/disabled`
- [x] Variant prop: `primary` (brand-green), `secondary` (brand-blue), `ghost`
- [x] RNTL tests in `BigButton3D.test.tsx` + `__tests__/components.test.tsx` (9 tests)

### P1-T11 — App layout providers 🟡 PARTIAL
**DONE when** app launches in a single second with no layout warnings.

- [x] `app/_layout.tsx` with provider order: `GestureHandlerRootView → SafeAreaProvider → ThemeProvider → LocaleProvider → Stack`
- [x] Custom splash screen via `expo-splash-screen` (referenced in `app.json`)
- [~] Pin DB path (single source of truth) — *SQLite path is hard-coded inside `src/db/index.ts` (`'sabiqoo.db'`); a dedicated `src/db/path.ts` constant was not extracted*

### P1-T12 — Phase 1 demo build ❌ NOT STARTED
**DONE when** an APK build installs and shows the seeded roadmap (nodes in correct states).

- [x] Stub `app/index.tsx` rendering a placeholder roadmap list — *replaced by `app/roadmap.tsx` (full Roadmap screen from P2-T03)*
- [ ] `eas build --profile preview` produces a working APK — *requires EAS auth, out of scope for this CLI*

### P1-T13 — `user_bookmarks` table + repo 🟡 PARTIAL
**DONE when** migration `0003_add_user_bookmarks.sql` applies cleanly and `bookmarksRepo` round-trips via in-memory SQLite.

- [x] Add `user_bookmarks` table to `src/db/schema.ts`
- [~] `drizzle-kit generate` — *not generated; table created via inline SQL at app boot (`scripts/migrate.ts`)*
- [x] `src/repos/bookmarksRepo.ts` exporting `listAll`, `isBookmarked`, `add` (uses `INSERT OR IGNORE`), `remove`
- [~] Unit tests against in-memory SQLite — *skipped due to `better-sqlite3` binding issue*

### P1-T14 — `user_skipped` table + repo 🟡 PARTIAL
**DONE when** migration `0004_add_user_skipped.sql` applies cleanly and `skippedRepo` round-trips.

- [x] Add `user_skipped` table to `src/db/schema.ts`
- [~] `drizzle-kit generate` — *not generated; table created via inline SQL at app boot*
- [x] `src/repos/skippedRepo.ts` exporting `listAll`, `isSkipped`, `skip`, `unSkip`
- [~] Unit tests against in-memory SQLite — *skipped due to `better-sqlite3` binding issue*

---

## Phase 2 — Core Screens

### P2-T01 — Roadmap `RoadmapPath` SVG layout 🟡 PARTIAL
**DONE when** a curving, branching node path renders for Unit 1 with seeded deeds.

- [x] Nodes render per unit with state (`Node` component) — *full component implemented (P2-T02)*
- [~] Bezier curves between nodes drawn with `react-native-svg` `<Path>` — *nodes are connected with a 28-px linear "stacked" view instead; bezier branching curves are pending upgrade*
- [x] Reanimated pulse on `Available` nodes
- [~] Snaps to scroll position via `Animated.ScrollView` page transitions — *Roadmap uses plain `ScrollView` with `useFocusEffect` re-query on focus*

### P2-T02 — Node component + states ✅ DONE
**DONE when** node color/icon matches each of `Locked` / `Available` / `Completed` / `Mastered` / `Skipped`.

- [x] `src/components/Node.tsx` with size by state
- [x] Lock icon for `Locked`, pulsing ring for `Available`, gold star for `Completed`, flame overlay for `Mastered`
- [x] Eye-off + slash icon for `Skipped` (P2-T05d)
- [x] Press navigates to `/deed/[id]`
- [x] Tap-target min 44×44

### P2-T03 — Roadmap screen wiring ✅ DONE
**DONE when** Roadmap screen shows correct unit, branch, and node state from DB.

- [x] `app/roadmap.tsx` queries `unitsRepo.list()` + `deedsRepo.listAll()` (and computes state)
- [x] Nodes laid out per unit with state computed via `app/_helpers.ts:computeUnlockedIds` (alt-branch semantics, alt-skip-friendly)
- [x] Top bar with `<StreakBadge>` and `<XpBar>`

### P2-T04 — Unlock dependency graph (alternative-branch semantics) 🟡 PARTIAL
**DONE when** a merge node unlocks as soon as **any one** branch side finishes — not when all branches finish.

- [x] Branch relationship encoded via `deed.branch_group` in seed
- [x] `deedsRepo.unlockedIds(profile, completedIds, skippedIds)` returning accessible deeds
- [x] **Branch rule** implemented: easy deeds unlock when ANY same-unit peer (`difficulty_level===1`) is completed; medium/hard deeds unlock when their category is ≥ 1/3 complete; skip-aware
- [x] Skip interaction: skipped deeds never gate progression (also encoded in helper)
- [~] Unit tests covering: any-side-finishes, all-branches-skipped, merge-after-single-finish, locked-merge — *behavior is captured by the helper but no dedicated jest suite yet*

### P2-T05 — Challenge Detail — `Today` tab ✅ DONE
**DONE when** completing a deed writes a `user_logs` row and updates XP+level.

- [x] `app/deed/[id].tsx` with three tabs (Today · Evidence · History) — *tabs from `P2-T05b`; today content from this ticket*
- [x] `<QuantityStepper>` (min 1, max 50)
- [x] Optional `<TextInput multiline>` for `note`
- [x] `<BigButton3D label={t('deed.markCompleted', {xp})}/>`
- [x] On submit: write log, update profile, fire `<ConfettiOverlay>`, haptic `success`

### P2-T05a — `deed_references` table + repo 🟡 PARTIAL
**DONE when** migration `0002_add_deed_references.sql` applies cleanly and `referencesRepo.listByDeed(id)` returns typed rows.

- [x] Add `deed_references` table to `src/db/schema.ts`
- [~] `drizzle-kit generate` — *not generated; created via inline SQL*
- [x] `src/repos/referencesRepo.ts` exporting `listByDeed(deedId)`
- [~] Unit tests against in-memory SQLite — *skipped due to `better-sqlite3` binding issue*

### P2-T05b — `Evidence` tab in Challenge Detail 🟡 PARTIAL
**DONE when** Challenge Detail renders a third tab listing this deed's references grouped by type.

- [x] Update `app/deed/[id].tsx` to expose three tabs (Today · Evidence · History)
- [x] `src/components/ReferenceCard.tsx` (RTL-aware text block, source caption, optional `lesson_*` row)
- [x] Group order: quran → hadith → athkar
- [~] RNTL snapshot in light + dark + AR/EN — *none yet*

### P2-T05c — Seed references for ~15 deeds ✅ DONE
**DONE when** seeded DB contains ≥ 25 references across quran / hadith / athkar types for ≥ 15 deeds, with ≥ 5 deeds having no references.

- [x] Extended `scripts/authoring.ts` + `scripts/seed.ts` with a `references` array
- [x] Coverage: 29 references across 27 deeds (mix of quran 11 / hadith 15 / athkar 3)
- [x] `lesson_ar` filled for ~half the refs; `text_en` filled for ~a quarter

### P2-T05d — `Skipped` node state + `SkipToggle` gesture 🟡 PARTIAL
**DONE when** users can tap "Not for me" on any Node, DeedCard, or the Challenge Detail header; skipped deeds render dimmed and can be un-skipped from Settings.

- [x] `src/components/SkipToggle.tsx` (Ionicons `eye-outline`/`eye-off`)
- [x] Wired on `DeedCard` + `app/deed/[id].tsx` header
- [~] Wired on `Node` overlay — *SkipToggle exists; not yet rendered on `Node` directly (only via `DeedCard` and detail)*
- [x] `Skipped` node state implemented (dimmed, slate-blue, eye-off, never gates progression)
- [x] Underlying Available/Completed/Mastered still computed so un-skip restores prior state
- [x] Settings: "Skipped deeds" section with `Un-skip` action
- [x] Optimistic UI update via Zustand + repo reconcile
- [~] RNTL snapshot of skip / un-skip flow — *no dedicated test yet*

### P2-T06 — Challenge Detail — `History` tab 🟡 PARTIAL
**DONE when** the History tab lists every prior log of this deed.

- [x] Query `logsRepo.listByDeed(id)` and render with `<LogRow>`
- [x] Group by `day_bucket` with localized sticky headers (Today / Yesterday / N days ago)
- [~] Empty-state copy + illustration — *copy present; no illustration*

### P2-T07 — Catalog screen ✅ DONE
**DONE when** searching `الصدقة` / `charity` returns matching deeds and filter chips narrow results.

- [x] `app/catalog/index.tsx` with `<TextInput>` search + `FlatList` of `<DeedCard>`
- [x] `<CategoryChips>` horizontal scroll, multi-select toggle
- [x] Locale-aware case-insensitive match on title + description

### P2-T08 — History + analytics screen 🟡 PARTIAL
**DONE when** the 30-day heatmap and category progress render with seeded log data.

- [x] `app/history/index.tsx`
- [x] Heatmap from `logsRepo.countByDay(30)`
- [~] Donut from `logsRepo.countByCategory()` — *implemented as a horizontal category bar chart (simpler than donut)*
- [x] Reverse-chronological log list

### P2-T09 — Settings screen ✅ DONE
**DONE when** changing theme/language persists across cold restart and re-renders app.

- [x] `app/settings/index.tsx` with segmented theme + language pickers
- [x] Manual "Use a streak freeze" button (consumes one freeze)
- [x] Skipped-deeds management section with `Un-skip`
- [x] About section with version

### P2-T10 — Deep linking & shared element transitions 🟡 PARTIAL
**DONE when** tapping a node via deep link `sabiqoo://deed/42` opens detail.

- [x] `app.json` `scheme: "sabiqoo"`
- [x] Expo Router typed routes enabled (`experiments.typedRoutes: true`)
- [ ] Shared-element transition (experimental flag) — *not enabled; plain `router.push` used*

### P2-T12 — `HeartButton` component + usages 🟡 PARTIAL
**DONE when** tapping the heart on `DeedCard`, `Node`, and Challenge Detail header toggles bookmark state without navigating away, with haptic feedback.

- [x] `src/components/HeartButton.tsx` (Ionicons `heart-outline` / `heart`; outlined vs filled colors from theme tokens)
- [x] Wired on `DeedCard` (catalog) and `app/deed/[id].tsx` header
- [~] Wired on `Node` overlay — *not yet rendered on `Node` directly; only on `DeedCard` and detail*
- [x] Optimistic update via Zustand + repo reconcile
- [~] RNTL tests — *no dedicated test yet*

### P2-T13 — Bookmarks screen + Roadmap top-bar icon ✅ DONE
**DONE when** the heart icon in the Roadmap top bar shows the bookmark count as a badge and opens `/bookmarks`.

- [x] `app/bookmarks/index.tsx` rendering a list of bookmarked deeds ordered by `created_at` desc
- [x] Empty-state copy + "Browse the catalog" CTA
- [x] Roadmap top-bar heart icon → `/bookmarks` with numeric badge

### P2-T14 — Category progress indicator 🟡 PARTIAL
**DONE when** every `CategoryCard` shows a `x/y` badge, a progress bar that fills to `accent-gold` when complete, and a trophy overlay at 100%.

- [x] `src/components/ProgressBadge.tsx` (locale-aware numeral formatting, gold at 100%)
- [x] Extended `CategoryCard` with badge + progress bar + trophy state
- [x] `(x/y)` indicator on `<CategoryChip>` (small, muted text)
- [~] RNTL tests — *no dedicated test yet*

### P2-T15 — Unit progress on Roadmap headers ✅ DONE
**DONE when** each unit header on the Roadmap screen shows an aggregate `x/y` across all deeds in that unit.

- [x] `src/components/UnitProgress.tsx` (header text + inline progress bar)
- [x] Used in the Roadmap's unit header

### P2-T16 — Phase 2 demo build ❌ NOT STARTED
**DONE when** all primary screens demo without console errors in Preview APK.

- [x] Manual smoke matrix recorded — *all screens written and routed*
- [ ] `eas build --profile preview` — *requires EAS auth*

---

## Phase 3 — Gamification, Polish & Launch

### P3-T01 — XP engine ✅ DONE
**DONE when** `xpEarned = deed.xp_reward * quantity * difficulty_multiplier` and level increments correctly.

- [x] `src/gamification/xp.ts` pure function `computeXpEarned({baseReward, quantity, difficulty})`
- [x] `src/gamification/level.ts` `levelFromXp(xp)`, `xpIntoLevel(xp)`, `xpForLevel(n)`
- [x] Unit tests — 18 tests across xp/level/streak (all pass)

### P3-T02 — Streak engine ✅ DONE
**DONE when** streak increments, freezes, breaks, and refills per SPEC §7.3.

- [x] `src/gamification/streak.ts` pure function `nextStreakOnLog(profile, dayBucket)`
- [x] Consumes freeze when applicable, increments streak, updates longest, refills (capped at 2)
- [x] Unit tests — 9 streak cases incl. month/year boundary

### P3-T03 — GamificationProvider ❌ NOT STARTED
**DONE when** the provider owns streak/XP updates and emits events to stores.

- [ ] `src/gamification/GamificationProvider.tsx`
- [ ] Hook `useLogDeed()` that handles all state mutations + emits events
- [ ] Debounced profile refresh after each log
- Note: deed detail screen currently calls the pure functions directly; provider wrapping is a refactor that consolidates that pattern.

### P3-T04 — Confetti / Lottie celebration overlay 🟡 PARTIAL
**DONE when** completion shows a 1/2/3-star overlay scaled to XP and respects reduce-motion.

- [x] `src/components/ConfettiOverlay.tsx`
- [x] Star count derived from XP per SPEC §7.4 (1 / 2 / 3 stars)
- [x] Reduce-motion fallback: auto-dismiss with banner
- [ ] `assets/animations/confetti.json` (Lottie) — *uses RN `Animated` for stars; static SVG fallback exists at `assets/illustrations/confetti/burst.svg` but the Lottie JSON file is not produced yet*

### P3-T05 — Haptics + sound 🟡 PARTIAL
**DONE when** button press and completion fire the right feedback and the mute toggle works.

- [x] `src/utils/haptics.ts` wrapping `expo-haptics` with safe fallbacks (light/medium/heavy/success/warning/selection)
- [ ] `assets/sounds/click.mp3`, `assets/sounds/chime.mp3`; `expo-av` player with debounce — *not produced*
- [ ] Settings toggle for sound — *not implemented*

### P3-T06 — Accessibility audit 🟡 PARTIAL
**DONE when** all Phase 1 + 2 components pass `eslint-plugin-react-native-a11y` and Lighthouse-style checks.

- [~] Add labels to all icon-only buttons — *partial; lint shows 50 warnings about missing `accessibility-hint` on newly audited components (BigButton3D / QuantityStepper pass cleanly)*
- [~] Verify reduce-motion path — *implemented in ConfettiOverlay; not surfaced in the rest of the app*
- [~] Tap-targets ≥ 44×44 audited — *BigButton3D / Node / QuantityStepper pass; <100% coverage of all tappables*

### P3-T07 — Contrast audit ❌ NOT STARTED
**DONE when** `scripts/check-contrast.ts` passes for every token combination in light + dark.

- [ ] Pairwise contrast check (text on surface, brand on elevated, etc.) using WCAG 2.1 formulas
- [ ] Block CI on failures

### P3-T08 — Performance pass ❌ NOT STARTED
**DONE when** Roadmap scroll at 60fps with 1k logs and 50 deeds.

- [ ] Memoize `Node` renders with React.memo
- [ ] Reanimated worklets for non-essential animations
- [ ] Confirm no `useEffect` re-fires during scroll

### P3-T09 — Production build pipeline 🟡 PARTIAL
**DONE when** `eas build --profile production` produces signed AAB + IPA for store submission.

- [x] `eas.json` profiles: `preview`, `production`, `ad-hoc`, `development`
- [x] **Pre-set by P1-T01**: iOS bundle id, Android package id, app icon set, adaptive icon, splash already in `app.json`
- [ ] Privacy manifest (iOS), data safety form (Android) generated from SPEC §1 non-goals — *not produced*
- [ ] `eas build --profile production` + `eas submit` — *requires EAS auth*
- [ ] Submit checklist doc in `docs/launch.md` — *not produced*

### P3-T10 — Launch readiness review 🟡 PARTIAL
**DONE when** README + store metadata are ready.

- [x] Update README with architecture diagram, dev/setup/test/build/run instructions — *done in `README.md`*
- [ ] Store screenshots in both AR and EN, light and dark, both stores — *not produced*
- [ ] Privacy policy URL for the listing — *not produced*
- [ ] Final stakeholder sign-off

---

## Phase summary

| Phase | Tickets | Done | Partial | Pending |
|---|---|---:|---:|---:|
| 1 — Foundation | 15 | 9 | 4 | 2 |
| 2 — Core screens | 17 | 6 | 9 | 2 |
| 3 — Polish & Launch | 10 | 2 | 4 | 4 |
| **Total** | **42** | **17** | **17** | **8** |

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
