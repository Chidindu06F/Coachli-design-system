# Patterns

Layout and behaviour we have already decided. Follow them on new screens too. Page-by-page details are in `DEVELOPERS.md`.

## Layout

- **App shell:** the window never scrolls on desktop. The sidebar is full height, the page header stays at the top, and only the page body scrolls, with 60px of space after the last section.
- **Group related things:** a section's heading, its actions and its content (table or list) sit in one container with a 12–16px gap. Sections are separated by the larger page gap.
- **Table toolbar:** count, search and Export sit in one toolbar right above the table.
- **Lists have no side padding.** List items have 0 left and right padding; the container gives the inset (12px sides, 8px top and bottom), so rows line up with their heading.
- **Fill the container.** Fields and info boxes fill their container. Selects with short, known options (currency, period, page size) fit their content; currency fields in forms are 120px.
- **Form fields are 20px apart** in create and edit forms. A field label sits 8px above its field.
- **Breadcrumbs go under the page title.** No back arrow.
- **Don't clip focus rings.** Only containers that scroll or truncate clip their content.
- **Side drawers are 560px** on desktop and full screen on mobile.
- **Modals are at most 720px tall.** The header and buttons stay put; only the body scrolls. Modal padding is 20px on every side.

## Behaviour

- **One overlay at a time.** Never a modal on top of a drawer. An action started in a drawer continues in the same drawer, with Back in the footer.
- **⋮ opens a dropdown Menu** under it, on mobile too. Never a bottom sheet.
- **No bottom sheets.** On mobile, small dialogs are centred modals 16px from each side; filters and pickers are dropdowns like desktop; drawers are full screen.
- **Mobile keeps every action** desktop has. A row with a ⋮ on desktop has a ⋮ on mobile.
- **Toasts** appear at the top centre, title only.
- **Overlays blur.** Modals and drawers dim and blur the page behind them.
- **Dropdowns and popovers** have no arrow and a soft shadow.
- **Tabs that hold a list show a count badge.** Counts are totals and don't change while searching. Pill tabs filter; Line tabs switch sub-pages.
- **Period filters** list Today, Yesterday, Last 7 days, Last 30 days and All time. No custom range or calendar.
- **Choices behind a switch** (redirect after purchase): the switch turns it on, and the dropdown has no "None" option.
- **Don't disable options when a limit is reached.** Let the person choose, then explain the limit.

## Create and edit flows

- Create flows are steps with a live preview. They start from the list page.
- **Bottom bar (desktop):** Cancel (and Back from step 2) on the left. On the right: Save as draft, then Next, or Publish on the last step. The last button is always **Publish**.
- **Edit pages** use the same steps. Right side: Next (not on the last step) and a primary **Update** on every step. No demo video card.
- Step titles name the exact kind: "Create a one-off session", not "Create a 1:1 session".
- On mobile, ✕ closes the flow, with 12px between ✕ and the title.

## Tables and lists

- **Text:** the first column (what the row is) is semibold. Every other cell is regular `text/primary`, amounts included. Grey only for a second line under a name in the same cell (an email under a customer).
- **Names** in tables and list rows stay on one line with an ellipsis.
- **Offerings** show their cover image as a rounded thumbnail before the name (36px in tables, 40px in lists, 8px radius).
- **Tables on mobile** become one bordered card of list items with dividers, 4px apart, pagination below.
- **Every ⋮ has its menu designed**, in tables and in lists, on desktop and mobile.
- **Message the customer:** a Secondary Small icon-only Button (chat icon) next to the customer's name, everywhere a customer is shown.

## Badges and colour

- **Badges are never the brand colour.** "Starts in" is Warning. "Paid by customer", "New" and unread counts are Information.
- **Event types** are neutral soft badges with a coloured dot (Session, Live event).
- **Primary buttons** are teal with a white label. Other brand fills are aubergine.
- **Red error text** uses the same red as the error icon.

## Component details

- **Rich text** (descriptions, notes): `RichTextEditorField` with `onImageUpload` wired to the app's upload (resolve with the https URL) and `onImageUploadError` shown as a toast. Never a custom editor.
- **Celebrations** ("Session published", "New badge earned"): a `Modal` with `<Confetti />` inside the body.
- **Coachli-wide news** (an upcoming Coachli event): `AnnouncementBar` at the very top, event name and date only, a "Register now" `LinkButton`, no close button.
- **Awards:** earned awards use `<Award name="…" />`; not earned yet, `<Award name="…" inactive />`. Never fade with opacity.
- **Price fields:** currency code only in the prefix, no flag. Price and currency are one field.
- **Watch demo video** opens the video in a `Modal` on Coachli, never YouTube in a new tab.
