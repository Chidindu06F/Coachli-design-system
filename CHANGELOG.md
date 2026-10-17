# Changelog

Changes to `@chidindu06f/coachli-react` and `@chidindu06f/coachli-tokens`. Both packages share one version number. New work collects under **Unreleased**; see Releasing in [CONTRIBUTING.md](CONTRIBUTING.md).

## Unreleased

## 0.2.1

### Changes

- **Button tokens are for buttons only.** Brand-coloured parts of other components used `button/primary` (inherited from Halo). They now use brand surface tokens with the same colours:
  - `surface/brand-contrast`: Badge (brand dot, solid brand badge), Checkbox and Radio (checked), Switch (on), Slider, Progress bar and circle, Spinner, Stepper, Tabs indicator, Carousel dot, Tree, Avatar "add" status.
  - `surface/brand-heavy-contrast`: their hover states (a touch deeper than the button hover).
  - `surface/secondary`: grey hover rows in Menu, List, Tag, Date picker, Event calendar and Accordion.
  - `text/brand`: the open Accordion title.
  - Buttons, Compact button, Social button and Link button keep the `button/*` tokens. The Figma library has the same change.

## 0.2.0

### New components

- **Image placeholder:** `ImagePlaceholder`, the default image Coachli shows when someone hasn't uploaded one (offering and event covers, product images, thumbnails). A grey background (`illustration/backdrop`) with a pattern of 24 coaching and mentorship icons (`illustration/shade`). It follows dark mode. `ratio`: `16:9` (covers), `4:3`, `1:1`, `small-pattern` and `small-logo` (the faint Coachli mark) for thumbnails under about 80px. Large ratios fill their container; small ones are 64px unless you set `width`. Pass `label` (for example "No cover image") to have screen readers announce it; otherwise it's hidden from them. Figma: Image placeholder (Ratio). Code Connect is mapped.

## 0.1.0 (Coachli)

The first Coachli release: Halo's components (as of "Add Form with built-in checks and layout helpers"), themed and adjusted to match the COACHLI DESIGN SYSTEM Figma library.

### Brand

- **Primary colour is aubergine.** `button/primary` is `#3B1240` with a lilac label (`text/on-brand` `#F3C8F4`). In dark mode it's a light purple (`#C98BD2`) with a dark label. Hover, pressed, brand surfaces, brand text, the focus ring (`#DDAFE2`) and illustration accents follow. Provisional: the colour may still change.
- **New colour ramps:** `colours/aubergine/*`, plus `colours/raspberry/*` and `colours/lilac/*` (kept as alternatives, not used yet), `colours/teal/*` (the previous brand colour) and `colours/premium/*` (the Premium gradient: teal, blue, violet).
- **Typography is Inter** for headings, body, captions and labels (`--halo-font-family-*`). `family/display` is New Spirit, for marketing only. Load Inter with `@fontsource/inter`.

### Dark mode fixes

Text and icons on coloured fills were using `text/on-brand`, which only suits the brand colour. In dark mode the X, LinkedIn and GitHub logos were nearly invisible. New tokens, with each component using the right one:

- `text/on-color`, `icon/on-color`: white in both modes. Used by **Social button** (logo and label), the **Premium** button and **Avatar** status icons.
- `text/on-status`, `icon/on-status`: white in light mode, near-black in dark mode. Used by **solid Badges** in information, success, warning and error.
- `icon/on-contrast`: white in light mode, near-black in dark mode. Used by the **Switch** knob.

### Components

- **Sidebar:** new `beforeFooter` prop, for content between the main items and the footer, like the Coach / Customer role switch. It's hidden when the sidebar is collapsed. Figma: *Show footer* (Footer slot). Report a bug and Log out go in `footer` as NavItems (Figma: *Show report a bug*, *Show log out*).

### Tooling

- Packages renamed to `@chidindu06f/coachli-react` and `@chidindu06f/coachli-tokens`, published to GitHub Packages by the *Publish packages* action.
- `pnpm tokens:merge` applies the COACHLI Figma export (`packages/tokens/coachli/export.json`) to the token files and rebuilds them.
- Code Connect points at the COACHLI library. Mappings for components the library doesn't have yet are excluded.
- Storybook uses Inter and the Coachli logo.

---

The entries below are Halo's history, from before this copy was made.

## Halo: Unreleased (at the time of the copy)

### New components

- **Form**: `Form`, `FormSection`, `FormRow` and `FormActions`. A form that checks itself: fields with a `name` show the form's errors, `required` fields are checked for you, and `validate` adds your own rules. Errors show after the first submit, focus moves to the first problem, and errors update as people fix them. `errors` shows messages from the server. `layout="horizontal"` puts labels beside fields, and they move above on phones.
- **Tree**: nested items people open and close, like folders, categories or permissions. Pick one row, or turn on `checkable` for checkboxes that cascade: checking a branch checks everything inside it, and a branch shows a dash when partly checked. Full keyboard support (arrow keys, Home, End, Enter, Space), icons per row, two sizes.
- **Tree select**: `TreeSelect` and `TreeSelectField`. A Select-style box that opens a Tree, for picking from nested options. Single, or `multiple` with checkboxes and tags in the box, with optional `search`.
- **Resizable**: `ResizablePanelGroup`, `ResizablePanel` and `ResizableHandle`. Panels people resize by dragging the line between them, side by side or stacked, and nested. Sizes are in percent with a minimum and maximum. Handles work with the arrow keys, Home and End, can show a grip, and `onLayout` reports the sizes so you can save them.
- **Result**: the outcome of something people did, like a payment going through, or why a page can't show. Success, error, warning and information show an icon in a circle; not found, no access, server error, offline and maintenance show an illustration. Takes a title, description, actions and details like a receipt, in two sizes.
- **Statistic**: a key number with its label, an optional prefix or suffix, and how it changed (a trend badge and "vs last month"). Small, Medium and Large, with a loading state. `sentiment` sets whether the change is good or bad, for numbers like churn where down is good.

### Changes

- **Fields in forms**: Combobox, the date pickers and the colour input take a `name` and submit their values with the form, like the other fields. Date pickers send YYYY-MM-DD.
- **Table extras**: `stickyHeader` with `maxHeight` keeps the header in view while rows scroll, and `stickyFirstColumn` keeps the first column in view on wide tables. `TableHeaderCell` takes a `filter` that opens from a funnel button. New `TableExpandToggle` and `TableExpandedRow` for rows that open to show details. `DataTable` wires these up: column `filters` (with an optional `onFilter`) and `expandable` with `rowExpandable`.
- **Stepper on small screens**: a horizontal Stepper now switches to the compact version by itself when it has less than 600px, like on a phone. Change the width with `compactBelow`, or pass `false` to keep it horizontal.
- **Premium button**: `variant="premium"` is a violet, purple and rose gradient for upgrades and paid features, like Upgrade to Pro or Start free trial. Use at most one per screen and never next to a Primary button. It comes in every size, with icons, icon-only and loading. In Figma it's Type=Premium.

### Tokens

- `button/premium-start`, `button/premium-middle` and `button/premium-end` set the Premium gradient (`--halo-button-premium-*`).

## 0.2.0

**Breaking:** the date range picker's `placeholder` prop is now `startPlaceholder` and `endPlaceholder`. Everything else is new or backwards compatible.

### New components

- **Time picker**: `TimePicker` and `TimePickerField`. A list of times at a set step, in 12 or 24 hours, with `min` and `max`.
- **Rating**: stars for giving a score or showing an average, with half stars and a read-only mode.
- **Carousel**: `Carousel` and `CarouselSlide`, with arrows, dots and several slides per view. It never moves on its own.
- **Charts**: `LineChart`, `AreaChart`, `BarChart` (vertical or horizontal, grouped or stacked), `PieChart` (pie or donut) and `Sparkline`. Drawn with SVG and no chart library. They fill their container, show fewer labels on small screens, have hover, tap and keyboard tooltips, and give screen readers a table of the numbers.
- **QR code**: `QRCode` draws a scannable code from any text or link, with an encoder built in (no extra package). Three sizes, all four error correction levels, an optional logo in the middle, and loading and expired states with a Refresh button. It stays dark on light in dark mode so every phone can read it. A `scanned` status shows when a phone has read the code. `color` and `bgColor` set custom colours, and `labels` changes the cover text for other languages.
- **Tour**: shows new people around a screen one step at a time. Each step points at part of the page like a Popover, with Back, Next and Skip, a "2 of 5" counter or dots, an optional image, and a spotlight that dims the rest of the page. Steps without a target sit in the middle for a welcome or wrap-up. Arrow keys move between steps, Escape skips, and `onFinish` and `onSkip` let the app remember it was seen.
- **Event calendar**: `EventCalendar` is a full-size calendar for planning. Click the title to open a calendar and jump to any date (its month name jumps to other months and years), and a switch changes the view; events over several days run as one bar, busy days show "+2 more", and `renderDay` adds your own content to each day. Under 600px wide it shows dots and lists the chosen day's events. Event colours use the Tag colours. Day and Week views show hours with timed events placed by their start and end, overlapping events side by side, an all-day row and a line at the current time; `onSlotClick` gives the time of an empty slot people click. Events can show an `avatar` before the title and a `detail` line, like the reason for an appointment, instead of the time.

### Changes

- **Top bar on phones**: with a menu button, the logo now leaves the bar too, so it only holds the menu button and the actions. Open a Drawer from the menu button with the logo at the top and the links below; the Top bar story shows how.
- **Style the parts inside any component**: every component takes `classNames` and `styles` keyed by part name, like `<Modal classNames={{ header: 'my-header' }} />` or `<Table styles={{ cell: { padding: 8 } }} />`. Your classes are added after Halo's and your styles are merged on top. Outer elements get `data-halo` with the component's name and parts get `data-part`, so you can also style them from your own CSS: `[data-halo='modal'] [data-part='header']`. Each component exports its part names as a type (like `ModalPart`). Fields with a label take `fieldClassNames` and `fieldStyles` for the label, hint and count. A new **Customising** docs page explains it all.
- **Find the code from Figma**: every component set in Figma links to its Storybook page and shows its React import in Dev Mode. Code Connect files in `packages/react/figma` are ready to publish for teams on a Figma plan that supports it (see CONTRIBUTING).

- **Button**: new `loading` prop shows a Spinner and ignores clicks while an action runs.
- **Select**: new `icon` prop for an icon at the start of the box.
- **Toast**: a soft shadow under it, so it reads as floating over the page.
- **Event calendar**: the back and forward arrows now sit either side of the title they change (‹ 12 – 18 Oct 2026 ›), and the title keeps a steady width so the arrows stay put. There is no Today button; the calendar that opens from the title marks today.
- **Calendar and DatePicker**: new month and year picker (`header="picker"` on Calendar, `calendarHeader="picker"` on DatePicker). Click the month name (plain text, no dropdown arrow) to swap the days for the twelve months, or the year for a grid of years, to jump straight to a date years away.
- **Several dates**: new `MultiDatePicker` and `MultiDatePickerField` pick separate days, like days off, and show each as a Tag in the box. Calendar has a matching `mode="multiple"`, with `maxCount` to set a limit.
- **Popovers and menus**: a menu opened inside another panel, like a Select in a date picker, no longer closes the panel when you pick from it, and Escape closes only the top one.
- **Rich text editor**: new `size="sm"` for phones and narrow panels: tighter padding and a toolbar that scrolls sideways in one row.
- **Popover**: stays on screen when it opens to the left or right of something near the top or bottom edge.
- **Tag**: new `color` prop. Pick one of seven preset colours (`blue`, `green`, `yellow`, `orange`, `red`, `pink`, `purple`) or pass any CSS colour, like `"#7C3AED"`, for colours people choose themselves. Neutral stays the default.
- **Field states**: every text, select, combobox, date, time, colour, textarea and rich text field shows a red warning icon inside the box when it has an error, next to the red border and the message. **Input** also takes a new `valid` prop that shows a green check, with no green border and no message. The error message under a field no longer has its own icon, since the box shows it.
- **Date range picker**: the box now reads "Start date – End date". **Breaking:** `placeholder` is replaced by `startPlaceholder` and `endPlaceholder`.

### Tokens

- New `icon/rating` and `icon/rating-empty` colours.
- New `chart/series-1` to `chart/series-6` and `chart/grid` colours, with dark mode values.
- New `tag/<colour>/surface` and `tag/<colour>/text` colours for blue, green, yellow, orange, red, pink and purple tags, with dark mode values.
- New `shadow/soft` colour for shadows under things that float over the page, with a darker dark mode value.

## 0.1.0

First public release.
