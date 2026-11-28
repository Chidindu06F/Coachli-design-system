# Designing screens

## Every state

Design each page, field and preview in this order:

1. **Empty state:** nothing has been created yet. Every flow starts from its list page in this state.
2. **Create and edit:** the flow for creating or editing something, shown step by step.
3. **Filled:** the page with real-looking content in it.
4. **Error:** what happens when something goes wrong: field errors, failed uploads, failed payments, no search results.
5. **Edge cases:** the unusual but possible cases: very long names, one item or hundreds, slow loading (skeletons), no permission, an expired link.

A new flow gets every state the closest existing flow has. If One-off sessions has an error state for a step, Live events has it too.

## How a Coachli Figma page is laid out

- **One page per menu item** (Home, Invoices, Live events…).
- **One row per feature,** each with a section header. Inside a row, screens go left to right: Empty state → create and edit → filled → error → edge cases.
- **Sections are grey** (#C2C2C2 fill) with divider headers, and each screen has a black label above it.
- **Desktop screens are 1440 wide** (1024 minimum). **Mobile screens are 390 wide** and at least 844 tall, with the content filling the height.
- **Modals, drawers and menus are shown open** inside their screen, at full height, so every option is visible. Every select is shown open once with its full list. Every ⋮ has its menu drawn.
- **Dialogs sit in the screen's Overlay slot.** The overlay is 40%.
- **Mobile matches desktop:** same type weights, same actions, same copy.

## Build rules in Figma

- **Auto layout everywhere.** No loose frames or rectangles.
- **Clip sections and cards** so content never spills; header text fills its width; long names use an ellipsis.
- **New frames don't clip** unless they scroll, so focus rings aren't cut.
- **Anything used twice is a component,** and its copies keep the same layout.
- **When you change desktop, change mobile too,** and every copy, override and collapsed section that shows it.

## Prototype as you build

Wire each flow's links while you build it: buttons, menus, tabs and Back. Figma can't link across pages, so keep a flow on one page or note where it continues.

## Dev notes

Behaviour a screen can't show (timing, what gets saved, what an email says, scrolling) goes in a yellow **Dev note** card to the right of the screen.

## Handing over a change

1. Change the design system first if a component or token changes, and publish the library.
2. Update the screens in the Coachli file. Accept library updates there.
3. Make sure the React package matches, and add a line to `CHANGELOG.md`.
4. If it's a new decided pattern, add it to these guidelines and the Figma *Getting started* page.
