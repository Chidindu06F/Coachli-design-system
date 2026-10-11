import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Calendar } from './Calendar';
import type { DateRange } from './Calendar';
import { addDays, startOfDay } from './dates';

const today = startOfDay(new Date());

const meta = {
  title: 'Components/Calendar/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A month grid for picking dates, used inside the Date pickers or on its own. Pick one day, a range, or several separate days. Arrow keys move by day and week, Page Up and Page Down by month (with Shift, by year), Home and End to the ends of the week. For a full-page planner with events, use Event calendar.',
      },
    },
  },
  args: { value: today, onChange: () => {} },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One day. */
export const Single: Story = {
  render: function Render() {
    const [date, setDate] = useState<Date | null>(addDays(today, 3));
    return <Calendar value={date} onChange={setDate} />;
  },
};

/** Month and year menus to jump straight to any month. */
export const WithMenus: Story = {
  render: function Render() {
    const [d, setD] = useState<Date | null>(today);
    return <Calendar value={d} onChange={setD} header="select" style={{ width: 320 }} />;
  },
};

/** A start and an end day. */
export const Range: Story = {
  render: function Render() {
    const [range, setRange] = useState<DateRange | null>([addDays(today, 2), addDays(today, 9)]);
    return <Calendar mode="range" months={1} value={range} onChange={setRange} />;
  },
};

/** Several separate days. Each click adds or removes one. */
export const Multiple: Story = {
  render: function Render() {
    const [dates, setDates] = useState<Date[]>([addDays(today, 1), addDays(today, 4), addDays(today, 8)]);
    return <Calendar mode="multiple" value={dates} onChange={setDates} />;
  },
};
