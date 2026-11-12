# Working in this repository

This is the Coachli design system: design tokens (`packages/tokens`), React components (`packages/react`) and Storybook (`apps/docs`). Figma is the source of truth; the code mirrors it.

## Rules

- **Figma first.** A component or token changes in the Figma library first, then here. Do not add a variant, size or colour that Figma does not have.
- **Tokens are generated.** Never edit `packages/tokens/dist`. Change the JSON under `packages/tokens/figma/<Collection>/<Mode>.tokens.json`, then run `pnpm build:tokens`.
- **Components use tokens only.** In `*.module.css` use `var(--halo-…)`. No hex values, except artwork colours that have no token (say so in a comment).
- **Follow the existing shape.** Each component is a folder in `packages/react/src/components/<Name>/` with `<Name>.tsx`, `<Name>.module.css`, `<Name>.stories.tsx` and `index.ts`, and is exported from `packages/react/src/index.ts`. Use `parts()` from `internal/parts` so every part gets `data-part`, `classNames` and `styles`. Copy a small component such as `Spinner` when starting a new one.
- **Every change is documented.** Add a line to `CHANGELOG.md` under Unreleased. If the change affects how the dashboard is built, update `DEVELOPERS.md`. If it adds a decided pattern, add it to `skills/coachli-ui/SKILL.md` too.
- **Verify before finishing.** `pnpm typecheck`, then open the story in Storybook (`pnpm dev`, port 6006) and check light mode, dark mode and keyboard use.
- **Halo is read-only.** Never push to the `halo` remotes.

## Commands

```bash
pnpm install
pnpm dev          # tokens + Storybook at http://localhost:6006
pnpm typecheck
pnpm build
```

## Building the dashboard app instead?

Use the files in [`skills/`](skills/README.md): they make AI coding tools use these components and tokens.
