# Sabiqoo — UI/UX Design Brief

> **Scope of this document**: every screen, every reusable component, every interaction state, and every data field shown. Style, palette, typography, illustration style, and motion language are intentionally **omitted** so the designer can innovate freely.
>
> **How to use**: hand this to a UI/UX AI agent (or human designer) and ask for high-fidelity mocks of every screen, plus a component library.

---

## 1. App at a glance

- **Name**: Sabiqoo (سابقوا) — "those who race forward" (Qur'anic phrasing about racing toward good deeds).
- **Platform**: React Native (Expo SDK 51). iOS + Android. Bottom-tab navigation.
- **Audience**: Muslims who want a gentle, gamified way to build a daily habit of charitable acts and good deeds — small enough to fit into any lifestyle.
- **Voice**: friendly, warm, motivating. Never preachy. Never guilt-driven. Reward > punishment.
- **Core promise**: every session must offer **at least one easy deed** the user can complete in under 60 seconds.

### What the user does

1. Opens the app → sees a **roadmap** of 150+ deeds organised into 8 thematic units (Smile, Kind Words, Kinship, Neighborly Acts, Animals, Financial Charity, Sadaqah Jariyah, Hands-on Service).
2. Taps a green **available** deed → opens detail screen → taps a big "Mark as Completed" button → confetti + XP + streak tick.
3. Optional: bookmarks deeds for later, marks deeds as "Not for me" if they don't fit the user's situation, reads Qur'an/Hadith evidence attached to each deed, reviews the heatmap of past activity.

---

## 2. Information architecture

```
Bottom tabs
├── Map        (Roadmap, home)            — main screen, large visual path
├── Catalog                              — flat browse, search, filter
└── History                              — analytics + activity log

Reached from header icons on Map
├── Bookmarks    (My List)              — saved deeds, header-icon → screen
└── Settings                             — preferences + skipped management

Modal push from any node / card
└── Deed detail                         — 3 tabs (Today / Evidence / History)
```

Bottom tab bar is **always visible** on Map, Catalog, History. Bookmarks, Settings, and Deed Detail are full-screen pushes (no tab bar).

---

## 3. Screens

### 3.1 Roadmap (home / Map tab)

**Purpose**: show every deed the user can attempt right now + the broader path so they feel motivated.

**Layout zones, top to bottom**

| Zone | Content |
|---|---|
| **Header bar** (sticky, full width) | Streak chip · XP/Level pill · heart icon → Bookmarks · language toggle (EN / ع) · settings cog |
| **Unit cards** (vertically stacked, scrollable) | One card per unit. Each card holds: unit title · unit progress (x / y) · a serpentine path of nodes with curving roads between them |

**Node states** (in priority order — earlier wins)

| State | Visual cue | When |
|---|---|---|
| Mastered | gold star with flame badge in corner | deed completed ≥10 times |
| Completed | gold disc, white star center | deed completed ≥1 time |
| Available | green disc, white star, gentle pulse | deed is unlocked but not yet done |
| Skipped | slate-blue disc, eye-off + diagonal slash | user marked "Not for me" |
| Locked | grey disc, lock icon center | deed not yet reachable |

**Path geometry**

- Each unit's path alternates nodes between a **left lane** and a **right lane**.
- A continuous **curving road** (Bézier) connects every consecutive pair of nodes.
- Roads that connect two reachable nodes are drawn in a positive (encouraging) color; roads that lead into a locked segment are drawn muted.
- Branching: if two adjacent deeds are flagged as "alternative branches" of the same theme, the road forks briefly then merges into the next node.

**Interactions**

- Tap any non-locked node → push Deed Detail.
- Pull-to-refresh re-queries the DB.
- Scroll reveals units in `sort_order`.

**Empty state**

- Zero deeds reachable (impossible after seed, but for safety): show centered illustration + "Pull down to refresh" copy.

---

### 3.2 Catalog

**Purpose**: let users browse the full library of deeds, search by keyword, filter by category.

**Layout zones**

| Zone | Content |
|---|---|
| **Header** | Search input (full width, with search icon left, placeholder text right) |
| **Category chip strip** | Horizontally scrolling row of chips. Each chip = category name + (done / total) progress badge. Multi-select: tapping toggles inclusion. Active chips visually emphasized. |
| **Deed list** | Vertical `FlatList`, **single column**, full-width rows. Each row is a tile (see DeedCard §4.5). 10-px vertical gap between tiles. |
| **Empty state** | Centered icon + copy "No deeds match your search." + CTA "Clear filters" |

**Filtering rules**

- Search matches `title` + `description` (case-insensitive, locale-aware).
- Category chips are AND-ed with search (both filters apply).
- Selected categories are highlighted; tapping a selected one unselects it.

**DeedCard row contents**

| Field | Position | Notes |
|---|---|---|
| Color stripe | Left edge, 6–8 px wide | Category color |
| Title | Main content | Up to 2 lines, ellipsised |
| XP label | Below title | `+15 XP` format |
| Lock icon | Right of title | Shown only when locked |
| Bookmark (heart) | Rightmost | Toggles bookmark state |
| Skip toggle (eye) | Right of heart | Toggles "Not for me" |

**Interactions**

- Tap row body → push Deed Detail.
- Tap heart → toggle bookmark (no navigation; row stays).
- Tap eye → toggle skip (no navigation).
- Search input is debounced (300 ms).

---

### 3.3 History

**Purpose**: visualize the user's consistency over time and per-category.

**Layout zones**

| Zone | Content |
|---|---|
| **Last-30-days heatmap** | A 30-cell grid (one per day), colored by activity count for that day. Light = no activity, saturated = multiple deeds. |
| **By-category breakdown** | A list or chart showing every category, the user's done / total for that category, and a horizontal bar visualization. |
| **Activity log** | Reverse-chronological list of every completion. Each row: time · quantity · XP · deed title · note preview. |

**Empty state**

- No logs ever → centered illustration + "Your first deed is waiting" CTA → Catalog tab.

---

### 3.4 Settings

**Purpose**: theme + language preferences; streak-freeze management; skipped-deeds management; about info.

**Layout zones** (vertical sections, each with a section title)

| Section | Content |
|---|---|
| **Appearance** | Theme picker (System / Light / Dark, segmented control); Language picker (العربية / English, segmented control) |
| **Streak Freeze** | Freeze count badge (e.g., "2 freezes available"). Below: "Use a freeze" button (disabled if count == 0). Below that: helper text explaining what a freeze does. |
| **Skipped Deeds** | Section title. List of every deed the user marked as "Not for me". Each row: localized deed title + Un-skip button. Empty state: "You haven't skipped any deeds yet." |
| **About** | App name · version (from package.json) · short tagline |

---

### 3.5 Bookmarks ("My List")

**Purpose**: surface deeds the user explicitly saved for later.

**Layout zones**

| Zone | Content |
|---|---|
| **Header** | Screen title "My List" · back button |
| **List** | Same `DeedCard` component used in Catalog, ordered by `created_at` descending (most-recently-saved first) |
| **Empty state** | Centered illustration + copy "You haven't saved any deeds yet. Browse the catalog and add what inspires you." + CTA button "Browse the catalog" |

---

### 3.6 Deed Detail (modal push)

**Purpose**: the per-deed hub. Show what to do today, what evidence supports it, what the user has done historically.

**Layout zones**

| Zone | Content |
|---|---|
| **Header** | Back arrow · title (localized) · bookmark heart toggle · skip eye toggle (filled if currently skipped) |
| **Tab strip** | Three tabs in fixed order: **Today** · **Evidence** (الدليل) · **History** |
| **Tab content** | See below |

**Today tab (default)**

| Element | Detail |
|---|---|
| Hero icon | Large category icon, centered or top-aligned |
| Title | Large, bold, localized |
| Category badge | Small pill with category name |
| XP label | "+15 XP" |
| Quantity stepper | - / value / +. Value defaults to 1, range 1–50. Min and max disabled visually. |
| Note input | Multi-line text area, optional, placeholder "Add a note (optional)" |
| **Big 3D action button** | Full-width primary CTA, label "Mark as Completed (+15 XP)" — visible at the bottom |

**Evidence tab**

| Element | Detail |
|---|---|
| Group: Qur'an | One card per Qur'an reference. Card shows: source citation ("Surah Al-Baqarah 2:261"), Arabic text block (RTL), optional English translation toggle, optional lesson. |
| Group: Hadith | Same card layout, prefixed with narrator if present. |
| Group: Athkar | Same card layout. |
| Empty state | "No religious evidence has been added for this deed yet." |

**History tab**

| Element | Detail |
|---|---|
| Grouped by day | Sticky day headers: Today / Yesterday / N days ago (localized) |
| Row | Time · deed title · quantity · XP · note preview truncated to one line |
| Empty state | "No completed deeds yet." |

**Celebration overlay**

Triggered immediately after Mark Completed. Full-screen modal for ~1.5 s, then auto-dismisses.

- Stars (1 / 2 / 3) scale in from centre based on XP earned
- Streak badge floats with the new streak value
- "Well done!" localized message
- Reduce-motion fallback: skip the animation, show just the message banner

---

## 4. Component library

### 4.1 Big Button 3D

- **Purpose**: the primary action button. Always one per detail screen.
- **Variants**: primary (default), secondary, ghost.
- **States**: default · pressed (visually depresses ~3 px, shadow retracts) · disabled · loading (replaces label with a spinner).
- **Content**: text label, optional icon left/right of label.

### 4.2 Roadmap Node

- **Purpose**: a single dot in the path representing one deed.
- **Size**: 64 × 64 px circular glyph, with a 16-px-wide invisible hit-target buffer (so it's a tappable area of 80 × 80).
- **States**: locked · available · completed · mastered · skipped (see §3.1).
- **Content**: a single icon glyph centered (lock / star / star / star-with-flame / eye-off).

### 4.3 Quantity Stepper

- **Purpose**: pick how many times a deed was performed.
- **Layout**: `-` button · numeric value · `+` button. All three in a row, equal widths, large tap targets (≥64 px tall).
- **Range**: 1–50.
- **States**: at minimum → `-` disabled. At maximum → `+` disabled.

### 4.4 Heart Button

- **Purpose**: bookmark toggle.
- **States**: outline · filled.
- **Tap behaviour**: toggles state with no navigation.

### 4.5 Skip Toggle

- **Purpose**: mark a deed as "Not for me" / undo.
- **States**: outline · filled.
- **Tap behaviour**: toggles state with no navigation.

### 4.6 Deed Card (used in Catalog + Bookmarks)

- **Purpose**: a single tappable row representing one deed in a list.
- **Layout** (left to right): color stripe · title + XP · lock icon (if locked) · heart · eye.
- **Height**: ~88 px.
- **States**: default · pressed · locked (whole row dimmed, row non-tappable, lock icon shown).
- **Used in**: Catalog (170 deeds, vertical list) and Bookmarks (subset, also vertical list).

### 4.7 Streak Badge

- **Purpose**: compact streak indicator in the Roadmap header.
- **Layout**: a small chip with flame icon + day count + "days" label.

### 4.8 XP / Level Bar

- **Purpose**: show current level and progress toward the next.
- **Layout**: label "Lvl 3" or similar on the left, thin horizontal progress bar on the right.

### 4.9 Progress Badge

- **Purpose**: `x / y` count chip used on category cards and chips.
- **Layout**: small pill, monospace numerals, localized digit shapes (Arabic-Indic when AR).
- **State at 100 %**: visually distinct (warmer / celebratory fill).

### 4.10 Unit Progress

- **Purpose**: per-unit summary used as the header of each Roadmap card.
- **Layout**: unit title on the left, inline thin progress bar on the right.

### 4.11 Category Chip

- **Purpose**: filter toggle on Catalog screen.
- **Layout**: pill with category name + tiny progress badge.
- **State**: selected (visually emphasized + outline) · unselected.

### 4.12 Reference Card

- **Purpose**: one Qur'an verse / Hadith / Athkar on the Evidence tab.
- **Layout** (top to bottom):
  - Source caption ("Surah Al-Baqarah 2:261" or "Sahih Bukhari 1:1" or narrator name)
  - Arabic text block (RTL, generous line-height, large)
  - Optional English translation (toggled or always visible)
  - Optional Lesson line ("Lesson: ...")

### 4.13 Bottom Tab Bar

- **3 tabs**, fixed order: **Map** · **Catalog** · **History**.
- Each tab: icon (line / filled pair depending on active state) + label.
- Active tab visually emphasized (color + weight).

### 4.14 Header bar (Roadmap only)

- **Layout** (left → right): streak chip · XP/level pill · spacer · bookmark-heart icon · language toggle pill (EN / ع) · settings cog.
- All icons / chips are tappable targets (≥44 × 44).

---

## 5. Content / data fields (localization-aware)

Every user-visible string must have an Arabic + English translation keyed in a central i18n file. The following fields are shown across screens:

| Field | Where shown | Localization |
|---|---|---|
| `deed.title` | Catalog, Bookmarks, Deed Detail header, Roadmap (per-node tooltip if any), History log | yes (ar / en) |
| `deed.description` | Catalog tooltip (optional), Deed Detail page if any | yes |
| `deed.xp_reward` | Catalog row, Detail header, History row | numeric, with `+N XP` |
| `deed.quantity` | Detail "Today" tab, History row | numeric |
| `deed.note` | Detail "Today" input + History row preview | user-typed |
| `category.name` | Catalog chips, Deed Detail badge, Roadmap per-node label if any | yes |
| `unit.title` | Roadmap per-unit card header | yes |
| `reference.text_ar` | Detail "Evidence" tab Arabic block | always Arabic (scripture) |
| `reference.text_en` | Detail "Evidence" tab English block (optional) | yes |
| `reference.source` | Detail "Evidence" tab source caption | yes (citation format) |
| `reference.narrator` | Hadith cards only | yes |
| `reference.lesson_ar` / `lesson_en` | Detail "Evidence" tab lesson line | yes |
| `user_profile.current_xp`, `current_level`, `current_streak` | Header + Detail | numeric |
| `user_profile.streak_freezes_left` | Settings | numeric |

---

## 6. State & interaction matrix

### Loading
- Every screen with DB reads should show a skeleton (a placeholder that occupies the same space as the eventual content) rather than a spinner, so layout doesn't jump.
- Skeleton color: neutral, slightly elevated from background.

### Empty
- Catalog / History / Bookmarks / Evidence: centered icon + short copy + optional CTA. Never blank.
- Roadmap: never empty after seeding; defensive copy for "Pull down to refresh" only.

### Error
- DB read failure: toast / banner at the top of the screen with retry action. Do not crash the screen.
- Write failure: same pattern + disable the offending button until next refresh.

### Pull-to-refresh
- Available on: Roadmap, Catalog, History. Not on detail screens (data reloads on focus).

### Navigation
- Tab-bar tabs swap the active screen; backstack resets.
- Push (deeds / bookmarks / settings) adds to stack; back arrow pops.
- Header icons on Roadmap push directly (bookmarks, settings).

---

## 7. Internationalization (i18n) and RTL

- Two supported languages: **Arabic (default)** and **English**.
- **App must work in both directions**: every layout must mirror correctly.
- Numerals: Arabic locale uses Arabic-Indic digits (٠١٢…); English uses Western (012…).
- Date formatting: localized via `Intl.DateTimeFormat`.
- Plural rules: must work for both `0 days`, `1 day`, `2 days`, etc. (i18next with `Intl.PluralRules` polyfill).

---

## 8. Accessibility requirements (apply to every screen)

- **Touch targets ≥ 44 × 44 dp**.
- Every icon-only button has an `accessibilityLabel` describing what it does, in the active locale.
- Color is never the **only** carrier of meaning (Locked state must also have the lock icon, Skipped must also have the eye-off icon, etc.).
- Respect "Reduce Motion": confetti becomes a static banner; pulses reduce to no-op or fade.
- Support system font scaling up to 130 % without breaking layouts.

---

## 9. Edge cases to design for

- **Long Arabic text**: titles can be 60+ characters. Need to allow 2-line ellipsis without breaking layout.
- **Zero deeds unlocked**: shouldn't happen after seed, but the empty Roadmap state should still be designed.
- **User skipped every node in a branch**: roadmap should still look coherent (branches dim, not collapse to zero width).
- **Many completed deeds**: log list may scroll for thousands of rows — design a row that holds up at scale.
- **Offline**: app is 100 % offline. No empty-state for "no connection".

---

## 10. Page list — quick checklist for the designer

To make sure no screen is missed:

- [ ] Roadmap (Map) — header + at least 2 fully designed unit cards with 4–6 nodes each, alternating left/right, with branching on at least one unit
- [ ] Catalog — header + chip strip + populated list + empty state
- [ ] History — heatmap + category breakdown + log list + empty state
- [ ] Settings — 4 sections (Appearance, Streak Freeze, Skipped Deeds, About)
- [ ] Bookmarks — populated state + empty state
- [ ] Deed Detail — Today tab populated + Evidence tab populated with all three reference types + History tab populated
- [ ] Celebration overlay — 1-star / 2-star / 3-star variants
- [ ] Component sheet — every component in §4 with all states

---

## 11. What is **out of scope** for this brief

- Color palette, typography, illustration style — to be invented by the designer
- Animation / motion design specifics beyond the descriptions above
- Sound effects / haptic design
- App icon / launcher splash design (separate brief)
- Onboarding flow (not yet in v1)
- Push notification design
