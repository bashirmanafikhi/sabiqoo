# Product

<!-- impeccable:product-schema 1 -->

## Platform

android

## Users

Muslims who want a gentle, no-friction way to keep a daily habit of good deeds — small acts that fit into any lifestyle. Primary shipping target is Android (single codebase also builds for iOS via Expo). Situations: a short daily open-and-do session — open the app, check off today's deeds, close it.

## Product Purpose

Sabiqoo (سابقوا) — from the Qur'anic imperative "فَاسْتَبِقُوا الْخَيْرَٰتِ" — is a simple daily deed tracker. The user keeps a short personal list of deeds, taps to mark them done each day, and watches a streak and a 30-day heat map grow. Success means: opening the app and logging a deed takes under 5 seconds, and the app is understandable without any onboarding.

## Positioning

A fully offline-first, privacy-first, local-only habit tracker (expo-sqlite, no accounts, no sync, no network). It logs, never transacts: deeds are recorded, not paid through the app.

## Operating Context

- Solo, personal use; no account, no sync.
- Use moments are short and daily: open → Today list → tap check → done.
- The MVP deliberately ships **no** roadmap/units, no XP/levels/achievements, no catalog of 170 deeds, no bookmarks/skip, no evidence (Qur'an/hadith) tabs, no notes/quantities. These were removed because the UI had grown complicated; they can be reintroduced later only if they serve the daily loop.
- Core screens: **Today** (deed list + check-off + streak) → **Add deed** (suggestions + custom) → **Progress** (streaks, 30-day heat map, per-deed totals) → **Settings** (language, theme, erase data).

## Capabilities and Constraints

- Offline-first, 100% local persistence; no multi-device sync, no social/leaderboards, no payments, no AI.
- Bilingual: Arabic (default, RTL) + English (LTR); all strings via i18n with full key parity.
- Light / Dark / System theming; semantic tokens only, no hard-coded hexes in components.
- One log per deed per day: tapping the check marks it done, tapping again undoes it. Streaks are computed from the log history, not stored.
- Stack: React Native + Expo SDK 57, TypeScript (strict), NativeWind/Tailwind, Expo Router (3 tabs + 1 push screen), Drizzle ORM + expo-sqlite (2 tables: `deeds`, `logs`), Reanimated for the primary button press effect.
- First run seeds 5 starter deeds (charity, 5 minutes of Quran, istighfar, adhkar, helping someone) so the Today list is actionable immediately; 16 curated bilingual suggestions are offered on the Add screen.

## Brand Commitments

- Name: Sabiqoo (سابقوا); Qur'anic origin of the name is a binding identity fact.
- Voice: friendly, warm, motivating — never preachy, never guilt-driven; reward > punishment.
- Calm, playful design: the existing token system (coral/navy/gold, Cairo for Arabic, Jakarta/Epilogue for Latin) is kept; decoration is limited to the 3D primary button.

## Evidence on Hand

- PRODUCT.md (this document) and the code itself; SPEC.md/FEATURES.md/STATUS.md/TICKETS.md describe the pre-MVP scope and are historical.
- Curated deed suggestions live in `src/db/suggestions.ts`; no other content assets are shipped, and none may be fabricated.

## Product Principles

- One glance, one tap: the Today screen must answer "what do I do?" and log it in seconds.
- Simple beats rich: a feature that adds a decision or a screen must earn its place against the daily loop.
- Reward over guilt: celebration on completion, no shaming for missed days (the streak simply resets).
- Privacy and offline as defaults: the app must work fully with no cloud.
- Gentle bilingual-first: Arabic RTL is the default experience, not a translation afterthought.

## Accessibility & Inclusion

- RTL layout correctness is a requirement, not a preference (logical `start`/`end` layout, `dir="auto"` on user-facing text).
- `react-native-a11y` lint rules active — accessibility labels/hints are completed as screens are touched.
- Touch targets and contrast per Android platform guidance (Material 3: 48×48 dp targets; dark theme is a first-class scheme).
