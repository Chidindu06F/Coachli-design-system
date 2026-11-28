---
name: coachli-ui
description: Build or change any Coachli UI with the Coachli design system, in code (React pages, forms, modals, tables, menus, empty states, CSS) or in Figma (designing Coachli screens through the Figma MCP). Use whenever the task touches a React component, JSX, CSS, colours, spacing, icons or layout in the Coachli dashboard, or a Coachli Figma screen, including "add a button", "build this screen from Figma", "fix this layout", "make this match the design" or "design the mobile version".
---

# Coachli UI

Every Coachli screen is built from the Coachli design system. Your job is to assemble screens from its components and tokens, never to invent new UI.

## The guidelines

The full rules are in the `guidelines/` folder of the design system. Read the file for what you are doing before you start:

| Doing | Read |
| --- | --- |
| Any UI work | `${CLAUDE_PLUGIN_ROOT}/guidelines/using-the-design-system.md` |
| Picking a component | `${CLAUDE_PLUGIN_ROOT}/guidelines/choosing-components.md` |
| Layout, menus, drawers, tables, create flows | `${CLAUDE_PLUGIN_ROOT}/guidelines/patterns.md` |
| Images, avatars, covers, icons | `${CLAUDE_PLUGIN_ROOT}/guidelines/images.md` |
| Designing in Figma (states, page layout) | `${CLAUDE_PLUGIN_ROOT}/guidelines/designing-screens.md` |
| Any text on screen | the `coachli-copy` skill |
| A screen or state that isn't designed | the `coachli-gaps` skill |

If that path doesn't exist (the skill was copied by hand), read the same files on GitHub: `https://github.com/Chidindu06F/Coachli-design-system/tree/main/guidelines`. Page-by-page product rules are in `DEVELOPERS.md` in the same repository.

## The rules

1. **Use the components.** In code, import from `@chidindu06f/coachli-react`. In Figma, use instances from COACHLI DESIGN SYSTEM. Never hand-build a button, input, select, modal, drawer, menu, table, tab bar, badge, toast, tooltip, avatar, progress bar or spinner, and never add another UI library (MUI, Chakra, shadcn, Radix, Headless UI, Ant).
2. **Pick the best component, not one that merely works.** Use the table in `choosing-components.md`. A Select, Radio group, Segmented control and Chips can all pick one option, but each fits a different job.
3. **Don't detach or restyle.** Use properties and slots (Modal body, Drawer content, Card content, Table cell) in Figma; `classNames`/`styles` props in code. Never override a component's look.
4. **Tokens only.** In CSS, `var(--halo-…)` only: no hex, rgb or hsl, no pixel font sizes, no made-up spacing. In Figma, variables and text styles only.
5. **Light, dark and mobile.** Every screen works with `data-theme="dark"` and at 390px wide.
6. **Never invent a component.** If nothing fits, compose from existing ones and follow `coachli-gaps`. Only the designer adds components, in Figma first.

## Before you write code

1. Find the component in Storybook (https://chidindu06f.github.io/Coachli-design-system/) or in `node_modules/@chidindu06f/coachli-react/dist/index.d.ts`.
2. Read its props from the type definitions. Don't guess prop names.
3. If you have a Figma link, read it with the Figma MCP. Layer names are component names (`Button`, `Input field`, `Modal`, `List item`), and Figma properties (Type, Size, State) map to props.

## Setup (once per app)

```tsx
import '@chidindu06f/coachli-tokens/css';
import '@chidindu06f/coachli-react/styles.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
```

Themes: `data-theme="light" | "dark" | "system"` on `<html>`.

## Your own CSS

Only for layout (grids, page padding, gaps between components):

```css
.section {
  display: flex;
  flex-direction: column;
  gap: var(--halo-spacing-6);
  padding: var(--halo-spacing-8);
  background: var(--halo-surface-primary);
  border: 1px solid var(--halo-border-secondary);
  border-radius: var(--halo-radius-md);
}
```

Text uses the `Text` component. Icons are Phosphor, Regular weight.

## The patterns people get wrong most

- ⋮ opens a `Menu` under it, on mobile too. No bottom sheets anywhere.
- One overlay at a time: never a `Modal` on a `Drawer`; the drawer moves to the next step with Back in the footer.
- Toasts at the top centre, title only.
- Tables: first column semibold, every other cell regular `text/primary`; on mobile one bordered card of `ListItem`s with dividers.
- Tabs holding a list show a count badge.
- Badges are never the brand colour.
- Create flows: Cancel/Back left; Save as draft then Next or Publish right. Edit pages: Next and Update.
- Missing images use `ImagePlaceholder`; missing profile photos use `Avatar` initials.
- Form fields 20px apart (`--halo-spacing-8`).

The full list is in `patterns.md`.

## Check your work

Run the `coachli-review` skill before you finish.
