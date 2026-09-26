# Illustrations

All hand-illustrated assets for Sabiqoo live in this folder. Anything that ships visually **must** comply with [`/STYLE.md`](../../STYLE.md).

## Layout

| Folder | Contents |
|---|---|
| `nodes/` | 5 roadmap `Node` states: locked, available, completed, mastered, skipped |
| `trophies/` | Gold, silver, bronze reward trophies |
| `badges/` | Category-completion badges (one per category, 7 total) |
| `mascot/` | Character, heart, sparkle assets for celebration overlay |
| `confetti/` | `burst.svg` (static fallback) + `confetti.json` (Lottie, expected) |
| `units/` | One illustration per unit (8 total) — to be commissioned |
| `empty-states/` | Empty-state illustrations for each list screen |

## Naming

`{concept}.svg` — kebab-case, no version suffix. Re-export revisions through git history, not filenames.

## Sizing

Each SVG carries an explicit `viewBox` and `width`/`height`. Default size is 80×80 for icons; scale via CSS or props.
