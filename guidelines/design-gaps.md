# Design gaps

Sometimes a developer reaches a screen, state or message the designs don't cover. Here is what to do.

## Developers

1. **Look first.** Check the Coachli Figma page for that feature, including the Archive page, dev notes and the closest flow. Check Storybook and [Patterns](patterns.md).
2. **Copy the closest existing screen.** If Live events has no error for a step, copy how One-off sessions does it. Same layout, same components, same kind of copy.
3. **Build it only from the design system:** components from [Choosing components](choosing-components.md), tokens, the copy rules in [Writing copy](copy.md) and the [Formats](formats.md). It should look like a designer made it.
4. **Mark it.** Put a `// DESIGN GAP: …` comment in the code and list it in the pull request description, with a screenshot.
5. **Tell the designer.** The designer reviews it and adds it to Figma (and to the design system if it's a new component). Developers never edit Figma or invent a component in the app.

## Designers

1. Review the gap. Either approve what was built or design the right version.
2. Add the screen or state to the Coachli file, in its feature row.
3. If it needed a new component or token: add it to the design system first, then the React package, then the changelog.
4. If it's a new rule, add it to these guidelines and the Figma *How to use* page so the next gap is easier.

## AI tools

Follow the developer steps. Never hide a gap: say what was missing, what you built, and which existing screen you copied.
