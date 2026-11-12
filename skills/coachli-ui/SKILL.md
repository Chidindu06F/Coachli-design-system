---
name: coachli-ui
description: Build or change any Coachli dashboard UI (pages, forms, modals, tables, menus, empty states, styles) with the Coachli design system. Use whenever the task touches a React component, JSX, CSS, colours, spacing, icons or copy in the Coachli dashboard app, including "add a button", "build this screen from Figma", "fix this layout" or "make this match the design".
---

# Coachli UI

Every screen in the Coachli dashboard is built from the Coachli design system. Your job is to assemble screens from its components and tokens, not to write new UI primitives.

## The three rules

1. **Use the components.** Import from `@chidindu06f/coachli-react`. Never hand-build a button, input, select, modal, drawer, menu, table, tab bar, badge, toast, tooltip, avatar, progress bar or spinner, and never add another UI library (MUI, Chakra, shadcn, Radix, Headless UI, Ant) for something the package already has.
2. **Use the tokens.** In your own CSS use `var(--halo-…)` variables only. No hex or rgb values, no pixel font sizes, no made-up spacing. Hard-coded colours break dark mode.
3. **Follow the product rules.** They are in `DEVELOPERS.md` in the design system repository, under "Product rules". Read the bullet for the area you are working on before you write code.

## Before you write code

1. Find the component. The full list is in Storybook: https://chidindu06f.github.io/Coachli-design-system/ (or read `node_modules/@chidindu06f/coachli-react/dist/index.d.ts` for every export and its props).
2. Read its props from the type definitions. Do not guess prop names.
3. Read the matching section of `DEVELOPERS.md`: https://github.com/Chidindu06F/Coachli-design-system/blob/main/DEVELOPERS.md
4. If you were given a Figma link, the layer names tell you the component: a layer called `Button`, `Input field`, `Modal`, `Menu`, `List item` and so on is that component from the package, and its Figma properties (Type, Size, State) map to props.

## Setup (once per app)

```tsx
import '@chidindu06f/coachli-tokens/css';
import '@chidindu06f/coachli-react/styles.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
```

Themes: `data-theme="light" | "dark" | "system"` on `<html>`. Components switch by themselves.

## Writing your own CSS

Only for layout (grids, page padding, gaps between components). Use tokens:

```css
.page {
  background: var(--halo-surface-primary);
  color: var(--halo-text-primary);
  padding: var(--halo-spacing-md);
  border: 1px solid var(--halo-border-secondary);
  border-radius: var(--halo-radius-md);
}
```

- Text styles: use the `Text` component, not your own font sizes.
- To restyle part of a component, use its `classNames` or `styles` props (each component documents its parts), not its internal class names.
- Icons: Phosphor icons, regular weight, sized by the component.

## Patterns that are already decided

These come up often. The full list and details are in `DEVELOPERS.md`.

- **Menus are dropdowns.** A "more" (⋮) button opens a `Menu` under it, on mobile too. Never a bottom sheet.
- **Selects with few options** fit their content; fields and info boxes fill their container.
- **Lists inside tabs** show the item count as a badge on the tab.
- **Tags are never the brand colour.** "Starts in" is Warning; "Paid by customer", "New" and unread counts are Information.
- **Primary buttons** are teal with a white label.
- **Error messages** state the problem in a few words and keep a next step ("Enter a valid link.", "Upload failed. Check your connection and retry."). No examples inside the error.
- **Placeholders** are sample answers that start with "e.g.", not questions or instructions.
- **Create flows** (invoices, one-off sessions, session bundles): Cancel or Back, Save as draft and Next sit in a sticky bar at the bottom of the main area, left-aligned. The header has only "Watch demo video", which opens the YouTube video in a `Modal` on Coachli. It never opens YouTube.
- **Celebrations** ("Session published", "New badge earned"): put `<Confetti />` inside the Modal body. Do not write your own animation.
- **Breadcrumbs** go under the page title. No back arrow.
- **Focus rings** must not be clipped: do not put `overflow: hidden` on a container that holds focusable components unless it scrolls.
- **Names:** "One-off session" and "Session bundle" (never "1:1 session" for the single kind). Menu items that list kinds of things are plural: One-off sessions, Session bundles, Live events.

## When the design system does not have it

1. Check Storybook again, including the "Coachli-only pieces" section of `DEVELOPERS.md` (those are built in the dashboard app from design system components).
2. Compose it from existing components and tokens.
3. If it is truly new and reusable, do not invent it in the app: tell the user it should be added to the design system (Figma first, then the React package), and build the screen with the closest existing component in the meantime.

## Check your work

- No hex, rgb or hsl colours in the diff. No raw `<button>`, `<input>`, `<select>` or `<dialog>` where a component exists.
- The screen works in dark mode (`data-theme="dark"`) and at 390px wide.
- Every interactive element can be reached and used with the keyboard, and its focus ring is fully visible.
