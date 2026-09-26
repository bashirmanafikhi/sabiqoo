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

### P1-T07 — Seed data (7 categories + 8 units + ~150 deeds)
**DONE when** fresh DB contains 7 categories, 8 units, ≥ 150 deeds spanning all categories, and ≥ 70% of deeds tagged `difficulty_level = 1`.

- [ ] `scripts/seed.ts` inserting units + categories + deeds via `INSERT OR IGNORE` keyed by `slug`
- [ ] Seed the 8 units per SPEC §4.2 (Smile & Salam, Kind Words, Kinship Ties, Neighborly Acts, Kindness to Animals, Financial Charity, Sadaqah Jariyah, Hands-on Service)
- [ ] Translate the PRD's 30 example deeds into the bilingual `title_ar`/`title_en`/`description_ar`/`description_en` shape
- [ ] Author ~120 additional deeds balanced across the 7 categories (~20 per category)
- [ ] `unit_id` and `branch_group` assigned such that roadmap groups are well-balanced and branches are meaningful (e.g., Financial Charity unit has parallel financial vs non-monetary branches)
- [ ] ≥ 70% of deeds tagged `difficulty_level = 1`

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

### P1-T13 — `user_bookmarks` table + repo
**DONE when** migration `0003_add_user_bookmarks.sql` applies cleanly and `bookmarksRepo.isBookmarked/listAll/add/remove` round-trip via in-memory SQLite.

- [ ] Add `user_bookmarks` table to `src/db/schema.ts` (per SPEC §4.1)
- [ ] `drizzle-kit generate` produces `0003_add_user_bookmarks.sql`; review and commit
- [ ] `src/repos/bookmarksRepo.ts` exporting `listAll`, `isBookmarked(deedId)`, `add(deedId)`, `remove(deedId)`
- [ ] Unit tests against in-memory SQLite (insert, unique-constraint, cascade delete, idempotent re-add becomes no-op via `INSERT OR IGNORE`)
- [ ] Add `bookmarksRepo` to repos barrel export

### P1-T14 — `user_skipped` table + repo
**DONE when** migration `0004_add_user_skipped.sql` applies cleanly and `skippedRepo` round-trips.

- [ ] Add `user_skipped` table to `src/db/schema.ts` (per SPEC §4.1)
- [ ] `drizzle-kit generate` produces `0004_add_user_skipped.sql`; review and commit
- [ ] `src/repos/skippedRepo.ts` exporting `listAll`, `isSkipped(deedId)`, `skip(deedId)`, `unSkip(deedId)`
- [ ] Unit tests against in-memory SQLite (insert, unique-constraint, cascade delete)

### P1-T15 — Circumstance metadata (tables + repo + seed)
**DONE when** migrations apply, `circumstancesRepo.listForDeed(id)` returns tags, and 7 canonical tags are seeded with 0–3 per deed across the catalog.

- [ ] Add `circumstances` and `deed_circumstances` tables to `src/db/schema.ts`
- [ ] `drizzle-kit generate` produces `0005_add_circumstances.sql`; review and commit
- [ ] `src/repos/circumstancesRepo.ts` exporting `listAll`, `listForDeed(deedId)`, `setForDeed(deedId, slugs[])`
- [ ] Seed the canonical tag set in `scripts/seed.ts`: `has_income`, `has_family`, `animal_access`, `time_flexible`, `health_ok`, `literate`, `can_travel`
- [ ] Backfill `deed_circumstances` rows so 0–3 tags per deed, biased toward 0–1 (most deeds require nothing special)
- [ ] Unit tests against in-memory SQLite

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

### P2-T04 — Unlock dependency graph (alternative-branch semantics)
**DONE when** a merge node unlocks as soon as **any one** branch side finishes — not when all branches finish.

- [ ] Define a `unlocks` relationship table or encode in seed JSON
- [ ] Repo function `deedsRepo.unlockedIds(profile)` returning deeds the user can attempt
- [ ] **Branch rule**: a node with `branch_group = N` is unlocked when ANY sibling in the same `branch_group` has been completed; merges with no branches follow linear predecessor rule
- [ ] Skip interaction: if the only branching path is skipped, the merge still unlocks when at least one unskipped sibling completes (or earlier if all siblings in the branch are skipped)
- [ ] Unit tests covering: any-side-finishes, all-branches-skipped, merge-after-single-finish, locked-merge (no branch done)

### P2-T05 — Challenge Detail — `Today` tab
**DONE when** completing a deed writes a `user_logs` row and updates XP+level.

- [ ] `app/deed/[id].tsx` with `<Tabs>` from `expo-router` (Today · History)
- [ ] `<QuantityStepper>` (min 1, max 50)
- [ ] Optional `<TextInput multiline>` for `note`
- [ ] `<BigButton3D label={t('deed.markCompleted', {xp})}/>`
- [ ] On submit: write log, update profile, navigate back, fire `<ConfettiOverlay>`

### P2-T05a — `deed_references` table + repo
**DONE when** migration `0002_add_deed_references.sql` applies cleanly and `referencesRepo.listByDeed(id)` returns typed rows.

- [ ] Add `deed_references` table to `src/db/schema.ts` (per SPEC §4.1)
- [ ] `drizzle-kit generate` produces `0002_add_deed_references.sql`; review and commit
- [ ] `src/repos/referencesRepo.ts` exporting `listByDeed(deedId)` and `upsertByDeed(deedId, rows)`
- [ ] Unit tests against in-memory SQLite (insert, list, cascade delete)

### P2-T05b — `Evidence` tab in Challenge Detail
**DONE when** Challenge Detail renders a third tab listing this deed's references grouped by type, or empty-state copy if none.

- [ ] Update `app/deed/[id].tsx` to expose three tabs (Today · Evidence · History); tab key `evidence`
- [ ] New `src/components/ReferenceCard.tsx` (RTL-aware text block, source caption, optional `lesson_*` row, optional `text_en` toggle)
- [ ] Group order: quran → hadith → athkar; per-group `FlatList`
- [ ] RNTL snapshot in light + dark + AR/EN, both populated and empty cases

### P2-T05c — Seed references for ~15 deeds
**DONE when** seeded DB contains ≥ 25 references across quran / hadith / athkar types for ≥ 15 deeds, and at least 5 deeds have **zero** references to exercise the empty state.

- [ ] Extend `scripts/seed.ts` with a `references` array; idempotent via `slug + source`
- [ ] Coverage: every category gets at least 2 deeds with references; chosen deeds include classic evidences (e.g., charity ↔ Surah Al-Baqarah 2:261, smile ↔ hadith of the Prophet's smile, etc.)
- [ ] `lesson_ar` filled for ~half the refs; `text_en` filled for ~a quarter (pilot coverage, full translation is i18n backfill work)

### P2-T05d — `Skipped` node state + `SkipToggle` gesture
**DONE when** users can tap "Not for me" on any Node, DeedCard, or the Challenge Detail header; skipped deeds render as dimmed `Skipped` nodes on the Roadmap and can be un-skipped from Settings.

- [ ] `src/components/SkipToggle.tsx` (Lucide `eye-off` outline/filled); accepts `deedId`, `size`
- [ ] Wired on `Node` overlay, `DeedCard`, and `app/deed/[id].tsx` header
- [ ] New `Node` state `Skipped` per SPEC §5.1 (dimmed, slate-blue, eye-with-slash icon, never gates progression)
- [ ] Underlying Available/Completed/Mastered state still computed correctly so un-skip restores the right state
- [ ] Settings: new "Skipped deeds" section listing `user_skipped` rows with `Un-skip` action per row + empty-state copy
- [ ] Optimistic update via local store + repo reconcile on next focus
- [ ] RNTL tests: skipping renders dimmed node, un-skip restores prior state

### P2-T05e — Circumstance chips on Challenge Detail
**DONE when** Challenge Detail's `Today` tab shows a small `CircumstanceChip` row when the deed has any tags, with no chips when none.

- [ ] `src/components/CircumstanceChip.tsx`; uses `skip.chipLabel` i18n key prefix
- [ ] Hook `useCircumstances(deedId)` calling `circumstancesRepo.listForDeed`
- [ ] Layout: horizontal `ScrollView` of chips below the hero block, before the stepper
- [ ] RNTL snapshot for: no-tags, one-tag, three-tags; light + dark + AR/EN

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

### P2-T12 — `HeartButton` component + usages
**DONE when** tapping the heart on `DeedCard`, `Node`, and Challenge Detail header toggles bookmark state without navigating away, with haptic feedback.

- [ ] `src/components/HeartButton.tsx` (Lucide `heart` outline/filled); accepts `deedId`, `size`, optional `withBadge`
- [ ] Wired on `DeedCard`, `Node` overlay, and `app/deed/[id].tsx` header
- [ ] Optimistic update via local store + repo reconcile on next focus
- [ ] RNTL tests for outline → filled transition and idempotent re-tap

### P2-T13 — Bookmarks screen + Roadmap top-bar icon
**DONE when** the heart icon in the Roadmap top bar shows the bookmark count as a badge and opens `/bookmarks`, which lists every saved deed.

- [ ] `app/bookmarks/index.tsx` rendering a `FlatList` of `DeedCard`s ordered by `user_bookmarks.created_at` desc
- [ ] Empty-state component + "Browse the catalog" CTA linking to `/catalog`
- [ ] Roadmap top-bar icon wired to `/bookmarks` with numeric badge when `count > 0`
- [ ] RNTL snapshot in light + dark + AR/EN, both populated and empty cases

### P2-T14 — Category progress indicator
**DONE when** every `CategoryCard` shows a `x/y` badge, a progress bar that fills to `accent-gold` when complete, and a trophy overlay at 100%.

- [ ] Add `progressRepo.categoryProgress()` returning `{ categoryId, done, total }[]` (single GROUP BY query)
- [ ] Hook `useCategoryProgress()` invalidating on every `useLogDeed()` success and on app focus
- [ ] `src/components/ProgressBadge.tsx` (locale-aware numeral formatting)
- [ ] Extend `CategoryCard` with badge + progress bar + trophy state
- [ ] Add `(x/y)` indicator to `CategoryChip` (small, muted)
- [ ] RNTL tests: `x=0`, `x<y`, `x=y` (trophy), all in light + dark

### P2-T15 — Unit progress on Roadmap headers
**DONE when** each unit header on the Roadmap screen shows an aggregate `x/y` across all deeds in that unit.

- [ ] `progressRepo.unitProgress()` returning `{ unitId, done, total }[]`
- [ ] `src/components/UnitProgress.tsx`; used in the Roadmap's unit header
- [ ] Hook `useUnitProgress()` with same invalidation rules as `useCategoryProgress`

### P2-T16 — Phase 2 demo build
**DONE when** all primary screens (Roadmap, Detail, Catalog, Bookmarks, History, Settings) demo without console errors in Preview APK.

- [ ] Manual smoke matrix recorded (see SPEC §11); new screen added: Bookmarks
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
