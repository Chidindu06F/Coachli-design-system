import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Calendar } from './Calendar';
import type { DateRange } from './Calendar';
import { DatePickerField, DateRangePickerField } from './DatePicker';
import { addDays, startOfDay } from './dates';

const today = startOfDay(new Date());

const meta = {
  title: 'Components/Date picker',
  component: DatePickerField,
  subcomponents: { Calendar, DateRangePickerField },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A box that opens a Calendar. In the grid, arrow keys move by day and week, Page Up and Page Down by month (with Shift, by year), and Home and End to the ends of the week. Use `min`, `max` or `isDateDisabled` to block days. The range picker shows two months and applies on Apply.',
      },
    },
  },
  args: { label: 'Due date', hint: 'We will remind you the day before.' },
  decorators: [(Story) => <div style={{ maxWidth: 320, minHeight: 420 }}><Story /></div>],
} satisfies Meta<typeof DatePickerField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Only future weekdays can be picked. */
export const Limits: Story = {
  args: { label: 'Delivery day', min: today, isDateDisabled: (d: Date) => d.getDay() === 0 || d.getDay() === 6, hint: 'Weekdays only' },
};

/** A green border and message once the date is accepted. */
export const Success: Story = {
  args: { label: 'Delivery day', defaultValue: addDays(today, 2), valid: true },
};

/** Two months, presets and Apply. */
export const Range: Story = {
  decorators: [(Story) => <div style={{ minHeight: 480 }}><Story /></div>],
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <DateRangePickerField
        label="Report period"
        presets={[
          { label: 'Last 7 days', range: [addDays(today, -6), today] },
          { label: 'Last 30 days', range: [addDays(today, -29), today] },
          { label: 'Next 7 days', range: [today, addDays(today, 6)] },
        ]}
      />
    </div>
  ),
};

/** The calendar on its own. */
export const CalendarOnly: Story = {
  render: function Render() {
    const [date, setDate] = useState<Date | null>(addDays(today, 3));
    const [range, setRange] = useState<DateRange | null>([addDays(today, 2), addDays(today, 9)]);
    return (
      <div style={{ display: 'grid', gap: 24, justifyItems: 'start' }}>
        <Calendar value={date} onChange={setDate} />
        <Calendar mode="range" months={1} value={range} onChange={setRange} />
      </div>
    );
  },
};
