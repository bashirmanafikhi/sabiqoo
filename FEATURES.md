# SABIQOO — Future Features

> Brainstormed candidates for releases after v1.0. Items are intentionally
> not committed tickets — they are ideas to be triaged, scoped, and
> promoted into `TICKETS.md` when work begins. Each entry lists a short
> rationale and the rough effort / impact axis so they can be prioritized.
>
> Conventions:
> - **Effort**: S = ≤ 1 day · M = 1–3 days · L = > 3 days
> - **Impact**: H = high retention/engagement · M = noticeable · L = niche
> - **Depends on**: prerequisites already shipped or in the active backlog

---

## Phase 4 — Engagement & Retention (v1.x)

Higher-value items to ship in the first post-launch updates. Each is
expected to keep users returning and to deepen the habit loop without
breaking the privacy-first, offline-first v1 contract.

### F-01 — Custom deed creation
Users author their own deeds (title, description, XP reward, category,
difficulty). Surface alongside seeded deeds with a "Yours" badge. Stored
in the existing `deeds` table with a `source` column (`seed` | `user`).
- **Effort:** M · **Impact:** H · **Depends on:** `deeds` schema, catalog screen

### F-02 — Achievements / badges system
Unlockable milestones (7-day streak, first deed in each category,
100-deed lifetime, Ramadan completion, Jumu'ah consistency, etc.).
Award XP bonuses and a celebratory overlay. New `achievements` table
and `user_achievements` join; surfaced on Roadmap top bar + Settings.
- **Effort:** M · **Impact:** H · **Depends on:** XP engine (P3-T01), streak engine (P3-T02)

### F-03 — Daily / weekly rotating challenges
Curated themed sets ("Patience week", "Family bonds", "Tahajjud push")
that highlight 5–7 deeds and track completion within the window. New
`challenges` + `user_challenge_progress` tables.
- **Effort:** M · **Impact:** H · **Depends on:** custom deeds (F-01), gamification provider (P3-T03)

### F-04 — Hijri calendar overlay + Ramadan mode
Hijri-aware date display on logs and History. Ramadan mode surfaces
special deeds (Tarawih, Suhoor/iftar du'a, last-10-nights worship)
with a temporary XP multiplier and a themed accent color.
- **Effort:** M · **Impact:** H · **Depends on:** Islamic-content extension (F-15)

### F-05 — Smart time-of-day suggestions
Nudge suggestions on the Roadmap based on the user's local time:
after-Fajr deeds, mid-morning dhikr, post-Maghrib reflection. Uses
log history to learn preferences and avoid nagging.
- **Effort:** M · **Impact:** M · **Depends on:** notifications (F-06), local time zone

### F-06 — Recurring deed reminders (push)
`expo-notifications` integration for daily/weekly opt-in reminders.
Quiet hours, per-deed schedule, and a one-tap "I'll do it now" deep link.
- **Effort:** M · **Impact:** H · **Depends on:** `app.json` permission strings, notification token handling

### F-07 — Goal setting (monthly / yearly)
Set targets like "30 deeds in Ramadan" or "200 deeds this year".
Progress meter on Roadmap top bar; celebration on completion.
- **Effort:** S · **Impact:** M · **Depends on:** profile store

### F-08 — Streak & achievement sharing to social
Generate a branded image card (current streak, level, top category)
via `react-native-view-shot`. Share sheet via `expo-sharing`. No
account login required.
- **Effort:** S · **Impact:** M · **Depends on:** achievements (F-02)

### F-09 — Photo evidence for deeds
Optional on-device-only photo attachment to a log entry. Stored in
app sandbox (not uploaded). Uses `expo-image-picker`. Privacy-respecting
default: never leaves the device unless the user explicitly exports.
- **Effort:** M · **Impact:** M · **Depends on:** `user_logs` schema migration

### F-10 — Voice notes for deeds
Optional on-device-only audio memo attached to a log entry via
`expo-av` recording. Same privacy posture as F-09.
- **Effort:** M · **Impact:** L · **Depends on:** F-09 (shared attachment infra)

### F-11 — Dua library (separate from references)
Standalone searchable library of du'a by theme (anxiety, travel,
parents, etc.). Independent of `deed_references`. Adds reading tracking
(loop counter for "SubhanAllah × 33" workflows).
- **Effort:** M · **Impact:** H · **Depends on:** localized content authoring

### F-12 — Friday (Jumu'ah) boost mode
On Fridays, a curated set of deeds gets a temporary XP multiplier and
the Roadmap tint shifts to a Jumu'ah palette. Auto-disables after Maghrib.
- **Effort:** S · **Impact:** M · **Depends on:** locale/time-zone

### F-13 — Reflection / journal mode
Extended free-form notes per day across all deeds. New `journal_entries`
table. Replaces the per-deed note field with a richer daily reflection.
- **Effort:** M · **Impact:** M · **Depends on:** —

### F-14 — Mood / state tracking
Optional 1-tap "How are you feeling?" prompt that links to log density
and surfaces correlations (e.g., "On days you prayed Fajr, your mood
was 80% better"). Strictly on-device.
- **Effort:** M · **Impact:** M · **Depends on:** F-13, analytics screen

### F-15 — Expanded Islamic content
New categories: **Sunnah fasts** (Mondays/Thursdays), **Quran reading
tracker** (pages/day), **Dhikr counter** (33/99/100), **Athkar
morning/evening**, **Salat al-Tahajjud**. Each becomes a deed with
recurring schedule.
- **Effort:** L · **Impact:** H · **Depends on:** content authoring pipeline

---

## Platform & Integration

Bring Sabiqoo into the surfaces users already live on.

### F-20 — Home-screen widget (iOS / Android)
Shows today's streak + next suggested deed. Tapping opens the app
directly to that deed via deep link. iOS widget via WidgetKit + Expo
native module; Android via `react-native-android-widget`.
- **Effort:** L · **Impact:** H · **Depends on:** deep linking (P2-T10), widget-friendly data shape

### F-21 — Apple Watch / Wear OS companion
Quick-log from wrist: tap a deed tile, choose quantity, sync back to
phone on next open. Uses `expo-watch` / platform-specific modules.
- **Effort:** L · **Impact:** M · **Depends on:** sync layer (F-22)

### F-22 — Cloud sync (opt-in)
End-to-end encrypted sync via Supabase or Firebase so users can move
between devices without losing streaks. Disabled by default; explicit
opt-in flow explains the privacy implications.
- **Effort:** L · **Impact:** H · **Depends on:** auth (F-23), schema migration

### F-23 — Account / sign-in (minimal)
Email + magic-link or Apple/Google sign-in. No password. Sole purpose
is enabling sync (F-22) and account-bound features below. App remains
fully usable without an account.
- **Effort:** M · **Impact:** H · **Depends on:** —

### F-24 — Siri Shortcuts + Google Assistant voice log
"Log one Quran page" or "Did Fajr" via voice. Configurable phrases,
deep link into pre-filled deed detail.
- **Effort:** M · **Impact:** M · **Depends on:** deep linking (P2-T10)

### F-25 — Family sharing (parents track kids)
Optional sub-profiles linked to a parent's account. Parent sees
aggregate progress (no granular surveillance); kids use the app
normally on their own device.
- **Effort:** L · **Impact:** M · **Depends on:** F-22, F-23

### F-26 — Accountability partner (one-way share)
User sends a magic link to one trusted person who can see their
streak, level, and last-7-days activity. No two-way interaction, no
comments, no feedback loop. Designed for spouses / close friends.
- **Effort:** M · **Impact:** M · **Depends on:** F-23

### F-27 — Charity org deep links
Curated deep links from deeds to vetted charity organizations
(Humanity Appeal, Islamic Relief, local mosque sadaqah projects).
External links open in in-app browser; no money flows through Sabiqoo.
- **Effort:** S · **Impact:** M · **Depends on:** —

---

## Privacy & Security

### F-30 — Biometric app lock
Face ID / Touch ID / fingerprint gate on cold launch. Optional, with
configurable timeout (immediate / 1 min / 5 min).
- **Effort:** S · **Impact:** M · **Depends on:** `expo-local-authentication`

### F-31 — Hide in app switcher
Snap a blank screen when the app is backgrounded. Per-user toggle.
- **Effort:** S · **Impact:** L · **Depends on:** —

### F-32 — Local backup / restore (JSON export/import)
"Export my data" produces a JSON file the user can save to Files / Drive.
"Restore" reads the file and merges / replaces. Useful for migrating
between devices before cloud sync exists.
- **Effort:** M · **Impact:** M · **Depends on:** —

### F-33 — Encrypted DB
SQLCipher-style encryption of the local DB so device-level access
yields only ciphertext. Optional toggle.
- **Effort:** M · **Impact:** M · **Depends on:** schema migration

---

## Specialized Islamic Features

### F-40 — Fasting tracker
Calendar view of obligatory (Ramadan) + Sunnah (Mon/Thu, white days,
Arafah, Ashura) fasts. Tracks kept / missed, intention reminders,
iftar / suhoor time helpers.
- **Effort:** L · **Impact:** H · **Depends on:** Hijri overlay (F-04)

### F-41 — Zakat calculator
Inputs: cash, gold, silver, business inventory, debts owed/owing.
Outputs Nisab check + Zakat amount in user's currency. Sourced from
a recognized madhab (Hanafi default; Shafi'i/Maliki/Hanbali toggles).
- **Effort:** M · **Impact:** H · **Depends on:** scholar review, currency formatting

### F-42 — Sadaqah calculator
Voluntary charity calculator with a suggested percentage (1%, 2.5%,
custom). Auto-suggests matching deeds in catalog (charity category).
- **Effort:** S · **Impact:** M · **Depends on:** F-27 (links to orgs)

### F-43 — Prayer time integration
Show today's 5 prayer times on Roadmap top bar. Tap to log a "Prayed
on time" deed. Computed via `adhan` library; configurable calculation
method (Muslim World League, ISNA, Egyptian, etc.).
- **Effort:** M · **Impact:** H · **Depends on:** F-06 (reminders)

### F-44 — Qibla finder
Compass pointing toward the Kaaba from current location. Uses
`expo-location`. Educational sub-screen explaining the math.
- **Effort:** M · **Impact:** L · **Depends on:** —

### F-45 — Nearby mosque finder
Map of mosques within radius, with prayer-time overlays. Uses
`react-native-maps` + a community-vetted dataset or OSM.
- **Effort:** L · **Impact:** M · **Depends on:** —

### F-46 — Audio recitations of Quran / hadith refs
Stream or bundle audio for `deed_references`. Plays inline on the
Evidence tab. Consider separate reciter packs for offline use.
- **Effort:** L · **Impact:** M · **Depends on:** asset licensing review

---

## Personalization & Theming

### F-50 — Seasonal themes
Auto-switching accents for Ramadan, Eid, Hajj season, the Prophet's
birthday, Ashura. Per-season toggle in Settings.
- **Effort:** S · **Impact:** M · **Depends on:** F-04 (Hijri awareness)

### F-51 — Dark-mode schedule
Auto-flip light/dark based on sunset or a user-defined hour. Toggles
in Settings.
- **Effort:** S · **Impact:** L · **Depends on:** —

### F-52 — Per-deed color tags
Users tag favorite deeds with custom accent colors; tagged deeds float
to top of catalog.
- **Effort:** S · **Impact:** L · **Depends on:** custom deeds (F-01)

---

## Social & Community (low-priority by design)

Per SPEC §1, v1 explicitly avoids social features. These are listed
here so they aren't lost — but they require a privacy review before
any implementation, and almost certainly wait for cloud sync.

### F-60 — Friend feed / leaderboards
See friends' streak updates and milestones. Strictly opt-in with
blockable identities. No public leaderboard.
- **Effort:** L · **Impact:** H (if accepted) / polarizing · **Depends on:** F-22, F-23

### F-61 — Community-submitted deeds
Curated by a small editorial team. Schema is identical to seeded
deeds; the difference is who publishes and review status.
- **Effort:** L · **Impact:** M · **Depends on:** server-side content pipeline

### F-62 — Accountability circles (small group)
3–8 users share weekly progress summaries with each other. No live
feed, no reactions. Read-only digest.
- **Effort:** L · **Impact:** M · **Depends on:** F-22, F-23

---

## Accessibility & Inclusion

### F-70 — Dynamic-type aware layout
Resize gracefully when users set OS-level larger text. Audit tap
targets, line heights, and table layouts.
- **Effort:** M · **Impact:** M · **Depends on:** accessibility audit (P3-T06)

### F-71 — High-contrast theme
WCAG AAA-compliant palette toggle. Independent of light/dark.
- **Effort:** S · **Impact:** M · **Depends on:** P3-T07 contrast audit

### F-72 — Voiceover / TalkBack tutorial
First-run VoiceOver tour of the Roadmap explaining each gesture.
- **Effort:** S · **Impact:** L · **Depends on:** —

### F-73 — Additional locales
Urdu, Malay, French, Turkish, Indonesian, Bengali. Each needs a
native-speaker review pass; translation tooling already in place.
- **Effort:** M per locale · **Impact:** M-H · **Depends on:** community translators

---

## Onboarding & Discovery

### F-80 — Onboarding tutorial
3-screen first-run flow explaining nodes, streaks, and bookmarks.
Skip-able for returning users.
- **Effort:** S · **Impact:** M · **Depends on:** —

### F-81 — "Try this deed" picker
For brand-new users, a 2-question wizard ("What matters to you?",
"What time of day?") that surfaces 5 starter deeds. No account needed.
- **Effort:** S · **Impact:** M · **Depends on:** —

### F-82 — WhatsApp / Telegram share summary
Weekly summary card optimized for messaging apps (smaller dimensions,
less chrome). Distinct from F-08.
- **Effort:** S · **Impact:** L · **Depends on:** F-08

---

## Performance & Engineering

### F-90 — Roadmap virtualization at scale
For users with thousands of deeds (custom-heavy), the Roadmap must
still hit 60fps. Windowing, lazy-mount, deeper memoization.
- **Effort:** M · **Impact:** M · **Depends on:** P3-T08 performance pass

### F-91 — Background log sync via OS task scheduler
Schedule nightly streak check / XP recompute via Expo TaskManager
so the UI thread stays idle.
- **Effort:** M · **Impact:** L · **Depends on:** —

### F-92 — Schema migrations with Drizzle Kit (proper)
Move from inline-CREATE-at-boot to real `drizzle-kit generate`
artifacts, gated by a version table. Frees up safe column drops.
- **Effort:** S · **Impact:** M (engineering) · **Depends on:** P1-T06 close-out

---

## Index by priority

A rough triage. **P1** is the most likely to ship next.

| Pri | ID | Title | Impact |
|---|---|---|---|
| P1 | F-01 | Custom deed creation | H |
| P1 | F-02 | Achievements / badges | H |
| P1 | F-06 | Recurring deed reminders | H |
| P1 | F-11 | Dua library | H |
| P1 | F-22 | Cloud sync (opt-in) | H |
| P1 | F-23 | Account / sign-in | H |
| P1 | F-41 | Zakat calculator | H |
| P2 | F-03 | Daily / weekly challenges | H |
| P2 | F-04 | Hijri + Ramadan mode | H |
| P2 | F-15 | Expanded Islamic content | H |
| P2 | F-20 | Home-screen widget | H |
| P2 | F-30 | Biometric app lock | M |
| P2 | F-32 | Local backup / restore | M |
| P2 | F-43 | Prayer time integration | H |
| P2 | F-73 | Additional locales | M-H |
| P3 | F-05 | Smart time-of-day suggestions | M |
| P3 | F-07 | Goal setting | M |
| P3 | F-08 | Streak sharing | M |
| P3 | F-09 | Photo evidence | M |
| P3 | F-12 | Friday boost mode | M |
| P3 | F-13 | Reflection / journal | M |
| P3 | F-21 | Apple Watch / Wear OS | M |
| P3 | F-24 | Siri / Assistant shortcuts | M |
| P3 | F-27 | Charity org deep links | M |
| P3 | F-40 | Fasting tracker | H |
| P3 | F-42 | Sadaqah calculator | M |
| P3 | F-50 | Seasonal themes | M |
| P3 | F-80 | Onboarding tutorial | M |
| P4 | F-10 | Voice notes | L |
| P4 | F-14 | Mood tracking | M |
| P4 | F-25 | Family sharing | M |
| P4 | F-26 | Accountability partner | M |
| P4 | F-31 | Hide in app switcher | L |
| P4 | F-33 | Encrypted DB | M |
| P4 | F-44 | Qibla finder | L |
| P4 | F-45 | Nearby mosque finder | M |
| P4 | F-46 | Audio recitations | M |
| P4 | F-51 | Dark-mode schedule | L |
| P4 | F-52 | Per-deed color tags | L |
| P4 | F-70 | Dynamic-type layout | M |
| P4 | F-71 | High-contrast theme | M |
| P4 | F-72 | Voiceover tutorial | L |
| P4 | F-81 | "Try this deed" picker | M |
| P4 | F-82 | WhatsApp share summary | L |
| P4 | F-90 | Roadmap virtualization | M |
| P4 | F-91 | Background log sync | L |
| P4 | F-92 | Schema migrations cleanup | M |
| P5 | F-60 | Friend feed / leaderboards | H* |
| P5 | F-61 | Community-submitted deeds | M |
| P5 | F-62 | Accountability circles | M |

\* F-60's "H" assumes the audience wants it; many religious-app users
prefer zero social pressure. Treat as gated by user research, not
just engineering effort.

---

_End of FEATURES.md_
