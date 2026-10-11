import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DatePickerField, DateRangePickerField, MultiDatePickerField } from './DatePicker';
import { addDays, startOfDay } from './dates';

const today = startOfDay(new Date());

const meta = {
  title: 'Components/Date picker',
  component: DatePickerField,
  subcomponents: { DateRangePickerField, MultiDatePickerField },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Boxes for picking dates in a form. Each opens a Calendar (see Calendar). Pick one day, a range from a start to an end day, or several separate days that show as tags. Use `min`, `max` or `isDateDisabled` to block days, and `calendarHeader="picker"` to jump to any month and year from the calendar title.',
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

/** Click the month name in the calendar to jump straight to a month and year far away, like a date of birth. */
export const JumpToMonthAndYear: Story = {
  args: { label: 'Date of birth', calendarHeader: 'picker', max: today, defaultValue: new Date(1994, 4, 12) },
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

/** Several separate days, shown as tags. Each click in the calendar adds or removes a day; the ✕ on a tag removes it, and so does Backspace. */
export const MultipleDates: Story = {
  render: function Render() {
    const [dates, setDates] = useState<Date[]>([addDays(today, 2), addDays(today, 5), addDays(today, 9)]);
    return (
      <div style={{ maxWidth: 360 }}>
        <MultiDatePickerField label="Days off" hint="Pick up to 5 days." maxCount={5} min={today} value={dates} onValueChange={setDates} />
      </div>
    );
  },
};
