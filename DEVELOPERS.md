# Building the Coachli dashboard

A guide for developers rebuilding the Coachli dashboard with this design system.

## What you get

| | Where |
| --- | --- |
| Components and tokens | `@chidindu06f/coachli-react` and `@chidindu06f/coachli-tokens` (install steps in the [README](README.md)) |
| Live component docs | Storybook: https://chidindu06f.github.io/Coachli-design-system/ |
| Screens to build | Figma: [Coachli](https://www.figma.com/design/toCoFh482t5Ho9OU7it9lA/Coachli), one page per menu item. Each page has grey sections per context, with black labels above each screen |
| Component specs | Figma: [COACHLI DESIGN SYSTEM](https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM). Dev Mode shows the matching React code |

## Setup

```tsx
// main.tsx: once, at the top of the app
import '@chidindu06f/coachli-tokens/css';
import '@chidindu06f/coachli-react/styles.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
```

- **Themes:** set `data-theme="light" | "dark" | "system"` on `<html>`. Every component switches by itself.
- **Your own CSS:** use the tokens (`var(--halo-text-secondary)`, `var(--halo-spacing-md)`), never hex values, or dark mode breaks.
- **Breakpoints:** `--halo-grid-*` tokens change at 600px (tablet), 1024px (desktop) and 1440px (wide).

## How a screen maps to code

Read a screen from its Figma layers: almost everything is a library component instance whose name matches the React component.

| In Figma | In code |
| --- | --- |
| Sidebar (Layout=Expanded / Collapsed) | `<Sidebar header={logo} beforeFooter={roleSwitch} footer={…} collapsed>` with `NavItem` children |
| Sidebar *Show footer* | `beforeFooter`: the Coach / Customer role switch (a `SegmentedControl`) |
| Sidebar *Show report a bug* / *Show log out* | `NavItem`s in `footer`, below What's new and Help and resources |
| Text component (Size, Weight, Colour) | `Text` |
| Card, List, List item, Badge, Tag, Tabs, Table cells | Components with the same names |
| Modal / Drawer inside an Overlay | `Modal` / `Drawer` (they bring their own overlay) |
| Toast | `useToast()` inside a `<ToastProvider>` at the app root |
| Tour step | `Tour` |
| Plain frames | Layout only: flex/grid using the spacing tokens |

## Coachli-only pieces (build these in the dashboard app)

These live on the **Components** page of the Coachli Figma file, not in the design system. Build them in the app from design-system parts:

| Piece | Built from | Behaviour |
| --- | --- | --- |
| Setup checklist | Card, ProgressBar, List, Button (secondary) | 5 tasks (photo, first offering, calendar, bank, KYC). Collapsible, can't be dismissed, and hides itself when everything is done. Has Desktop and Mobile layouts |
| Notifications | Popover (no arrow, soft shadow) + Tabs (All / Unread) + List | Unread items have a dot and a bold title, and the bell shows a red count badge. "Mark all as read". Covers bookings, payouts, orders and reviews |
| Account menu | Avatar trigger + Popover | Name with a "view profile" icon, a pencil "edit" badge on the avatar, public link with copy ("Link copied" tooltip), share to WhatsApp, X, Facebook, LinkedIn and Gmail |
| Create menu | Button + Menu | One flat list: 1:1 session, Session bundle, Live event, Digital product, Subscription, Service, Invoice, Discount, Email automation. Each item has a 20px glossy 3D illustration (the **Create icon** component; export the PNGs from Figma Dev Mode). Course is ready for later |
| Create session button | Button + Menu | Empty Sessions tab: 1:1 session or Session bundle |
| Nav group / Nav flyout | NavItem + Menu | Sidebar groups expand in place. In the collapsed sidebar, a flyout menu opens beside the icon |
| Attendee stack | Avatar group + Tooltip | Spreads out on hover, with a name tooltip on each avatar |
| Time zone picker | Modal (desktop) / bottom Drawer (mobile) + Switch field + Combobox | "Set automatically" uses the device time zone and disables the combobox |
| Report a bug | Modal / bottom Drawer + Input, Textarea, File upload | Validation: description required, file 10 MB maximum |

## Product rules (from design reviews)

- **Toasts:** title only (for example "Bug report sent", "Time zone updated"), shown at the **top centre**. No body text unless a design shows one.
- **Dropdowns and popovers:** no arrow, soft shadow (`--halo-shadow-soft`).
- **Empty states:** illustration, title, one line and a single Create button with a dropdown. Top customers and Top offerings have no button.
- **Event types:** neutral soft badges with a coloured dot (Session, Live event). 1:1 sessions and bundles are both "Session"; a bundle shows "Session 2 of 4" in its details.
- **Service orders:** statuses are Completed, Dispute opened, Delivered, Refunded and Cancelled.
- **Offerings in tables and lists:** show the offering's **cover image** as a rounded thumbnail before its name (36px in tables, 40px in lists, 8px radius), not a type icon. In tables, use a `TableCell` with custom content.
- **Missing images:** wherever a coach hasn't uploaded an image (offering or event cover, product image, thumbnail), show `<ImagePlaceholder>` with the closest `ratio`. Use `small-pattern` or `small-logo` under about 80px. Never leave an empty box.
- **Product tour:** 7 steps with the `Tour` component: setup checklist, Create, time zone, notifications, public profile, Help (desktop) or Menu (mobile), Report a bug. It starts on first login; Skip or Done ends it.

## Mobile (390 px designs)

- **No bottom navigation.** The top bar has a menu button on the left, then Create, the bell and the avatar. It stays fixed while the page scrolls.
- The menu opens a **left Drawer** with the logo, the full navigation (groups expand in place), the role switch, What's new, Help, Report a bug and Log out.
- Notifications, Create, Account, Time zone and Report a bug open as **bottom Drawers** (sheets). Long forms scroll, and their buttons stay pinned at the bottom.
- The Top offerings table becomes a list. Event rows drop the View button and keep the ⋮ menu.

## When the design system changes

You'll get a new version of the packages and a CHANGELOG entry. Update with:

```bash
npm install @chidindu06f/coachli-react@latest @chidindu06f/coachli-tokens@latest
```

Token changes (colours, fonts) need no code changes on your side. Component changes are described in the CHANGELOG.
