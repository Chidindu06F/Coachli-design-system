# Using the design system

## The rules

1. **Figma first.** Every component, token and pattern is decided in the COACHLI DESIGN SYSTEM Figma file first. The React package copies it. Code never has a variant, size or colour that Figma doesn't have.
2. **Only design system components.** Every screen is built from library components: in Figma, instances from COACHLI DESIGN SYSTEM; in code, imports from `@chidindu06f/coachli-react`. No look-alike frames, no components copied from old files, no other UI library.
3. **Don't detach.** Components have properties and slots for the things that change: text, icons, show/hide options, and slots for custom content (Modal body, Drawer content, Card content, Table cell). Use them. A detached instance stops getting library updates, so it slowly drifts from everything else.
4. **Tokens, never values.** Colours, spacing, radius and text come from variables and text styles (Figma) or `var(--halo-…)` tokens (code). Never type a hex code or a pixel size. Hard-coded values break dark mode.
5. **Light and dark.** Every screen works in both. In Figma, switch the Semantic mode on the frame; in code, `data-theme="dark"`.
6. **Pick the best component, not just one that works.** Several components can often do a job, but one fits best. A choice between three options can be a Select, a Radio group, a Segmented control or Chips; each means something different. See [Choosing components](choosing-components.md).

## When a new component is allowed

Almost never. Before you make one:

1. Check every component on the library pages, including their properties and slots. Most "new" things are an existing component with a different property, or a slot filled with other components.
2. Try to build it from existing components inside a slot or an auto layout frame.
3. Check the Coachli-only pieces (Setup checklist, Featured event, Create menu and others). These are local components in the Coachli file, built from library parts.

Only when nothing solves the problem:

- **Used once on one screen:** build it from library components in an auto layout frame. Don't make it a component.
- **Used twice or more:** it must be a component. In the Coachli file, a local component built from library parts. If other products could use it, add it to the design system (Figma, then React, then the changelog).

## Who adds what

| Who | Does what |
| --- | --- |
| **Designer** | Owns Figma. Adds and changes components, tokens and screens in the design system and the Coachli file. Publishes the library. Makes sure the React package matches (or asks for it). Writes a line in `CHANGELOG.md`. |
| **Developer** | Builds screens with the published packages. Never changes a component's look inside the app. When a screen, state or component is missing, tells the designer (see [Design gaps](design-gaps.md)). |
| **AI tools** | Follow these guides. Never invent components or styles. Flag gaps instead of hiding them. |

## Where things live

| What | Where |
| --- | --- |
| Components, tokens, docs for each component | Figma: COACHLI DESIGN SYSTEM |
| Product screens, flows and prototypes | Figma: Coachli, one page per menu item |
| Coachli-only components (Setup checklist, Featured event, Create menu) | Figma: Coachli, Components page |
| React components and tokens | GitHub: Chidindu06F/Coachli-design-system, published as `@chidindu06f/coachli-react` and `@chidindu06f/coachli-tokens` |
| Live component docs | Storybook: https://chidindu06f.github.io/Coachli-design-system/ |
| What changed and when | `CHANGELOG.md` in the repository |
| Page-by-page product rules | `DEVELOPERS.md` in the repository |
