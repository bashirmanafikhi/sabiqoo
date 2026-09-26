# Sabiqoo (سابقوا)

A Duolingo-style gamified mobile app for consistent charitable deeds, built
with **React Native (Expo SDK 51)** + **TypeScript (strict)** + **NativeWind**.
The catalog is organized as a living inspiration library of ~170 deeds across 8
units and 7 categories, with full bilingual support (Arabic RTL default +
English LTR), offline-first persistence via `expo-sqlite`, an XP/streak
gamification engine, a roadmap with skipped/bookmarked deeds, an evidence tab
(Qur'an / hadith / athkar) per deed, and confetti celebrations scaled to XP
earned. State-of-the-repo snapshots are tracked in `SPEC.md`, `TICKETS.md`,
`STYLE.md` and `STATUS.md`.

## Dev Setup

```bash
# 1. Install deps. `--legacy-peer-deps` silences React 18 peer-dep noise from
#    Expo's transitive deps; `--ignore-scripts` skips `better-sqlite3`'s native
#    build step (which fails without Python on Windows). The on-device DB
#    uses `expo-sqlite` so this is fine.
npm install --legacy-peer-deps --ignore-scripts

# 2. Boot the Expo dev client.
npm run start
```

If you want `better-sqlite3` (needed only for the `npm run seed` /
`npm run db:migrate` developer scripts), let npm run its install scripts:

```bash
npm install --legacy-peer-deps
# On Windows you may also need to install Python (3.10+) so node-gyp can
# build the native binding. There is no prebuilt binary for Node 26 yet.
```

## Build & Test

| Goal | Command |
|---|---|
| TypeScript check | `npm run typecheck` (or `npx tsc --noEmit --skipLibCheck`) |
| Lint | `npm run lint` |
| Tests | `npx jest` |
| i18n key parity | `npm run check:i18n` |
| Generate Drizzle migrations | `npm run db:generate` |
| Apply migrations to local DB | `npm run db:migrate` |
| Seed local DB | `npm run seed` |
| Build EAS preview APK | `eas build --profile preview` |
| Build EAS production AAB/IPA | `eas build --profile production` |

## Project layout

```
app/                      # Expo Router screens
src/
  components/              # UI primitives (BigButton3D, Node, ...)
  db/                     # Drizzle schema + migrations
  gamification/           # Pure XP / level / streak functions
  i18n/                   # ar.json + en.json + provider
  repos/                  # deedsRepo, logsRepo, profileRepo, ...
  stores/                 # Zustand: theme / locale / profile
  theme/                  # Tokens + ThemeProvider
  utils/                  # dates, haptics
scripts/                  # seed, migrate, check-i18n, authoring data
__tests__/                # Jest unit + integration tests
assets/                   # icon set (placeholders), SVG illustrations
```

## Status

This is a **v1 implementation snapshot**. The vast majority of `SPEC.md` is
implemented and the code passes `tsc --noEmit --skipLibCheck` + `npx jest` +
`npm run lint` + `npm run check:i18n`. Some pieces are still pending — full
status lives in [`STATUS.md`](./STATUS.md):

- App icon (`assets/icon.png` etc.) is a 1×1 placeholder pending re-export
  from `assets/icon-source.jpg` — see `TICKETS.md` **P1-T01a**.
- `eas build --profile preview` has not been run in this environment — see
  `TICKETS.md` **P1-T12 / P2-T16 / P3-T09**.
- `RoadmapPath` bezier-curve node path is rendered as a simple alternating
  row with a 28px line connector (see `app/roadmap.tsx`) — see `TICKETS.md`
  **P2-T01**.
- `GamificationProvider` does not exist; deed detail calls the pure
  gamification functions directly. Confetti uses RN Animated, not Lottie.
  See `TICKETS.md` **P3-T03 / P3-T04**.
- `better-sqlite3`'s Windows + Node 26 native binding is not prebuilt and
  Python isn't installed here, so `npm run seed` and `__tests__/repos.test.ts`
  are skipped on this host. The on-device DB still works via `expo-sqlite`.