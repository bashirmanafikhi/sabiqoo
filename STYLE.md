# SABIQOO — Visual Style System

> The single source of truth for all visuals in the app.

---

## 1. Brand at a glance

- **Inspiration**: Duolingo flat geometry (pre-2018).
- **Voice**: friendly, chunky, optimistic, never cynical.
- **Goal**: zero ambiguity on a phone screen at a glance.

## 2. Palette (locked)

| Token | Hex | Role |
|---|---|---|
| `brand-green` | `#58CC02` | Primary CTA, success, completion |
| `brand-green-dark` | `#58A700` | 3D press shadow of `brand-green` |
| `brand-blue` | `#1CB0F6` | Secondary action, kindness |
| `brand-blue-dark` | `#0E8FCE` | 3D press shadow of `brand-blue` |
| `accent-gold` | `#FFC800` | Reward, completed node, star fills |
| `accent-gold-dark` | `#E5A800` | 3D shadow of `accent-gold` |
| `accent-fire` | `#FF4D4D` | Streak, flame, mastery, hearts |
| `accent-fire-soft` | `#FF7A7A` | Cheek blush, soft warning |
| `slate-blue` | `#94A3B8` | Skipped state, body fill |
| `slate-blue-dark` | `#64748B` | 3D shadow of `slate-blue` |
| `locked` | `#E5E5E5` | Locked body fill |
| `locked-dark` | `#BFBFBF` | Locked shadow |
| `ink` | `#1F1F1F` | **Outline only**, never a fill |
| `paper` | `#FFFFFF` | Belly, eye whites, sparkle |

Dark-mode tokens live in `src/theme/tokens.ts`; rules below apply analogously.

## 3. Stroke

- **2px** on a 80×80 viewBox; scale for larger viewBoxes.
- **Color**: `ink` `#1F1F1F` only. No exceptions.
- **Caps & joins**: `stroke-linecap="round"`, `stroke-linejoin="round"`.
- **Text**: never stroked.

## 4. Icons-first rule (mandatory)

**Default to icons, not custom SVG.**

Icons come from **`@expo/vector-icons`** with Lucide or Ionicons (already in the stack — SPEC §2). They are pixel-consistent, accessible, and free.

- For **every** UI surface, start by composing **icon + token**:
  - Buttons → `Pressable` background + `<Ionicons name="..." />` or `<Lucide ... />`.
  - Empty states → a single icon rendered large over a token-colored panel.
  - Badges → `<Award />`, `<Medal />`, `<Trophy />` etc. from Lucide filled at the brand color.
  - Unit illustrations → 2–3 layered icons + flat background shape.
  - Declines/confetti → keep the existing `confetti/burst.svg` + a Lottie fallback.

**Custom SVG is reserved for cases where no icon fits:**
- The 5 node states (Locked / Available / Completed / Mastered / Skipped) — these have no icon-library analog.
- The 3 trophy variants — distinct gold/silver/bronze treatments that a single trophy icon can't communicate.
- Confetti / particle bursts.
- The curving roadmap connector path.

When authoring any new SVG, ask first: **"Can I express this with one or two icons + a background shape?"** If yes, do that instead.

## 5. No characters (v1)

- No human, animal, or fantasy-creature illustrations, hand-drawn or otherwise.
- If a mascot is ever wanted in v2, commission a designer.

## 6. Depth rule (the "Duolingo 3D")

Two layers per interactive element:
1. Offset darker-shape shadow underneath (2–3px).
2. Colored fill shape on top.

No third layer. No gradient between them.

## 7. Asset folder

```
assets/
  illustrations/
    nodes/      # the 5 node states — custom SVG
    trophies/   # gold / silver / bronze — custom SVG
    confetti/   # burst.svg + confetti.json
  icons/        # any single exported icons we use cross-app (optional)
```

Any new asset folder requires a STYLE.md amendment first.

## 8. When custom SVG ships

Hand-authored SVG is **only** for the cases in §4. Each one:
- Uses only palette tokens.
- Carries `viewBox`, `width`, `height`, `role`, `aria-label`.
- Has ≤ 6 paths total.
- Has exactly two fill colors + outline.
- Is reviewed in a browser before commit.

## 9. Reference inspiration

- Lucide icon library (`lucide-react-native`, mirrored in `@expo/vector-icons`).
- Ionicons (alternative set available in `@expo/vector-icons`).
- Duolingo (2016–2019 era flat style) for node/trophy composition rules.

---

_End of STYLE.md_
