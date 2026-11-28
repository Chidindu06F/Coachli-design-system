# Formats

## Money

- **Currency code first, then a space, then the amount:** NGN 10,000, USD 50, GBP 1,250. Codes, not symbols, because coaches sell in many currencies.
- **No `.00`.** Whole amounts have no decimals: NGN 10,000, NGN 0. Show two decimals only when they aren't zero: NGN 10,000.50, USD 0.92.
- **Thousands use commas:** 1,000 and 1,250,000.
- **Pay what you want** shows the minimum with a plus: USD 20+.
- **Free** offerings say Free, not USD 0. Metric cards with no data show the zero: USD 0.
- **Price fields** show the currency code in the prefix, no flag. Currency selects elsewhere show the flag before the code.
- Applies everywhere: tables, cards, totals, fees, buttons, inputs, toasts and emails.

In code:

```ts
new Intl.NumberFormat('en', {
  minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  maximumFractionDigits: 2,
}).format(amount); // then prefix the currency code and a space
```

## Numbers

- Commas for thousands: 1,204 sales.
- Counts in badges and tabs are plain numbers: 5, 12, 99+.
- Percentages have no space: 12%.
- Ratings have one decimal: 4.8.

## Dates and times

| What | Format | Example |
| --- | --- | --- |
| Date in a list or table | Day month year | 26 Nov 2026 |
| Date with weekday (events, sessions) | Weekday day month | Thu 26 Nov |
| Date and time | Weekday day month · time | Sat 18 Oct · 9:30 AM |
| Time | 12-hour with AM/PM | 9:30 AM |
| Time range | Start – end | 9:30 AM – 10:15 AM |
| Relative (notifications, activity) | Short | 2 min ago, Yesterday |
| Countdown badge | Starts in … | Starts in 2 hrs |

- Times show in the coach's (or customer's) time zone. Show the zone when it can be unclear: 9:30 AM WAT.
- Due dates in tables show only the date.

## Durations

- Short units with a space: 45 min, 1 hr, 1 hr 30 min, 3 days.

## People and places

- Full name in tables and details; first name in greetings.
- Initials in avatars: two letters, first and last name (JD).
- Locations: the platform name (Google Meet, Zoom, Coachli video) or the city for physical events.

## Separators

- Use a middle dot with spaces between pieces of meta information: 45 min · One-off session · Zoom.
