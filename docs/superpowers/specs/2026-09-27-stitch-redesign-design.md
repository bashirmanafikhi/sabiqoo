# Sabiqoo Stitch Redesign — Design Spec

> Full visual redesign of the Sabiqoo mobile app to match the Stitch designs at
> `https://stitch.withgoogle.com/projects/12785628215698737325`.

**Date:** 2026-09-27
**Status:** Approved (brainstorming skill, all 3 sections signed off)
**Approach:** In-place token + component refactor (Approach A)
**Scope:** All 4 visible Stitch screens + App Icon + Settings/Bookmarks re-skin

---

## 1. Why this change

The current app ships the older green/blue/gold "Sabiqoo Tactile Play" Stitch
design. The latest Stitch project contains a complete recolor to a **coral /
navy / tangerine / amber-gold** palette, with new typography (Epilogue headlines
+ Plus Jakarta Sans body), a new top HUD, a new bottom-nav style, and new screen
layouts for Roadmap, Catalog, History, and Deed Detail.

The user wants the app to ship the new design end-to-end, with bilingual
(English + Arabic) subtitles paired to every primary label, and the Settings +
Bookmarks pages re-skinned into the same system even though Stitch did not
redesign them.

The four hidden Stitch screens in the project are older green duplicates of the
same four screens plus the 512×512 App Icon SVG. They are not separate scope.

---

## 2. Color tokens

Replace the existing Tailwind palette in `tailwind.config.js` and the
`ColorPalette` in `src/theme/tokens.ts` with this set. **Green is removed
entirely.**

### Light mode

| Token | Hex | Role |
|---|---|---|
| `coral` | `#EA5455` | Primary CTA, active node, streak indicator |
| `coral-dark` | `#C83E40` | 3D bevel under coral |
| `navy` | `#2D4059` | Headlines, unit header bg, dark CTA, avatar |
| `navy-dark` | `#1D2B3D` | Deeper bevel under navy |
| `tangerine` | `#F07B3F` | Progress fills, increment CTA, active category |
| `tangerine-dark` | `#CF6027` | 3D bevel under tangerine |
| `amber-gold` | `#FFD460` | XP pill, mastery stars, achievement badges |
| `amber-gold-dark` | `#D4A838` | 3D bevel under gold |
| `background` | `#F8F9FF` | Canvas |
| `surface-container-lowest` | `#FFFFFF` | Cards |
| `surface-container-low` | `#EFF4FF` | Popovers |
| `surface-container` | `#E6EEFF` | Inset surfaces |
| `surface-container-high` | `#DCE9FF` | Pill bg |
| `surface-container-highest` | `#D3E4FE` | Hover/pressed |
| `on-surface` | `#2D4059` | Primary text |
| `on-surface-variant` | `#5B6E85` | Secondary text |
| `outline` | `#8D706E` | Outlines / dividers |
| `outline-variant` | `#E1BFBC` | Subtle borders |

### Dark mode

| Token | Hex | Role |
|---|---|---|
| `coral` | `#FF8A8B` | Primary CTA |
| `coral-dark` | `#A53031` | Bevel |
| `navy` | `#EAF1FF` | Text |
| `navy-dark` | `#0E1A2C` | Bevel |
| `tangerine` | `#FF9C66` | Secondary |
| `tangerine-dark` | `#B8521D` | Bevel |
| `amber-gold` | `#FFD460` | (same) |
| `amber-gold-dark` | `#B8912A` | Bevel |
| `background` | `#0E1A2C` | Canvas |
| `surface-container-lowest` | `#16243A` | Cards |
| `surface-container-low` | `#1B2C44` | Popovers |
| `surface-container` | `#1E2F49` | Inset surfaces |
| `surface-container-high` | `#243651` | Pill bg |
| `surface-container-highest` | `#2A3E5E` | Hover/pressed |
| `on-surface` | `#EAF1FF` | Primary text |
| `on-surface-variant` | `#A6B6CC` | Secondary text |
| `outline` | `#5B6E85` | Outlines |
| `outline-variant` | `#3A4A66` | Borders |

### Removed (no replacement — call sites migrated)

- `brand-green`, `brand-green-dark`, `brand-blue`, `brand-blue-dark`
- `accent-gold`, `accent-gold-dark`
- `slate-blue`, `slate-blue-dark`
- `state-locked`, `state-locked-dark`
- `ink`, `paper`, `success`, `warning`, `danger`

---

## 3. Typography

Add three font families via `expo-font`:

| Family | Dep | Weights | Used for |
|---|---|---|---|
| Epilogue | `@expo-google-fonts/epilogue` | 500, 600, 700, 800, 900 | All headlines, labels, stat numbers |
| Plus Jakarta Sans | `@expo-google-fonts/plus-jakarta-sans` | 400, 500, 600, 700, 800 | Body, button text |
| Cairo | `@expo-google-fonts/cairo` | 700, 800, 900 | Arabic subtitles (paired weight match) |

Type scale (matches Stitch tokens exactly):

| Token | Size / Line | Weight | Tracking |
|---|---|---|---|
| `display-hero` | 36/44 | 800 | -0.02em |
| `display-hero-mobile` | 28/34 | 800 | -0.01em |
| `headline-lg` | 24/32 | 800 | -0.01em |
| `headline-md` | 20/28 | 700 | — |
| `headline-sm` | 18/24 | 700 | — |
| `body-lg` | 16/24 | 600 | — |
| `body-md` | 14/20 | 500 | — |
| `body-sm` | 12/16 | 500 | — |
| `label-lg` | 15/20 | 800 | 0.04em |
| `label-md` | 12/16 | 800 | 0.05em |
| `label-sm` | 10/14 | 800 | 0.06em |

Labels are uppercase, headlines use `tracking-tight`.

---

## 4. Spacing & radii

`tailwind.config.js` extended with:

```
spacing: {
  gutter: '1rem', margin: '1.25rem', margin-mobile: '1rem',
  'space-xs': '0.25rem', 'space-sm': '0.5rem',
  'space-md': '1rem', 'space-lg': '1.5rem', 'space-xl': '2.5rem'
}
borderRadius: {
  sm: '0.25rem', DEFAULT: '0.5rem', md: '0.75rem',
  lg: '1rem', xl: '1.5rem', full: '9999px'
}
```

The 3D bevel shadow helper (`shadow-[0_4px_0_<bevel-hex>]`) is captured in a
`<Button3D>` primitive so consumers don't repeat it.

---

## 5. Components

All components live in `src/components/`. File paths preserved where possible.

### New primitives

| Component | Replaces | Notes |
|---|---|---|
| `Button3D.tsx` | `BigButton3D.tsx` | Variants: `coral`, `tangerine`, `navy`, `gold`. 52–56px. Press → translateY(3px). |
| `AppTopBar.tsx` | (header in tabs) | Streak pill, XP pill, saved counter, lang toggle, settings, avatar. |
| `AppBottomNav.tsx` | (tabs default) | 3 tabs: Roadmap / Catalog / History. Active = coral. |
| `HudPill.tsx` | `StreakBadge.tsx` + `XpBar.tsx` | Variants: `coral`, `gold`, `navy`, `outline`. 36px tall, `rounded-full`. |
| `UnitHeader.tsx` | (new) | Navy 3D card with icon, bilingual title, tangerine progress bar. |
| `RoadmapNode.tsx` | `Node.tsx` | 5 states: `mastered` (gold+star+flame badge), `completed` (gold+check), `available` (coral+aura+pulse), `locked` (slate+lock), `skipped` (slate+eye-off). |
| `RoadmapPathSvg.tsx` | `RoadmapPath.tsx` | SVG serpentine connector with 4 stroke layers (track + active + branch A/B dashed). |
| `ActiveDeedSheet.tsx` | (new) | Bottom sheet triggered by tapping available node. |
| `RewardChestModal.tsx` | (new) | Mystery gift popup with gold chest. |
| `Toast.tsx` | (new) | Navy floating snackbar, 3s auto-dismiss. |
| `CategoryChip.tsx` | (new) | Filter chip, optional progress ring. Active = coral 3D; outline = navy border. |
| `CatalogDeedCard.tsx` | `DeedCard.tsx` | Stripe-coded (mastered coral / completed tangerine / available gold or navy / locked outline-variant / skipped). |
| `HeatmapGrid.tsx` | (new) | 7-col × 5-row grid with intensity buckets. |
| `StatCard.tsx` | (new) | History grid card. |
| `MilestoneBanner.tsx` | (new) | Navy gradient banner, `military_tech` icon. |
| `RecentDeedCard.tsx` | `LogRow.tsx` | History row card. |
| `SegmentedControl.tsx` | `settings/_SegmentedControl.tsx` | 3-tab pill control reused by Deed Detail. |
| `QuantityStepper.tsx` | (existing) | Tangerine increment bevel, neutral decrement. |
| `ProgressBar.tsx` | `UnitProgress.tsx` | Tangerine-on-navy for units; coral-on-surface for general. |
| `Bilingual.tsx` | (new) | `primary` (headline) + `secondary` (body, navy/70). LTR/RTL-aware. |
| `ConfettiOverlay.tsx` | (existing) | Recolor Lottie keyframes. |

### Removed

- `BigButton3D.tsx`, `Node.tsx`, `RoadmapPath.tsx`, `DeedCard.tsx`,
  `LogRow.tsx`, `StreakBadge.tsx`, `XpBar.tsx`, `CategoryCard.tsx`,
  `ProgressBadge.tsx`, `ReferenceCard.tsx`, `SkipToggle.tsx`,
  `UnitProgress.tsx`, `HeartButton.tsx` — replaced by the primitives above.

### App icon

Replace `app.json` icon assets with the 512×512 SVG Stitch provided. Rasterize
to PNGs at 192, 256, 384, 512 for native. Keep a 1024 marketing version in
`assets/`.

---

## 6. Screens

### 6.1 Roadmap — `app/(tabs)/index.tsx`

Zones top to bottom:

1. **Sticky header** — `<AppTopBar />` (streak + XP + saved + lang + settings + avatar).
2. **Level & quest pill card** — gold `workspace_premium` tile with `L3` coral badge, "Path of Barakah / Level 3", "Daily Goal: 2 deeds remaining", and a `redeem` chest button with pulsing dot.
3. **Unit sections** — one per unit:
   - `<UnitHeader>` navy banner with icon, bilingual title (`Smiles & Kind Words` / `تبسم وكلمة طيبة`), tangerine progress bar.
   - `<RoadmapPathSvg>` serpentine connector.
   - `<RoadmapNode>`s positioned at `left-[X%]` per Stitch (28%, 72%, 26%, 50%, etc.).
   - **Fork / branching section** when the unit has branch alternatives — two side-by-side node buttons labeled "Choice A: Spiritual" (navy) and "Choice B: Financial" (tangerine).
4. **Active node tap** → opens `<ActiveDeedSheet>` (slide-in from bottom, coral hero icon, reward pill, hadith quote, big coral CTA "Mark as Done").
5. **Chest button tap** → opens `<RewardChestModal>`.
6. **Floating `<Toast>`** for action confirmations.

### 6.2 Catalog — `app/(tabs)/catalog.tsx`

1. Search bar (rounded `surface-container`, navy text, coral focus ring).
2. Counter strip "Showing N of M deeds" + Filters button.
3. Horizontal `<CategoryChip>` row with optional progress rings.
4. Active Realm banner (gold `emoji_events` tile, mastery progress).
5. `<CatalogDeedCard>` vertical list with stripe colors encoding state:
   - coral stripe → mastered
   - tangerine stripe → completed
   - gold stripe → available
   - navy stripe → available (alternate)
   - outline-variant stripe → locked
   - no stripe, dimmed → skipped
6. Empty state with `manage_search` icon and "Clear All Filters" coral CTA.

### 6.3 History & Analytics — `app/(tabs)/history.tsx`

1. `<AppTopBar />`.
2. Page header: bilingual ("Spiritual Footprint" / `سابقوا • Journey Log`) + coral Share button.
3. Hero streak card (col-span-3, coral 7-day streak, record, freeze counter).
4. Stat grid: Total Deeds / XP / Score cards.
5. Heatmap card — `<HeatmapGrid>` 7×5 tiles colored by intensity bucket.
6. Category distribution — 5 rows with icon, label, count, percentage, progress bar.
7. Recent deeds list — `<RecentDeedCard>` rows with XP pill.
8. `<MilestoneBanner>` gradient navy card at the bottom.

### 6.4 Challenge Detail — `app/deed/[id].tsx`

Top bar: back chevron · "Saved Deeds" title (Stitch shows this; will rename per data) · avatar.

1. Sub-header: "Day 14 Journey" coral-stars pill, bookmark heart (filled coral), skip "visibility_off" tooltip.
2. **`<SegmentedControl>`** for 3 tabs.
3. **Today tab**: category pill + XP pill · hero card with coral-tangerine gradient deed icon · bilingual title · description · badge strip (Easy / Repeatable / Sunnah) · `<QuantityStepper>` · personal-note textarea · inspiration card with image · big coral CTA "Mark as Completed (+N XP)" · celebration banner (gold, hidden until completion) · prophetic wisdom preview.
4. **Evidence tab**: primary evidence card (source header, Arabic calligraphy block, translation, key-lesson box), secondary supportive reference, tangerine inspiring callout.
5. **History tab**: stats strip (All-Time Duas Sent / Total XP) · recent completions timeline · consistency streak footer.

### 6.5 Bookmarks — `app/bookmarks/index.tsx`

Re-skin only: new `<AppTopBar>` header, coral filled-heart for bookmarked items, navy headings, gold XP pills. Layout kept.

### 6.6 Settings — `app/settings/index.tsx`

Re-skin only: navy headings, segmented control uses `<SegmentedControl>`, coral primary CTA, tangerine secondary.

---

## 7. App shell

`app/_layout.tsx` wraps the existing `Stack` with `<AppTopBar />` slot
(`headerShown: false` everywhere — the top bar is part of each screen's body).
`app/(tabs)/_layout.tsx` keeps `<Tabs>` from expo-router and overrides
`tabBar={() => <AppBottomNav />}`.

---

## 8. Bilingual & RTL

- Every primary string gets an `en` + `ar` entry in
  `src/i18n/locales/{en,ar}.json`. Existing keys unchanged; new keys grouped
  under `roadmap.*`, `catalog.*`, `history.*`, `deedDetail.*`.
- `<Bilingual primary secondary />` renders primary (headline font) on top and
  secondary (body font, navy/70) below. Uses `dir="auto"` on each string so
  Arabic text reads correctly inside the LTR layout.
- Arabic subtitles use `Cairo` (Black/Bold/SemiBold) mapped at 800/700/500 to
  mirror Plus Jakarta Sans weights.
- `src/i18n/LocaleProvider.tsx` adds `direction: 'ltr' | 'rtl'` flag and flips
  `dir` on the root view when locale is `ar`.
- The Settings page keeps the existing ع/EN toggle and is the canonical place
  to switch.

---

## 9. Data flow

- **No DB schema or migration changes.**
- `src/db`, `src/repos`, `src/stores`, `src/gamification` are untouched.
- Components consume the existing `useUnits()`, `useDeeds()`, `useProgress()`,
  `useCompleteDeed()` hooks as before.
- `<ActiveDeedSheet>` reuses `useCompleteDeed()`.
- `<HeatmapGrid>` is fed the existing 30-day log; intensity buckets are computed
  client-side from `deedCount`.

---

## 10. Dependencies

Add (devDependencies and runtime):

```
@expo-google-fonts/epilogue
@expo-google-fonts/plus-jakarta-sans
@expo-google-fonts/cairo
```

No version conflicts expected with Expo SDK 51.

---

## 11. Files that change

```
tailwind.config.js
global.css
src/theme/tokens.ts
src/theme/ThemeProvider.tsx
src/components/*.tsx                          (rebuild)
src/i18n/LocaleProvider.tsx
src/i18n/locales/en.json
src/i18n/locales/ar.json
app/_layout.tsx
app/(tabs)/_layout.tsx
app/(tabs)/index.tsx
app/(tabs)/catalog.tsx
app/(tabs)/history.tsx
app/deed/[id].tsx
app/deed/_Header.tsx
app/deed/_TodayTab.tsx
app/deed/_EvidenceTab.tsx
app/deed/_HistoryTab.tsx
app/deed/_helpers.ts
app/bookmarks/index.tsx
app/settings/index.tsx
app/settings/_SegmentedControl.tsx
app.json                                      (icon)
assets/icon-*.png                             (regenerated)
package.json
__tests__/components/*.test.tsx
__tests__/screens/*.test.tsx

## 11a. Cleanup at start of implementation

The following legacy artifacts are deleted as the first step of implementation
(replacing them with the new system):

- `STYLE.md` — root-level, documents the old green/blue/gold palette. Deleted.
- `assets/illustrations/` — entire folder (`nodes/`, `trophies/`, `confetti/`,
  `README.md`). Replaced by the new component primitives
  (`RoadmapNode`, `CatalogDeedCard`, `Button3D`, etc.) and the new Lottie
  confetti is generated fresh keyed to the coral/navy/tangerine/gold palette.
```

---

## 12. Testing

Using `@testing-library/react-native` (already configured).

- **Components**: `Button3D` (variants + press), `RoadmapNode` (5 states),
  `HeatmapGrid` (intensity buckets), `SegmentedControl` (tab switching),
  `QuantityStepper`, `AppTopBar`, `AppBottomNav`, `Bilingual`.
- **Screens**: `RoadmapScreen` snapshot of level card + one node state,
  `CatalogScreen` filter + empty state, `HistoryScreen` render,
  `ChallengeDetailScreen` tab switching.
- **Locale**: switching `direction` re-flows the top bar without crashing.
- **Manual**: iOS / Android / Web smoke for press states, focus outlines, RTL.

---

## 13. Out of scope (explicit)

- DB schema migrations.
- Auth / accounts / sign-in.
- Push notifications.
- Lottie confetti redesign (existing assets recolored only).
- The 7 hidden Stitch screens (they are older green duplicates of the 4 visible
  screens and the 512×512 app icon; not separate scope).

---

## 14. Reference

- Stitch project: https://stitch.withgoogle.com/projects/12785628215698737325
- Visible screens: Roadmap (`4c58ca2c…`), Catalog (`f09d5e7b…`), History
  (`d161d95e…`), Challenge Detail (`2123102736…`).
- Existing project docs: `docs/DESIGN_BRIEF.md`, `docs/STYLE.md`,
  `SPEC.md`, `STATUS.md`, `TICKETS.md`.
