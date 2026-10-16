# @chidindu06f/coachli-tokens

Halo's design tokens as CSS variables, JSON and JS, generated from the Halo Figma variables.

```bash
npm install @chidindu06f/coachli-tokens
```

```js
import '@chidindu06f/coachli-tokens/css';           // all CSS variables, light + dark
import { vars, tokens } from '@chidindu06f/coachli-tokens';

vars['surface-primary'];                // "var(--halo-surface-primary)"
```

## Themes

| `data-theme` on `<html>` | Result |
| --- | --- |
| none / `light` | Light |
| `dark` | Dark |
| `system` | Follows the operating system |

## Updating tokens from Figma

The files in `figma/` are exports straight from Figma. To update them:

1. In Figma, open **Local variables**.
2. For each collection (**Primitives**, **Semantic**, **Typography**), right-click the collection → **Export modes**.
3. Replace the matching files in `figma/`, keeping the folder-per-collection layout:
   ```
   figma/Primitives/Default.tokens.json
   figma/Semantic/Light.tokens.json
   figma/Semantic/Dark.tokens.json
   figma/Typography/Default.tokens.json
   ```
   (If Figma names a file `Mode 1.tokens.json`, that's fine: single-mode files work with any name.)
4. Run `pnpm build:tokens` from the repo root and check Storybook → Foundations.

## Naming

Figma variable → CSS variable:

| Figma | CSS |
| --- | --- |
| `surface/primary` | `--halo-surface-primary` |
| `colours/purple/300` | `--halo-color-purple-300` |
| `spacing/spacing-md` | `--halo-spacing-md` |
| `size/md` (Typography) | `--halo-font-size-md` (rem) |
| `weight/semibold` | `--halo-font-weight-semibold` (600) |
| `grid/columns` (Layout) | `--halo-grid-columns` (4, 8 or 12, changes at each breakpoint) |

## Breakpoints

The **Layout** collection has one mode per screen size. Its values start at the Mobile size and are overridden with `@media (min-width: …)` at 600px (Tablet), 1,024px (Desktop) and 1,440px (Wide):

| Token | Mobile | Tablet | Desktop | Wide |
| --- | --- | --- | --- | --- |
| `--halo-grid-columns` | 4 | 8 | 12 | 12 |
| `--halo-grid-gutter` | 16px | 24px | 24px | 24px |
| `--halo-grid-margin` | 16px | 24px | 40px | 80px |
| `--halo-container-max-width` | 1280px | 1280px | 1280px | 1280px |

The same names are set as **code syntax** on each Figma variable, so Dev Mode shows the CSS variable.
