# UI rules for this app

This app is the Coachli dashboard. All UI is built with the Coachli design system.

- Import UI from `@chidindu06f/coachli-react`. Do not hand-build buttons, inputs, selects, modals, drawers, menus, tables, tabs, badges, toasts, tooltips or spinners, and do not add another UI library.
- In CSS use `var(--halo-…)` tokens only. No hex or rgb colours, no pixel font sizes.
- Before building or changing a screen, read the product rules for that area in the design system's `DEVELOPERS.md`: https://github.com/Chidindu06F/Coachli-design-system/blob/main/DEVELOPERS.md
- Component docs and props: https://chidindu06f.github.io/Coachli-design-system/
- If a component is missing, compose it from existing ones and say so. Do not invent a new primitive in this app.
- Every screen must work in dark mode (`data-theme="dark"`) and at 390px wide.

The `coachli-ui` skill in `.claude/skills/` has the full method and the decided patterns.
