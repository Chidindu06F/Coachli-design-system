import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DatePickerField } from '../DatePicker';
import { TimePicker, TimePickerField } from './TimePicker';

const meta = {
  title: 'Components/Time picker',
  component: TimePickerField,
  subcomponents: { TimePicker },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A Select with a clock icon and a list of times. The value is always "HH:mm" in 24 hours, like a native time input, whatever `hourCycle` shows. Use `step` for the minutes between options and `min` and `max` to limit the day. Typing a number jumps to that hour.',
      },
    },
  },
  args: { label: 'Start time', hint: 'Times are in your time zone.' },
  decorators: [(Story) => <div style={{ maxWidth: 320, minHeight: 360 }}><Story /></div>],
} satisfies Meta<typeof TimePickerField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Small, Medium and Large, as in Figma. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <TimePickerField label="Small" size="sm" defaultValue="09:00" />
      <TimePickerField label="Medium" size="md" defaultValue="09:00" />
      <TimePickerField label="Large" size="lg" defaultValue="09:00" />
    </div>
  ),
};

/** Office hours every 15 minutes, in 24-hour time. */
export const Limits: Story = {
  args: { label: 'Meeting time', step: 15, hourCycle: 24, min: '08:00', max: '18:00', defaultValue: '14:15' },
};

export const Error: Story = {
  args: { label: 'Pickup time', error: 'Choose a time to continue.' },
};


export const Disabled: Story = {
  args: { label: 'Start time', disabled: true, defaultValue: '10:30' },
};

/** A Date picker and a Time picker side by side for one moment. */
export const DateAndTime: Story = {
  decorators: [(Story) => <div style={{ minHeight: 420 }}><Story /></div>],
  render: function Render() {
    const [time, setTime] = useState('09:30');
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px', gap: 12, maxWidth: 420 }}>
        <DatePickerField label="Date" />
        <TimePickerField label="Time" value={time} onValueChange={setTime} />
      </div>
    );
  },
};
