# Working on the Coachli design system

This is the Coachli copy of Halo. Figma and code are kept in step by hand: a change isn't done until both match.

## Ground rules

- **Never change Halo from here.** The original Halo code and Halo Figma file are off limits; pushing to the `halo` remotes is disabled on purpose. If a fix belongs in Halo too, make it there separately.
- **Tokens, not values.** Components use semantic tokens (`--halo-surface-primary`, `--halo-text-secondary`), never hex codes or primitive colours. This is what makes dark mode work.
- **Text on a fill uses the matching "on" token:**
  - `text/on-brand`, `icon/on-brand`: only on brand fills (Primary button, selected date, checkbox tick).
  - `text/on-color`, `icon/on-color`: white in both modes, on fills that don't change between modes (social logos, Premium, destructive).
  - `text/on-status`, `icon/on-status`: on solid status fills (information, success, warning, error badges).
  - `icon/on-contrast`: the Switch knob.
- **Figma is the source of truth for tokens.** Don't hand-edit `packages/tokens/figma/*.json` or anything in `dist/`.
- **Accessible by default.** WCAG AA contrast, keyboard use, a visible focus ring (`--halo-border-focus`), and no violations in Storybook's Accessibility panel.
- **Both themes.** Check every change in light and dark mode with the Storybook toolbar.

## The routine for every change

| You changed… | Do this |
| --- | --- |
| A token (colour, font, spacing) in the COACHLI Figma library | Update `packages/tokens/coachli/export.json` (or replace the files in `packages/tokens/figma/` with Figma's *Export modes*), run `pnpm tokens:merge`, check Storybook |
| A component in the COACHLI Figma library | Make the same change in `packages/react/src/components/<Name>/`, update its story and its `figma/<Name>.figma.tsx` mapping |
| Anything | Add a line to **Unreleased** in [CHANGELOG.md](CHANGELOG.md), then commit |

`pnpm tokens:merge` keeps any token the code has that Figma doesn't, and prints them, so nothing a component uses disappears by accident.

## Adding a component

```
packages/react/src/components/Button/
  Button.tsx
  Button.module.css
  Button.stories.tsx
  index.ts
```

Then export it from `packages/react/src/index.ts`.

## Figma Dev Mode and Code Connect

The mappings in `packages/react/figma/*.figma.tsx` link each component to the **COACHLI DESIGN SYSTEM** Figma library (`fNq8x9qbF4yYA6ixgwdGVR`). Form, Resizable, Result, Statistic, Tree and the Table expanded row are Halo components the COACHLI library doesn't have yet, so `figma.config.json` excludes them. Add them back once they exist in the library, and point their URLs at its node ids.

Publishing needs a Dev or Full seat on a Figma Organization or Enterprise plan. From `packages/react`:

```bash
npx @figma/code-connect connect publish --token <your Figma access token>
```

## Releasing

Packages publish to **GitHub Packages** through the *Publish packages* GitHub Action, using the repository's own token. No npm account or paid plan is needed.

1. In `CHANGELOG.md`, rename **Unreleased** to the new version and add a fresh **Unreleased** above it.
2. Set the same version in `packages/tokens/package.json` and `packages/react/package.json` (`0.1.1` for fixes, `0.2.0` for new components or token changes).
3. Commit and push to `main`, then run the action: **Actions → Publish packages → Run workflow**, or `gh workflow run publish.yml`.
4. Tag it: `git tag v0.1.1 && git push origin v0.1.1`.

Check a release locally without publishing: `pnpm release:check`.
