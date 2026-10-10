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
- **Input**: new success state. `success` on `InputField` (and `Field`) shows a green message; `valid` on `Input` gives a green border and a check at the end.
- **Success state on other fields**: `SelectField`, `ComboboxField`, `DatePickerField`, `DateRangePickerField`, `TimePickerField`, `ColorField`, `TextareaField` and `RichTextEditorField` take `success` for a green message with a check. Their controls take `valid` for a green border.
- **Date range picker**: the box now reads "Start date – End date". **Breaking:** `placeholder` is replaced by `startPlaceholder` and `endPlaceholder`.

### Tokens

- New `icon/rating` and `icon/rating-empty` colours.
- New `chart/series-1` to `chart/series-6` and `chart/grid` colours, with dark mode values.

## 0.1.0

First public release.
