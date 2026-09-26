# SABIQOO — Visual Style System

> The single source of truth for all hand-drawn assets in the app.
> Anything that ships visually must be inside this envelope.

---

## 1. Brand at a glance

- **Inspiration**: Duolingo flat geometry (pre-2018) + Islamic geometric simplicity.
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

- **2px** (`stroke-width="2"` on a 80×80 viewBox; scale for larger viewBoxes).
- **Color**: `ink` `#1F1F1F` only. No exceptions.
- **Caps & joins**: `stroke-linecap="round"`, `stroke-linejoin="round"`.
- **Text**: never stroked.

## 4. Shape vocabulary

- **Circles** for node bodies and faces.
- **Rounded rectangles** (radius 2–12px) for buttons, plinths, badges.
- **Bezier curves** for mascot bodies and roadmap trails.
- **5-pointed stars** only — no 4, 6, or 8 point variants.
- **Hearts** — one canonical path (see `assets/illustrations/mascot/heart.svg`).
- **Eyes** — three elements max: white circle, black pupil, white highlight.
- **Smile** — single quadratic curve, 3px stroke.

## 5. Hard "Don't"s

- No gradients. Flat fills only.
- No strokes thinner than 2px (in 80×80). Use larger shapes instead.
- No thin outlines on dark-mode fills (they disappear).
- No detailed faces (no eyebrows, no pupils with irises, no teeth detail).
- No drop shadows beyond a single elliptical floor shadow.
- No realistic or photographic textures.
- No more than **two fill colors per icon** plus the outline.

## 6. Depth rule (the "Duolingo 3D")

Every interactive element gets exactly two layers:
1. A 2-3px offset darker-shape shadow underneath.
2. The colored fill shape on top.

No third layer. No gradient between them.

## 7. Asset folder structure

```
assets/illustrations/
  nodes/            # 5 SVG files: locked, available, completed, mastered, skipped
  trophies/         # gold.svg, silver.svg, bronze.svg
  badges/           # mastery, streak, kindness — 6+ SVGs
  mascot/           # character.svg, heart.svg, sparkle.svg
  confetti/         # burst.svg (static), confetti.json (lottie)
  units/            # 8 unit illustrations, ~PNG-export-from-SVG
  empty-states/     # empty-bookmarks.svg, empty-history.svg, …
```

## 8. Reference inspiration

- Duolingo (2016–2019 era flat style).
- Headspace illustration system.
- Apple Memoji proportions (for the mascot face layout).
- Storyset / unDraw (clean, intentional, not detailed).

## 9. Iteration rule

Every illustrated asset is reviewable. If a hand-off feedback round
takes more than 15 minutes of author time, the asset was probably out
of scope for this style system — file a `STYLE.md` amendment first.

---

_End of STYLE.md_
