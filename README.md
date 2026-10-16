<picture>
  <source media="(prefers-color-scheme: dark)" srcset="apps/docs/public/logo-dark.svg">
  <img alt="Coachli" src="apps/docs/public/logo.svg" height="40">
</picture>

# Coachli Design System

The components and design tokens for the Coachli dashboard. It's built on [Halo](https://github.com/Chidindu06F/Halo-design-system), themed with the Coachli brand: an aubergine primary colour, Inter, and light and dark mode.

- **Figma library:** [COACHLI DESIGN SYSTEM](https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM), the source of truth for every token and component.
- **Dashboard designs:** [Coachli](https://www.figma.com/design/toCoFh482t5Ho9OU7it9lA/Coachli).
- **Storybook (live docs and playground):** https://chidindu06f.github.io/Coachli-design-system/

> Building the dashboard? Start with **[DEVELOPERS.md](DEVELOPERS.md)**.

## Packages

Published to GitHub Packages:

| Package | What it is |
| --- | --- |
| [`@chidindu06f/coachli-tokens`](packages/tokens) | Colours, type, spacing and radius as CSS variables for light and dark mode, generated from the Figma library |
| [`@chidindu06f/coachli-react`](packages/react) | React components |
| [`docs`](apps/docs) | Storybook |

## Install

GitHub Packages needs a one-time setup, even for public packages:

1. Create a GitHub [personal access token (classic)](https://github.com/settings/tokens) with the `read:packages` scope.
2. Add a `.npmrc` next to your app's `package.json`:
   ```
   @chidindu06f:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
   ```
3. Set `GITHUB_TOKEN` to that token in your shell or CI, then install:
   ```bash
   npm install @chidindu06f/coachli-react @chidindu06f/coachli-tokens @fontsource/inter
   ```

Load the tokens, the component styles and the font once, at the top of your app:

```tsx
import '@chidindu06f/coachli-tokens/css';
import '@chidindu06f/coachli-react/styles.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

import { Button } from '@chidindu06f/coachli-react';

<Button>Create</Button>;
```

Switch themes with `data-theme` on `<html>`: `light` (default), `dark`, or `system` (follows the device).

Every token is a CSS variable. They keep Halo's `--halo-` prefix so improvements from Halo can still be brought in:

```css
.panel {
  background: var(--halo-surface-primary);
  color: var(--halo-text-primary);
  padding: var(--halo-spacing-md);
  border-radius: var(--halo-radius-md);
}
```

## Working on the design system

Requirements: [Node.js](https://nodejs.org) 22+ and [pnpm](https://pnpm.io) (`npm install -g pnpm`).

```bash
pnpm install       # install dependencies
pnpm dev           # build tokens and start Storybook at http://localhost:6006
pnpm build         # build every package and Storybook
pnpm typecheck     # type-check every package
pnpm tokens:merge  # apply packages/tokens/coachli/export.json, then rebuild the tokens
```

How to keep Figma and code in sync, and how to release, is in [CONTRIBUTING.md](CONTRIBUTING.md).

### Relationship to Halo

This repository is a copy of Halo. The original Halo code and Figma file are never changed from here: pushing to the `halo` remotes is disabled. To bring in later Halo improvements:

```bash
git fetch halo
git merge halo/main   # then resolve conflicts, rebuild and check Storybook
```

## License

[MIT](LICENSE). Third-party assets are credited in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
