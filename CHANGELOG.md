# Changelog

Changes to `@chidindu06f/coachli-react` and `@chidindu06f/coachli-tokens`. Both packages share one version number. New work collects under **Unreleased**; see Releasing in [CONTRIBUTING.md](CONTRIBUTING.md).

## Unreleased

### Changes

- **The Premium button gradient is now teal to lime.** `button/premium-start`, `-middle` and `-end` now point to `colours/premium/teal` (#1B7470), `colours/premium/green` (#549E4B) and `colours/premium/lime` (#8CC926). It was teal to blue to violet. The Button `variant="premium"` and its name are unchanged. **Breaking for anyone using the primitives directly:** `--halo-color-premium-blue` and `--halo-color-premium-violet` are gone; use `--halo-color-premium-green` and `--halo-color-premium-lime`. Figma: Button Type=Premium picks this up from the variables.
- **New tokens: Profile theme.** A new collection with 10 modes for the public profile presets: Mono (default), Ledger, Frost, Midnight, Lush, Velvet, Terminal, Retro, Brutal and Mint. It holds 17 tokens: background, block surface, item surface, highlight surface, text (primary, secondary, tertiary), icon (primary, secondary), button fill and text, image, highlight and surface borders, and heading, body and display fonts. In CSS they are `--halo-profile-*` (for example `--halo-profile-background`, `--halo-profile-font-heading`). Mono sits on `:root`; switch a preset with `data-profile-theme="ledger"` on the profile page. It is separate from `data-theme`, so it never replaces light or dark. Spacing and radius stay on Primitives because they don't change between presets. Figma: the Profile theme collection in the design system.
- **New: `InputAffixSelect`.** A small picker for an Input's `prefix` or `suffix`, with an icon or flag, a short label and a caret, for example the currency in a price field. A native select underneath handles keyboard and screen readers. Figma: Input affix, Kind=Select. It takes a flag (4:3) or a square icon or logo, and `showLabel={false}` shows the icon only, e.g. a social platform picker. Figma: Input affix Kind=Select has one square Icon slot (Icon, Change icon) and Show label; the separate Flag slot is gone. Use the new "Flags (square)" components there, so flags, logos and icons share one slot without stretching.
- **File item error text wraps** inside the card instead of running past it on narrow screens. The default error stays "Upload failed. Try again."
- **Input, Select and Combobox pad by content:** an icon, flag, avatar, caret or tag at the edge sits 6px (sm), 8px (md) or 12px (lg) from it. Text at the edge keeps 10, 12 or 16px, because the text has 4px of its own inset. The gap between an icon and its text is unchanged. This needs no new prop: it follows what is shown. Date, colour, number and tree pickers are unchanged. Figma: the Input, Select and Combobox variants match (text sits in a "Text inset" frame), and every Combobox variant centres its content vertically.
- Figma only: **new Unsplash logo** (Logos/Media & services/Unsplash) for stock-photo pickers, like the cover image upload on Public profile.
- Figma only: **flag outlines sit outside.** All 271 flags keep their 1px `border/secondary` outline, so white flags (Japan, Finland) stay visible on white, but it is now outside the flag instead of covering its outer pixel. The **Instagram logos** (Logos/Social and Logos/A-Z) use the Instagram brand gradient instead of black, like the other social logos. No code change: flags and logos are passed in by the app.
- **Error and destructive text is the same red as their icons** (`state/error/primary`, #E93544) instead of the dark red `state/error/contrast`. This covers field error messages (Input, Select, Textarea, date and time fields, Rich text editor, Radio group), File upload and File item errors, Progress hints, the Stepper error title and destructive Menu items. Alert, Badge, Result and the destructive Modal icon keep the dark red, because it sits on a light red fill.

## 0.2.8

### Changes

- **Modal is Header, Body, Footer.** The Body holds everything between the title and the buttons: the `description` first, then any `children` (a form, an image, a list). It is one area with a 12px gap, and it's the part that scrolls past 720px. Before, the description and the content were two separate areas.
- **Style parts renamed:** `content` → `body` (it now also wraps the description) and `actions` → `footer`. The `description` part stays. Props are unchanged.
- **The whole brand is teal, not only buttons.** Every brand token now uses the teal ramp at the same step it used on aubergine: `surface/brand` (`teal/0`), `surface/brand-secondary` (`teal/100`), `surface/brand-contrast` and `text/brand` and `border/contrast` (`teal/300`), `surface/brand-heavy-contrast` (`teal/600`), `border/focus` (`teal/200`), `illustration/accent` (`teal/100`) and `illustration/accent-strong` (`teal/200`). Dark mode does the same with the dark steps. So progress bars, checkboxes, radios, switches, tabs, selected dates, sliders, steppers and focus rings are teal. `text/on-brand` and `icon/on-brand` are white in light mode (were lilac) and `teal/900` in dark mode. The `colours/aubergine/*` ramp stays for anything that names it directly.
- **New: `ImageUpload`.** A round image with Upload, or Change and a red Remove once there's an image, for profile photos and business logos. `kind` is `person` (user icon when empty) or `business` (building icon), and `layout` is `default` (title and hint beside it) or `compact`. Figma: Image upload on the File upload page.
- **List rows have no side padding**, matching Figma: the container gives the inset. The `card` list is 12px at the sides and 8px at the top and bottom, and rows sit flush (gap 0).
- **New `inset` on `List` and `ListItem`** for lists whose rows can be hovered or selected, like conversations and pickers: each row gets 8px side padding (`spacing-4`) so the highlight doesn't touch the avatar.
- **New tokens for chat bubbles:** `surface/chat-sent` and `text/chat-sent` on a new `colours/slate` ramp (`100`, `200`, `800`, `900`), with light and dark values. Sent messages use them instead of brand teal.
- Figma: the Modal's Body frame and Content slot are now one **Body** slot that starts with the description; replace it or add anything. **Show content** is gone, and the **Actions** slot is now **Footer**.

## 0.2.7

### Changes

- **Primary buttons are teal again.** `button/primary` is `colours/teal/300` (`#1B7470`), with `teal/400` for hover and pressed. Dark mode uses `teal/250`, with `teal/200` for hover and pressed. Link buttons follow, since they use `button/primary` for their text.
- **New token `button/primary-label`** for the label, icons and loading spinner on Primary buttons: white in light mode, `teal/900` in dark mode. Primary buttons no longer use `text/on-brand` / `icon/on-brand`, which stay lilac for the other brand fills.
- Only buttons change. Checkboxes, radios, switches, tabs, the selected date and other brand fills keep `surface/brand-contrast` (aubergine). The Figma library has the same change.

## 0.2.6

### Changes

- **Modal: long content scrolls inside the modal.** The modal never grows past 720px (or the window, if smaller). The title, description and actions stay put; only the content area scrolls. Before, the whole modal scrolled. Figma: the Modal's Content slot has a 480px max height with vertical scrolling.

## 0.2.5

### Fixes

- **Avatar icon badge:** the icon now sits at 64% of the badge, centred, so icons without built-in padding (like a pencil) no longer touch the edge. In Figma, the Avatar's status slots are also anchored to their corner, so a smaller badge on a large avatar stays tucked in the corner.

## 0.2.4

### Changes

- **Avatar status icon badge: new `brand` option.** Plain by default (white circle, `icon/primary`). Pass `brand` to fill it with the primary colour (`surface/brand-contrast`) and an `icon/on-brand` icon, like a small primary button. The account menu's pencil uses `brand`. Figma: Avatar status, Type=Icon, Brand.

## 0.2.3

### Changes

- **Avatar status: `icon` replaces `pin` and `edit`.** One badge type for any icon: `<AvatarStatus type="icon" icon={<PencilSimple />} />`. It's a push pin when you don't pass `icon`. `type="pin"` still works but is deprecated. The `edit` type from 0.2.2 is removed: use `icon` with a pencil. Figma: Avatar status, Type=Icon with Change icon (Pin was renamed and the Edit variants were removed).

## 0.2.2

### Changes

- **Avatar status: new `edit` type.** A pencil in a white circle with a thin border, for "change photo" or "edit profile", like the account menu's avatar: `<Avatar status="edit" />`. Screen readers announce "Edit" unless you pass a `label`. Figma: Avatar status, Type=Edit.

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
