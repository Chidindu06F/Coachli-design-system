# Changelog

Changes to `@halo-ds/react` and `@halo-ds/tokens`. Both packages share one version number.

New work collects under **Unreleased** and goes live in Storybook straight away. It only reaches npm when we choose to release a batch: then the Unreleased heading becomes the new version number (see Releasing in [CONTRIBUTING.md](CONTRIBUTING.md)).

## Unreleased

### New components

- **Time picker**: `TimePicker` and `TimePickerField`. A list of times at a set step, in 12 or 24 hours, with `min` and `max`.
- **Rating**: stars for giving a score or showing an average, with half stars and a read-only mode.
- **Carousel**: `Carousel` and `CarouselSlide`, with arrows, dots and several slides per view. It never moves on its own.
- **Charts**: `LineChart`, `AreaChart`, `BarChart` (vertical or horizontal, grouped or stacked), `PieChart` (pie or donut) and `Sparkline`. Drawn with SVG and no chart library. They fill their container, show fewer labels on small screens, have hover, tap and keyboard tooltips, and give screen readers a table of the numbers.

### Changes

- **Button**: new `loading` prop shows a Spinner and ignores clicks while an action runs.
- **Select**: new `icon` prop for an icon at the start of the box.
- **Field states**: every text, select, combobox, date, time, colour, textarea and rich text field shows a red warning icon inside the box when it has an error, next to the red border and the message. **Input** also takes a new `valid` prop that shows a green check, with no green border and no message.
- **Date range picker**: the box now reads "Start date – End date". **Breaking:** `placeholder` is replaced by `startPlaceholder` and `endPlaceholder`.

### Tokens

- New `icon/rating` and `icon/rating-empty` colours.
- New `chart/series-1` to `chart/series-6` and `chart/grid` colours, with dark mode values.

## 0.1.0

First public release.
