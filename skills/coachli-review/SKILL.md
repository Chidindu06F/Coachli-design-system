---
name: coachli-review
description: Check Coachli UI work before it is handed over - a pull request, a finished screen, or a Figma design - against the Coachli design system rules (components, tokens, copy, formats, states, dark mode, mobile, keyboard). Use before finishing any Coachli UI task, when asked to review Coachli UI, or before opening a pull request that touches the dashboard UI.
---

# Coachli review

Go through every item. Fix what you can; list anything you couldn't.

## Components

- [ ] Every control is a design system component. No raw `<button>`, `<input>`, `<select>` or `<dialog>` where a component exists; in Figma, no detached instances or look-alike frames.
- [ ] Each component is the best fit (`guidelines/choosing-components.md`), not just one that works.
- [ ] No other UI library was added.

## Tokens

- [ ] No hex, rgb or hsl colours and no pixel font sizes in the diff.
- [ ] Spacing, radius and colours use `var(--halo-…)` (code) or variables (Figma).

## Copy and formats

- [ ] Copy matches the design exactly; new copy follows the `coachli-copy` skill.
- [ ] Amounts are `CODE 10,000` with no `.00`; dates and times follow `guidelines/formats.md`.
- [ ] Sample data uses John Doe, never a real name.

## Patterns

- [ ] ⋮ opens a dropdown Menu; no bottom sheets; no modal on a drawer.
- [ ] Toasts at the top, title only.
- [ ] Tables: first column semibold, other cells regular; on mobile one card of list items.
- [ ] Missing images show `ImagePlaceholder`; missing photos show initials.

## States and devices

- [ ] Empty, filled, error and loading states exist.
- [ ] Works in dark mode and at 390px wide, with every desktop action still there.
- [ ] Every interactive element works with the keyboard, and its focus ring isn't clipped.

## Gaps

- [ ] Anything not in Figma is marked `// DESIGN GAP` and listed in the pull request for the designer.
