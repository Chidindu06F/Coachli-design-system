---
name: coachli-gaps
description: What to do when a Coachli screen, state, message or component is missing from the Figma designs - an error, empty, loading or edge case state, a missing mobile view, a dialog nobody drew. Use whenever you are about to build or design something the Figma file doesn't show, or a developer asks how to fill a design gap.
---

# Coachli design gaps

When something isn't designed, build the version a Coachli designer would most likely make, using only the design system, and make the gap visible.

Read `${CLAUDE_PLUGIN_ROOT}/guidelines/design-gaps.md` (or https://github.com/Chidindu06F/Coachli-design-system/blob/main/guidelines/design-gaps.md).

## Steps

1. **Look first.** Check the feature's page in the Coachli Figma file (with the Figma MCP), its dev notes, the Archive page, Storybook and `guidelines/patterns.md`. The answer is often already there in another flow.
2. **Copy the closest existing screen.** If Live events has no error for a step, do what One-off sessions does. Same layout, same components, same kind of copy. A new flow gets every state the closest flow has: empty, create and edit, filled, error and edge cases (long names, many items, slow loading, no permission).
3. **Use only the design system.** Pick components with `guidelines/choosing-components.md`, tokens only, copy and formats from the `coachli-copy` skill, images from `guidelines/images.md`.
4. **Mark it.** In code, add `// DESIGN GAP: <what was missing>, copied from <screen>` above it. In the pull request, list every gap with a screenshot.
5. **Tell the developer to tell the designer.** The designer reviews it and adds it to Figma. Developers never edit Figma, and you never add a new component to the app or the design system on your own.

## Never

- Leave a blank area, an empty box or a raw error message.
- Invent a new look, colour, component or UI library to fill the gap.
- Hide that something was missing.
