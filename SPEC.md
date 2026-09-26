# SABIQOO — Product & Engineering Specification

> Duolingo-style gamified mobile app for consistent charitable deeds.
> Status: **v1.0 draft — approved by stakeholder on 2026-09-26**

---

## 1. Product Philosophy

- **Name**: **سابقوا (Sabiqoo)** — from the Qur'anic imperative _"فَاسْتَبِقُوا الْخَيْرَٰتِ"_.
- **Core promise**: ~150 acts of charity broken into bite-size, repeatable challenges with a friction-free 3D-Duolingo UI, organized as a living inspiration library — heavily weighted toward easy deeds so every user always has something actionable in mind.
- **Privacy & Offline-First**: 100% local tracking via `expo-sqlite`; no mandatory cloud. Optional cloud export is explicitly out-of-scope for v1.
- **Localization**: Arabic (default, RTL) + English (LTR). All strings addressable via i18n keys.
- **Theming**: Light / Dark / System with semantic color tokens; no hard-coded hexes in components.

### Non-goals (v1)

- No multi-device sync.
- No social leaderboards or friend feed.
- No payments / charity gateway integrations (deeds are logged, not transacted).
- No AI-generated deed recommendations.

---

## 2. Tech Stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | **Expo SDK 51+** (managed) | Expo Router for file-based routing |
| Language | **TypeScript (strict)** | |
| Styling | **NativeWind v3** | Tailwind config + `darkMode: 'class'` |
| Routing | **Expo Router v3** | Stack + Tabs |
| Animation | **react-native-reanimated v3** + **lottie-react-native** | |
| Vector drawing | **react-native-svg** | For the curving roadmap |
| Icons | **@expo/vector-icons** (Lucide + Ionicons) | |
| Haptics | **expo-haptics** | |
| Sound | **expo-av** (legacy, bundled) | Sound effects are short MP3 |
| Local DB | **expo-sqlite** | |
| ORM / Migrations | **Drizzle ORM** + `drizzle-kit` | Typed schema, generated migrations |
| Global state | **Zustand** | Theme + locale + XP/streak cache |
| Persistence (non-DB) | **@react-native-async-storage/async-storage** | Theme + locale overrides |
| i18n | **i18next** + **react-i18next** + **expo-localization** | |
| Confetti | **react-native-confetti-cannon** or **lottie** overlay | Lottie chosen for richer framing |
| Testing | **Jest** + **@testing-library/react-native** | Unit + snapshot |
| E2E (smoke) | **Detox** (later phase, optional) | |
| Build / Deploy | **EAS Build** + **EAS Update** | OTA strings/i18n not in v1 scope |

---

## 3. High-Level Architecture

```
┌────────────────────────────────────────────────────────┐
│  App (Expo Router, RSC-free)                           │
│                                                        │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Roadmap    │  │  Challenge   │  │  Catalog     │  │
│  │  screen     │  │  Detail      │  │  + History   │  │
│  └─────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│        │   hooks (queries / mutations)                │
│        ▼                ▼                ▼             │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Data Layer (Drizzle repos)                      │  │
│  │   deedsRepo · logsRepo · profileRepo · unitsRepo │  │
│  └────────────────────┬─────────────────────────────┘  │
│                       ▼                                │
│             expo-sqlite (local file DB)                │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Cross-cutting Providers                         │  │
│  │   ThemeProvider (NativeWind dark class)          │  │
│  │   LocaleProvider (i18n + I18nManager.forceRTL)   │  │
│  │   GamificationProvider (XP/streak engine)        │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

### Layer rules

- **Screens** never touch `expo-sqlite` directly; they call **repos**.
- **Repos** never render UI; they return typed Drizzle results.
- **Providers** wrap the app in `app/_layout.tsx`; order is `SafeArea → GestureHandlerRoot → Theme → Locale → Gamification → Stack`.
- **Stores (Zustand)** are read-only mirrors of derived aggregates from the DB; writes always go through repos first, then the store is updated.

---

## 4. Data Model

DB engine: **SQLite (expo-sqlite)**. Migration tool: **drizzle-kit**. All tables use `INTEGER PRIMARY KEY AUTOINCREMENT` for ids and store timestamps as ISO8601 strings (UTC).

### 4.1 Schema (Drizzle / SQL)

```sql
-- Categories (7 in v1, seeded from PRD sample)
CREATE TABLE categories (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name_ar     TEXT NOT NULL,
  name_en     TEXT NOT NULL,
  icon_name   TEXT NOT NULL,            -- Lucide icon name
  color_code  TEXT NOT NULL,            -- brand hex (e.g. #58CC02)
  unit_id     INTEGER,                  -- which unit header this cat lives under
  sort_order  INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (unit_id) REFERENCES units(id)
);

-- Units (Unit 1: Everyday Smiles, Unit 2: Kinship, etc.)
CREATE TABLE units (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title_ar    TEXT NOT NULL,
  title_en    TEXT NOT NULL,
  sort_order  INTEGER NOT NULL
);

-- Deeds catalog
CREATE TABLE deeds (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  slug             TEXT UNIQUE NOT NULL,          -- stable seed key
  category_id      INTEGER NOT NULL,
  unit_id          INTEGER NOT NULL,    -- denormalized for fast roadmap lookups
  title_ar         TEXT NOT NULL,
  title_en         TEXT NOT NULL,
  description_ar   TEXT NOT NULL,
  description_en   TEXT NOT NULL,
  xp_reward        INTEGER NOT NULL DEFAULT 10,
  difficulty_level INTEGER NOT NULL DEFAULT 1,   -- 1 Easy, 2 Medium, 3 Advanced
  branch_group     INTEGER NOT NULL DEFAULT 1,   -- parallel roadmap path id
  is_repeatable    INTEGER NOT NULL DEFAULT 1,   -- 0 / 1
  sort_order       INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (unit_id)     REFERENCES units(id)
);

-- User completion / repetition logs
CREATE TABLE user_logs (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  deed_id      INTEGER NOT NULL,
  completed_at TEXT NOT NULL DEFAULT (datetime('now')),  -- ISO8601 UTC
  xp_earned    INTEGER NOT NULL,
  quantity     INTEGER NOT NULL DEFAULT 1,
  note         TEXT,
  day_bucket   TEXT NOT NULL,            -- 'YYYY-MM-DD' local; used by streak engine
  FOREIGN KEY (deed_id) REFERENCES deeds(id)
);
CREATE INDEX idx_user_logs_day_bucket ON user_logs(day_bucket);
CREATE INDEX idx_user_logs_deed_id     ON user_logs(deed_id);

-- Single-row profile (id always = 1)
CREATE TABLE user_profile (
  id                   INTEGER PRIMARY KEY CHECK (id = 1),
  current_xp           INTEGER NOT NULL DEFAULT 0,
  current_level        INTEGER NOT NULL DEFAULT 1,
  current_streak       INTEGER NOT NULL DEFAULT 0,
  longest_streak       INTEGER NOT NULL DEFAULT 0,
  last_active_date     TEXT,                              -- 'YYYY-MM-DD' local
  streak_freezes_left  INTEGER NOT NULL DEFAULT 2
);

-- Religious evidence (ayah / hadith / athkar) — optional, 1:N per deed
CREATE TABLE deed_references (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  deed_id     INTEGER NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('quran','hadith','athkar')),
  text_ar     TEXT NOT NULL,                       -- original Arabic scripture
  text_en     TEXT,                                -- optional translation
  source      TEXT NOT NULL,                       -- "Surah Al-Baqarah 2:183" / "Sahih Bukhari 1234"
  narrator    TEXT,                                -- hadith only; null otherwise
  lesson_ar   TEXT,                                -- optional brief lesson
  lesson_en   TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (deed_id) REFERENCES deeds(id) ON DELETE CASCADE
);
CREATE INDEX idx_deed_references_deed_id ON deed_references(deed_id);

-- User bookmarks ("My List") — optional, many deeds per local user
CREATE TABLE user_bookmarks (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  deed_id     INTEGER NOT NULL UNIQUE,             -- a deed bookmarked at most once
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (deed_id) REFERENCES deeds(id) ON DELETE CASCADE
);
CREATE INDEX idx_user_bookmarks_deed_id ON user_bookmarks(deed_id);

-- User-skipped deeds ("Not for me") — never gates progression
CREATE TABLE user_skipped (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  deed_id     INTEGER NOT NULL UNIQUE,
  skipped_at  TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (deed_id) REFERENCES deeds(id) ON DELETE CASCADE
);
CREATE INDEX idx_user_skipped_deed_id ON user_skipped(deed_id);
```

### 4.2 Seed

- **Units**: 8 seeded (Smile & Salam; Kind Words; Kinship Ties; Neighborly Acts; Kindness to Animals; Financial Charity; Sadaqah Jariyah; Hands-on Service). Roadmap groups deeds by unit so each path is ~20 deeds and one or two scrolls deep.
- **Categories**: 7 from the PRD sample (الصدقات المالية, الأقارب والأرحام, الصدقات الجارية والأوقاف, الأعمال البدنية والتطوعية, الكلمة الطيبة والمعنوية, الرفق بالحيوان والبيئة, إغاثة وكفالة).
- **Deeds**: ~150 entries spread across the 8 units and 7 categories (~20 deeds per category, evenly split across units). ≥ 70% tagged `difficulty_level=1` so the catalogue always surfaces easy inspiration. Bilingual fields filled for AR/EN; seed runs idempotently on first boot (`INSERT OR IGNORE` keyed by the `slug` column).

### 4.3 Migration management

- All migrations generated by `drizzle-kit generate` and committed to `src/db/migrations/`.
- First migration creates every table above (including `deeds.slug`); subsequent migrations add columns/tables in order.
- App refuses to boot if DB version is newer than the build's expected version (forward-compat safety).

---

## 5. Screens & Navigation (Expo Router)

```
app/
  _layout.tsx              // Providers + Stack
  index.tsx                // Roadmap (Home)
  deed/[id].tsx            // Challenge Detail (tabs)
  catalog/index.tsx        // Catalog (search + category chips)
  bookmarks/index.tsx      // My List — saved deeds
  history/index.tsx        // History + analytics
  settings/index.tsx       // Theme, language, streak-freeze use
  +not-found.tsx
```

### 5.1 Roadmap (Home)

- **Header**: streak chip (🔥), XP/Level pill, bookmarks icon (heart with numeric badge if any), language toggle, settings cog.
- **Body**: vertical scroller across 8 units; per unit, a header card (with `UnitProgress` bar showing `x/y` deeds in this unit ever completed) + a serpentine `RoadmapPath` with `Node`s.
- **Branching semantics**: nodes in the same `branch_group` render as **alternative paths** (e.g., financial vs non-monetary). A merge node unlocks as soon as **any one side** of the branch has its last deed completed — users can skip/bypass the branches that don't fit their circumstances without stalling overall roadmap progress. A user can also manually skip any single deed via the Not-for-me gesture (see §6 `SkipToggle`).
- **Node states**: `Locked` (gray, `lock` icon, disabled), `Available` (pulsing brand color), `Completed` (gold star), `Mastered` (gold star + flame when `user_logs` row count for deed ≥ 10), `Skipped` (dimmed, slate-blue with an eye-with-slash icon; never gates progression, computable again on un-skip).
- **`Node` gestures**: heart icon (bookmark toggle) and skip-icon toggle overlay each node; tap either without opening detail (haptic `selection`). Skipped deeds stay visible on the roadmap so users remember what they excluded.

### 5.2 Challenge Detail (`/deed/[id]`)

- **Header**: back arrow, deed title, bookmark heart toggle (filled when bookmarked, outline otherwise), skip toggle (filled when in `user_skipped`).
- **Tabs**: `Today` (default) · `Evidence` (الدليل) · `History`.
- **Today**:
  - Hero icon, title (localized), category badge, XP value.
  - Quantity stepper (`-`, value, `+`; min 1, max 50).
  - Optional `note` textarea.
  - Big 3D `Mark Completed` button (full-width, brand green).
  - On tap: write `user_logs`, update `user_profile`, fire `ConfettiOverlay`, haptic `success`, optional click sound. (See §7.4 for trigger rules.)
- **Evidence**: read-only list of `deed_references` rows for this deed, grouped by `type` (quran / hadith / athkar). Each item shows the source citation, original Arabic `text_ar` (RTL block), optional `text_en` translation toggle, and optional `lesson`. Empty-state copy when no references exist.
- **History**: scrollable timeline grouped by `day_bucket`. Each row: time, quantity, XP, note preview.

### 5.3 Catalog

- Search bar (matches localized title + description).
- Horizontal `CategoryChips` for filtering — each chip shows a small `x/y` indicator in muted text.
- Vertical grid of `DeedCard`s (title, category color stripe, XP, lock if not yet unlocked, heart icon for bookmark toggle).
- Each **`CategoryCard`** (clicking a chip filters to that category OR is shown at the top of the catalog grid) carries:
  - Title (localized).
  - **Progress badge** in top-right: `x/y` formatted with the active locale (Arabic numerals when AR).
  - **Progress bar** below the title; fill ratio = `x/y`, `accent-gold` when complete.
  - **Trophy overlay** when `x == y` (visual only — no extra XP), distinct from per-deed `Mastered`.

### 5.4 Bookmarks ("My List")

- Reached via the heart icon in the Roadmap top bar (with numeric badge showing `n` saved) and via the back-stack from a deed's heart toggle.
- Vertical list of `DeedCard`s the user has bookmarked, ordered by `user_bookmarks.created_at` descending (most recently saved first).
- Each row: localized title, category color stripe, XP, bookmarked-since date, quick "Mark Completed" `BigButton3D` (mini variant).
- **Empty state**: friendly copy + illustration + CTA "Browse the catalog".
- Pull-to-refresh is unnecessary (live updates); the list re-fetches on focus.

### 5.5 History

- Activity heatmap (last 30 days) — `bg-intensity` from log count.
- Category donut (counts grouped by category).
- List of all logs reverse chronological.

### 5.6 Settings

- Theme picker (`System` / `Light` / `Dark`).
- Language picker (`العربية` / `English`).
- Streak-freeze badge + manual consume button (consume yesterday's miss for free).
- **Skipped deeds** list with `Un-skip` action for each entry.
- About + version.

---

## 6. Component Inventory

| Component | Purpose | Key props |
|---|---|---|
| `BigButton3D` | The signature press-down action button | `label`, `onPress`, `variant`, `loading`, `accessibilityLabel` |
| `Node` | Roadmap node glyph | `state`, `deedId`, `onPress`, `position` |
| `RoadmapPath` | SVG bezier path between nodes | `units`, `theme` |
| `CategoryCard` | Catalog tile | `category`, `isActive`, `onPress` |
| `DeedCard` | Catalog entry | `deed`, `locked`, `onPress` |
| `LogRow` | One entry in history | `log`, `deed`, `locale` |
| `ReferenceCard` | One ayah / hadith / athkar reference in the Evidence tab | `reference`, `locale` |
| `HeartButton` | Bookmark toggle (outline ↔ filled), used on `DeedCard`, `Node`, and Detail header | `deedId`, `size`, `withBadge?` |
| `ProgressBadge` | `x/y` indicator (catalog chips, category cards, unit headers) | `done`, `total`, `locale`, `compact?` |
| `UnitProgress` | Aggregate progress bar across all deeds in a unit, used on Roadmap headers | `unitId` |
| `SkipToggle` | "Not for me" toggle (outline ↔ filled eye-slash), used on `Node`, `DeedCard`, and Detail header | `deedId`, `size` |
| `StreakBadge` | 🔥 + N | `streak`, `freezesLeft` |
| `XpBar` | Progress to next level | `xp`, `level` |
| `ConfettiOverlay` | Reanimated + Lottie celebration | `visible`, `xpEarned`, `onDone` |
| `QuantityStepper` | `-` value `+` | `value`, `onChange`, `min`, `max` |
| `ThemeProvider` | Mounts NativeWind dark class | `initialMode` |
| `LocaleProvider` | Wraps i18n + I18nManager | `initialLocale` |
| `GamificationProvider` | Loads profile + hooks | — |

---

## 7. Gamification Engine

### 7.1 XP formula

```
xpEarned = deed.xp_reward * quantity * difficulty_multiplier
difficulty_multiplier = { 1: 1.0, 2: 1.25, 3: 1.5 }
```

### 7.2 Level curve

```
xpForLevel(n) = 100 * n * (n + 1) / 2     -- triangular numbers
xpForLevel(1) = 100, xpForLevel(2) = 300, xpForLevel(3) = 600, …
```

`current_level` is the largest `n` such that `xpForLevel(n) ≤ current_xp`. Multi-level-ups in one log entry fire one celebratory Lottie per level.

### 7.3 Streak

- A `day_bucket` is the user's local date (per device timezone via `expo-localization`) normalized to `YYYY-MM-DD`.
- On log insert:
  - If `last_active_date === day_bucket` → no change.
  - If `last_active_date` is `null` (first ever log) → `current_streak = 1`.
  - If `last_active_date === day_bucket - 1 day` → `current_streak += 1`.
  - If `last_active_date === day_bucket - 2 days` AND `streak_freezes_left > 0` → consume freeze, `current_streak += 1`.
  - Else → `current_streak = 1`.
- After every update: `longest_streak = max(longest_streak, current_streak)`; `last_active_date = day_bucket`.
- Freeze refill policy: **+1 every 7 consecutive active days**, capped at 2. Refill is checked in the same update path and never causes streak to reset. (PRD default is 2 max.)

### 7.4 Celebration overlay

- Triggered on every `Mark Completed` press regardless of XP, but the Lottie variant scales: 1-star for `< 30 XP`, 2-star for `< 60 XP`, 3-star for `≥ 60 XP` or any level-up.
- Haptic: `Haptics.NotificationFeedbackType.Success`.
- Sound: optional short chime (`expo-av`), respects mute toggle in settings.

---

## 8. Localization (i18n + RTL)

### 8.1 Strings

- All copy lives in `i18n/en.json` and `i18n/ar.json`.
- AR strings are authoritative; EN translations are required for every screen (no untranslated keys at build time — CI fails if `en.json` is missing keys present in `ar.json`, checked via a `scripts/check-i18n.ts` runner).
- Pseudocode for keys:

  ```json
  {
    "home.streak": { "ar": "سلسلة {{days}} أيام", "en": "{{days}}-day streak" },
    "deed.markCompleted": { "ar": "تم إنجاز التحدي (+{{xp}} XP)", "en": "Mark as Completed (+{{xp}} XP)" },
    "deed.tabs.evidence":  { "ar": "الدليل",  "en": "Evidence" },
    "deed.reference.quran":  { "ar": "قرآن كريم",    "en": "Qur'an" },
    "deed.reference.hadith": { "ar": "حديث شريف",   "en": "Hadith" },
    "deed.reference.athkar": { "ar": "أذكار",        "en": "Athkar" },
    "deed.reference.lesson": { "ar": "الدرس:",       "en": "Lesson:" },
    "deed.reference.empty":  { "ar": "لا يوجد دليل شرعي لهذا العمل بعد.", "en": "No religious evidence has been added for this deed yet." },
    "bookmarks.title":       { "ar": "قائمتي",       "en": "My List" },
    "bookmarks.empty":       { "ar": "لم تحفظ أي عمل بعد. تصفح الكتالوج وأضف ما يلهمك.", "en": "You haven't saved any deeds yet. Browse the catalog and add what inspires you." },
    "bookmarks.emptyCta":    { "ar": "تصفح الكتالوج", "en": "Browse the catalog" },
    "bookmarks.added":       { "ar": "أضيف إلى قائمتي", "en": "Added to your list" },
    "bookmarks.removed":     { "ar": "أزيل من قائمتي", "en": "Removed from your list" },
    "bookmarks.count":       { "ar": "{{count}} محفوظ", "en": "{{count}} saved" },
    "progress.label":        { "ar": "{{done}} من {{total}}", "en": "{{done}} of {{total}}" },
    "category.completed":    { "ar": "اكتمل هذا الصنف!", "en": "Category complete!" },
    "skip.toggle":          { "ar": "غير مناسب لي", "en": "Not for me" },
    "skip.undoToggle":      { "ar": "إلغاء التخطي", "en": "Un-skip" },
    "skip.sectionTitle":    { "ar": "الأعمال التي تخطيتها", "en": "Skipped deeds" },
    "skip.sectionEmpty":    { "ar": "لم تتخطَّ أي عمل بعد.", "en": "You haven't skipped any deeds yet." },
    "skip.lockedHint":      { "ar": "هذا العمل لا يناسبك، يمكنك العودة إليه متى ما استطعت.", "en": "This deed isn't right for you. You can come back to it anytime." }
  }
  ```

### 8.2 RTL

- `I18nManager.allowRTL(true)` at module init, `I18nManager.forceRTL(isRTL)` before `AppRegistry.registerComponent`.
- Layout uses logical Tailwind utilities (`ms-`, `me-`, `start`, `end`, `text-start`). A lint rule forbids `ml-*` / `mr-*` / `text-left` / `text-right` in component files (custom `eslint-plugin-localization` local rule, see TICKETS Phase 1).
- Number formatting via `Intl.NumberFormat` with the active locale.
- Dates formatted with `Intl.DateTimeFormat`.

### 8.3 Locale detection

- On boot: read device locale via `expo-localization`, fall back to `ar` (default).
- User override stored in AsyncStorage under key `app.locale`; takes precedence on next launch.

---

## 9. Theming (Light / Dark / System)

### 9.1 Tokens (NativeWind `tailwind.config.js`)

```
colors:
  // Surfaces
  bg:           { light: '#FFFFFF', dark: '#0B1220' }
  surface:      { light: '#F7F7F7', dark: '#121A2B' }
  elevated:     { light: '#FFFFFF', dark: '#1A2438' }
  border:       { light: '#E5E5E5', dark: '#22304D' }
  // Text
  text-primary: { light: '#1F1F1F', dark: '#F4F4F5' }
  text-muted:   { light: '#777777', dark: '#A1A1AA' }
  // Brand
  brand-green:  { light: '#58CC02', dark: '#58CC02' }   // Duolingo-ish
  brand-blue:   { light: '#1CB0F6', dark: '#1CB0F6' }
  accent-gold:  { light: '#FFC800', dark: '#FFC800' }
  accent-fire:  { light: '#FF4D4D', dark: '#FF7A7A' }
  // States
  locked:       { light: '#E5E5E5', dark: '#2A3344' }
  success:      { light: '#58CC02', dark: '#58CC02' }
  warning:      { light: '#FFC800', dark: '#FFC800' }
  danger:       { light: '#FF4D4D', dark: '#FF7A7A' }
```

### 9.2 Strategy

- NativeWind `darkMode: 'class'` (not `media`).
- `<ThemeProvider>` toggles a top-level `class="dark"` (or removes it) on the root view.
- Persisted mode under AsyncStorage key `app.theme`.
- Always provide `accessibilityRole` and contrast-aware variants. Verify AA contrast in both modes via `scripts/check-contrast.ts` (Phase 3).

### 9.3 System integration

- Respect OS `Appearance.addChangeListener`; when `mode === 'system'`, mirror OS flips live.
- Animated transitions on theme switch via Reanimated `useReducedMotion`-aware fade.

---

## 10. Folder Layout

```
sabiqoo/
├── app/                      # Expo Router
├── src/
│   ├── components/           # see §6
│   ├── db/                   # drizzle schema + migrations
│   │   ├── schema.ts
│   │   └── migrations/
│   ├── repos/                # deedsRepo, logsRepo, profileRepo, unitsRepo, bookmarksRepo, skippedRepo
│   ├── stores/               # zustand: themeStore, localeStore, profileStore
│   ├── gamification/         # xp.ts, level.ts, streak.ts (pure functions)
│   ├── i18n/
│   │   ├── index.ts
│   │   ├── ar.json
│   │   └── en.json
│   ├── theme/                # tokens.ts, ThemeProvider.tsx
│   ├── hooks/                # useDeed, useLogs, useProfile, …
│   └── utils/                # dates, numbers, haptics
├── assets/
│   ├── animations/           # confetti.json (Lottie)
│   └── sounds/               # click.mp3, chime.mp3
├── scripts/                  # check-i18n.ts, check-contrast.ts, seed.ts
├── __tests__/
├── tailwind.config.js
├── nativewind-env.d.ts
├── eas.json
├── app.json
├── tsconfig.json
├── package.json
├── SPEC.md
└── TICKETS.md
```

---

## 11. Testing Strategy

- **Unit** (Jest): gamification pure functions, repos with in-memory SQLite, theme tokens, i18n key parity.
- **Component** (RNTL): `BigButton3D`, `Node`, `RoadmapPath`, `QuantityStepper`.
- **Snapshot** (RNTL): Challenge Detail layout in light + dark + RTL.
- **Manual smoke matrix** (Phase 3 checklist in TICKETS):
  - Light + Dark + System
  - AR + EN
  - First-run seeding, empty state, 1 log, 1000 logs
  - Streak breaks, freeze consume, refill
  - Level-up with 1 log and with many logs

---

## 12. Accessibility

- Min 44×44 tap targets on roadmap nodes and the big button.
- `accessibilityLabel` / `accessibilityHint` on every interactive element.
- `accessibilityRole="button"`, `"header"`, `"image"` set explicitly.
- Respect `AccessibilityInfo.isReduceMotionEnabled` — confetti becomes a brief banner.
- Honor OS font scaling up to 1.3× without horizontal scroll on screens.

---

## 13. Phased Delivery (mirrors TICKETS.md)

- **Phase 1 — Foundation**: project init, NativeWind, providers, DB + seed, base components.
- **Phase 2 — Core Screens**: Roadmap, Challenge Detail, Catalog, History.
- **Phase 3 — Polish & Launch**: Gamification engine, celebration, haptics/sound, a11y, contrast audit, EAS builds.

Each phase ends with a working, demoable APK via `eas build --profile preview`.

---

## 14. Risks & Open Questions

| Risk | Mitigation |
|---|---|
| `I18nManager.forceRTL` requires app restart in managed workflow. | Detect locale → show a one-time "Restart required" banner if changed mid-session. |
| `@expo/vector-icons` font fetch can lag on cold boot. | Preload fonts in `_layout.tsx` via `useFonts` with splash gate. |
| SQLite on Android sometimes resets if `.db` file path changes between Expo Go and EAS builds. | Hard-pin DB file path via `expo-sqlite` `openDatabaseAsync` constant. |
| Dark mode contrast issues for gold text on dark elevated surfaces. | CI check-contrast script + manual design review. |
| Roadmap branching UX confusion (which branch advances the shared unlock?). | Always show a tooltip the first time a branch diverges. |

---

_End of SPEC.md_
