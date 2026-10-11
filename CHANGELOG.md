# Changelog

Changes to `@halo-ds/react` and `@halo-ds/tokens`. Both packages share one version number.

New work collects under **Unreleased** and goes live in Storybook straight away. It only reaches npm when we choose to release a batch: then the Unreleased heading becomes the new version number (see Releasing in [CONTRIBUTING.md](CONTRIBUTING.md)).

## Unreleased

### New components

- **Time picker**: `TimePicker` and `TimePickerField`. A list of times at a set step, in 12 or 24 hours, with `min` and `max`.
- **Rating**: stars for giving a score or showing an average, with half stars and a read-only mode.
- **Carousel**: `Carousel` and `CarouselSlide`, with arrows, dots and several slides per view. It never moves on its own.
- **Charts**: `LineChart`, `AreaChart`, `BarChart` (vertical or horizontal, grouped or stacked), `PieChart` (pie or donut) and `Sparkline`. Drawn with SVG and no chart library. They fill their container, show fewer labels on small screens, have hover, tap and keyboard tooltips, and give screen readers a table of the numbers.
- **QR code**: `QRCode` draws a scannable code from any text or link, with an encoder built in (no extra package). Three sizes, all four error correction levels, an optional logo in the middle, and loading and expired states with a Refresh button. It stays dark on light in dark mode so every phone can read it. A `scanned` status shows when a phone has read the code. `color` and `bgColor` set custom colours, and `labels` changes the cover text for other languages.
- **Tour**: shows new people around a screen one step at a time. Each step points at part of the page like a Popover, with Back, Next and Skip, a "2 of 5" counter or dots, an optional image, and a spotlight that dims the rest of the page. Steps without a target sit in the middle for a welcome or wrap-up. Arrow keys move between steps, Escape skips, and `onFinish` and `onSkip` let the app remember it was seen.
- **Event calendar**: `EventCalendar` is a full-size calendar for planning. Click the title to open a calendar and jump to any date (its month name jumps to other months and years), and a switch changes the view; events over several days run as one bar, busy days show "+2 more", and `renderDay` adds your own content to each day. Under 600px wide it shows dots and lists the chosen day's events. Event colours use the Tag colours. Day and Week views show hours with timed events placed by their start and end, overlapping events side by side, an all-day row and a line at the current time; `onSlotClick` gives the time of an empty slot people click. Events can show an `avatar` before the title and a `detail` line, like the reason for an appointment, instead of the time.

### Changes

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
