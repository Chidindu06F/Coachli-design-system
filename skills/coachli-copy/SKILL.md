---
name: coachli-copy
description: Write or check any text in the Coachli product - button labels, titles, field labels, placeholders, helper text, errors, toasts, empty states, confirm dialogs, menus, emails - and format money, numbers, dates, times and durations the Coachli way. Use whenever you add or change words a Coachli user will read, in code or in Figma, or display an amount or a date.
---

# Coachli copy

Coachli copy is short, plain and easy to scan. Say what the person needs in one line, then stop. It should read like a designer wrote it.

Read the full guides before writing:

- `${CLAUDE_PLUGIN_ROOT}/guidelines/copy.md`
- `${CLAUDE_PLUGIN_ROOT}/guidelines/formats.md`

If those paths don't exist, read them at https://github.com/Chidindu06F/Coachli-design-system/tree/main/guidelines.

## Voice

- Plain words, the way you'd say it to a coach sitting next to you.
- One line; two at most for helper text, descriptions and empty states.
- Talk to the person ("Your payout is on its way"), in the active voice.
- No filler: please, simply, just, successfully, in order to.
- No exclamation marks, jokes in errors or ALL CAPS.
- Sentence case everywhere we write (titles, buttons, tabs, menus, labels, badges, toasts): capitalise only the first word and proper nouns (Coachli, Google Meet, WhatsApp). Feature names are not proper nouns: "Create a one-off session". Never title case or all caps. Text the coach or customer typed (offering names, event titles) stays as they wrote it.
- No helper line that repeats the label.

## By element

| Element | Rule | Example |
| --- | --- | --- |
| Button | Verb, 1–3 words | Publish, Reschedule, Save as draft |
| Placeholder | Sample answer starting "e.g." | e.g. Career clarity session |
| Error | The problem, then the fix if not obvious. Full stop. No examples | Enter a valid link. |
| Toast | What happened, past tense, title only | Link copied |
| Empty state | Title + one line + one button | No invoices yet / Send your first invoice and get paid faster. / Create invoice |
| Confirm | Question title; what happens; button repeats the verb | Delete this discount? / Customers can no longer use this code. / Delete |

## Words

One-off session and Session bundle (never "1:1 session" for the single kind), Live event, Customer (not client), Coach (not creator). Sample people: John Doe, johndoe@email.com. Never a real person's name, never Lorem ipsum.

## Formats

- Money: `NGN 10,000`, `USD 50`, `USD 10,000.50`. Code, space, amount. Never `.00`, never symbols. Pay what you want: `USD 20+`.
- Dates: `26 Nov 2026` in tables; `Thu 26 Nov` for events; `Sat 18 Oct · 9:30 AM` with a time.
- Times: `9:30 AM`; ranges `9:30 AM – 10:15 AM`.
- Durations: `45 min`, `1 hr 30 min`.
- Meta information is separated with ` · `.

```ts
const amount = (code: string, value: number) =>
  `${code} ${new Intl.NumberFormat('en', {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value)}`;
```

When the design has copy, use it exactly. Only write new copy for gaps, and say so, so the designer can review it.
