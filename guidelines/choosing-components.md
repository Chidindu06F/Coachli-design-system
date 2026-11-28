# Choosing components

Find the job in the left column and use the component on the right. Names are the same in Figma and React.

## Actions

| Job | Use | Not |
| --- | --- | --- |
| The main action on a screen or dialog | `Button` Primary (teal, white label). One per area | Two primary buttons side by side |
| Other actions next to it | `Button` Secondary; Tertiary for quiet ones (Cancel) | |
| Delete, remove, refund | `Button` Destructive, after a confirm `Modal` | |
| An action inside a sentence or a bar ("Register now") | `LinkButton` | A Button styled as text |
| An icon-only action in a header or row (message, WhatsApp, bell, time zone) | `Button` Secondary Small, icon only, with a tooltip | `CompactButton` |
| A small icon action inside a field or tight space (show password, clear, info) | `CompactButton` | |
| More actions on a row or card (⋮) | `Button` icon only that opens a `Menu` under it | A bottom sheet |
| A button that opens a list of things to create | `Button` + `Menu` | |
| Sign in with Google, Apple and so on | `SocialButton` | |

## Choosing and entering

| Job | Use | Not |
| --- | --- | --- |
| Short text, email, link, number with a unit | `Input` (with prefix or suffix) | |
| Price with currency | `Input` with an `InputAffixSelect` prefix (currency code) | A separate currency Select |
| Long text without formatting | `Textarea` | |
| Descriptions, notes, messages with formatting | `RichTextEditorField` | |
| Pick one from many options (5+), or options that come from data | `Select` | |
| Pick one from many with search, or add a new one (customers) | `Combobox` | |
| Pick one from 2–4 options that switch a view | `SegmentedControl` | Tabs |
| Pick one from 2–5 options in a form, all visible | `Radio` group | Select |
| Pick one or several options shown as choices (topics, days) | Coachli Chip (Coachli file, Components) | Buttons |
| Turn a setting on or off, effect is immediate | `Switch` | Checkbox |
| Agree, or tick several items in a list | `Checkbox` | Switch |
| A number with plus and minus | Number input (`Input` type number) | |
| A range or a level | `Slider` | |
| A date / a time | `DatePicker` / `TimePicker` | Three Selects |
| A colour | `ColorPicker` | |
| Upload files / a single image or cover | `FileUpload` / `ImageUpload` | |
| A rating | `Rating` | |

## Showing information

| Job | Use | Not |
| --- | --- | --- |
| Rows of records with columns (sales, invoices, contacts) | `Table`; on mobile one bordered card of `List` items with `Divider`s | A grid of Cards |
| A simple list (notifications, settings, help articles) | `List` | |
| A group of related content on a page | `Card` | |
| A number with a label (metrics) | `Statistic` inside a `Card` | |
| Trends and breakdowns | `Chart` | |
| A status (Paid, Pending, Draft, Starts in) | `Badge` | Coloured text |
| A label the user added or can remove (filters, topics) | `Tag` | Badge |
| A person | `Avatar`; several people `Avatar group` | |
| An achievement | `Award` (earned) or `Award inactive` | Faded award |
| Steps in a process / progress | `Stepper` / `Progress` | |
| Content that can open and close | `Accordion` | |
| Images or cards you swipe through | `Carousel` | |
| A missing image | `ImagePlaceholder` | An empty grey box |
| Loading content | `Skeleton`; a short wait inside a button `Spinner` | A full-page spinner |
| Nothing here yet | `EmptyState` (illustration, title, one line, one button) | A blank area |
| The result of a finished flow (published, paid) | `Result`, or a `Modal` with `Confetti` for celebrations | |

## Messages and feedback

| Job | Use | Not |
| --- | --- | --- |
| Confirm an action worked ("Link copied") | `Toast`, at the top, title only | An Alert |
| Information or a warning about one page | `Alert` | A Toast |
| News for all of Coachli (a Coachli event) | `AnnouncementBar` at the very top | An Alert |
| A short hint on hover or focus | `Tooltip` | Helper text under everything |
| A first-time walkthrough | `Tour` | |

## Dialogs and navigation

| Job | Use | Not |
| --- | --- | --- |
| A short decision or form that blocks the page (confirm, report a bug, time zone) | `Modal` | A Drawer |
| Details of a record, or a task done beside the page (order details, reschedule) | `Drawer` (560px on desktop, full screen on mobile) | A Modal |
| A next step from inside a drawer | The same `Drawer`, new title and body, footer Back + action | A Modal on top |
| A small panel tied to a button (notifications, account) | `Popover` | A Modal |
| A list of actions from a button | `Menu` | A Popover with buttons |
| Switch between sub-pages | `Tabs` Line | |
| Filter the content below (All / Unread) | `Tabs` Pill, Medium, with a count when it holds a list | SegmentedControl |
| Where am I | `Breadcrumbs`, under the page title | A back arrow |
| Main app navigation | `Sidebar` + `NavItem` | |
| Many pages of rows | `Pagination` | Infinite scroll |
