# Using the design system

## The rules

1. **Figma first.** Every component, token and pattern is decided in the COACHLI DESIGN SYSTEM Figma file first. The React package copies it. Code never has a variant, size or colour that Figma doesn't have.
2. **Only design system components.** Every screen is built from library components: in Figma, instances from COACHLI DESIGN SYSTEM; in code, imports from `@chidindu06f/coachli-react`. No look-alike frames, no components copied from old files, no other UI library.
3. **Don't detach.** Components have properties and slots for the things that change: text, icons, show/hide options, and slots for custom content (Modal body, Drawer content, Card content, Table cell). Use them. A detached instance stops getting library updates, so it slowly drifts from everything else.
4. **Tokens, never values.** Colours, spacing, radius and text come from variables and text styles (Figma) or `var(--halo-…)` tokens (code). Never type a hex code or a pixel size. Hard-coded values break dark mode.
5. **Light and dark.** Every screen works in both. In Figma, switch the Semantic mode on the frame; in code, `data-theme="dark"`.
6. **Pick the best component, not just one that works.** Several components can often do a job, but one fits best. A choice between three options can be a Select, a Radio group, a Segmented control or Chips; each means something different. See [Choosing components](choosing-components.md).

## When a new component is allowed

You rarely need one. Before you make a new component:

1. **Check the library.** Look through every component, its properties and its slots. What you need often already exists, or is an existing component with a different property.
2. **Check the Coachli-only components** (Setup checklist, Featured event, Create menu and others) on the Components page of the Coachli file.
3. **Try combining existing components,** in an auto layout frame or inside a component's slot.
4. **If nothing fits and it appears on only one screen,** keep it as an auto layout frame built from library components. Don't turn it into a component.
5. **If it appears on two or more screens,** make it a component.

The designer adds every new component to the Figma library first, then to the React code, and notes it in the changelog. Developers don't add components. They ask the designer.

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
