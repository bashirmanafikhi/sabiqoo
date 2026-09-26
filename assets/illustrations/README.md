# Illustrations (custom SVG)

Hand-authored SVG assets live here. They are the **exception**, not the rule — see [`/STYLE.md`](../../STYLE.md) §4. The vast majority of UI visuals should be expressed with `@expo/vector-icons` icons.

## What's here

| Folder | Contents | Why custom SVG |
|---|---|---|
| `nodes/` | 5 roadmap node states (locked, available, completed, mastered, skipped) | No icon-library equivalent |
| `trophies/` | Gold, silver, bronze reward trophies | Distinct color treatments need more than one icon |
| `confetti/` | `burst.svg` (static) + expected `confetti.json` (Lottie) | Animation + 12-particle burst |

## What we explicitly do NOT have

- Mascots / characters / creatures.
- Custom decorative ornaments / frame art.
- Unit illustrations (composed from icons instead).

## Naming

`{concept}.svg` — kebab-case, no version suffix. Re-export revisions through git, not filenames.
