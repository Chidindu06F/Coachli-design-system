# UI rules for this app

This app is the Coachli dashboard. All UI is built with the Coachli design system.

- Import UI from `@chidindu06f/coachli-react`. Do not hand-build buttons, inputs, selects, modals, drawers, menus, tables, tabs, badges, toasts, tooltips or spinners, and do not add another UI library.
- Pick the best component for the job, not just one that works: https://github.com/Chidindu06F/Coachli-design-system/blob/main/guidelines/choosing-components.md
- In CSS use `var(--halo-…)` tokens only. No hex or rgb colours, no pixel font sizes.
- Follow the decided patterns: https://github.com/Chidindu06F/Coachli-design-system/blob/main/guidelines/patterns.md
- Copy is short, plain and one line; money is `NGN 10,000` (never `.00`). Rules: https://github.com/Chidindu06F/Coachli-design-system/blob/main/guidelines/copy.md and https://github.com/Chidindu06F/Coachli-design-system/blob/main/guidelines/formats.md
- Before building or changing a screen, read the product rules for that area in `DEVELOPERS.md`: https://github.com/Chidindu06F/Coachli-design-system/blob/main/DEVELOPERS.md
- Component docs and props: https://chidindu06f.github.io/Coachli-design-system/
- If a screen or state isn't designed, copy the closest existing screen using only the design system, mark it `// DESIGN GAP`, and say so, so the developer can tell the designer. Never invent a component in this app: https://github.com/Chidindu06F/Coachli-design-system/blob/main/guidelines/design-gaps.md
- Every screen must work in dark mode (`data-theme="dark"`) and at 390px wide.

With Claude Code, install the Coachli plugin instead: it has the full skills (`coachli-ui`, `coachli-copy`, `coachli-gaps`, `coachli-review`).
