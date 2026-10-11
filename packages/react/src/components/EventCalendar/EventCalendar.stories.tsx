import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { EventCalendar } from './EventCalendar';
import type { CalendarEvent } from './EventCalendar';

const now = new Date();
const day = (d: number) => new Date(now.getFullYear(), now.getMonth(), d);

const events: CalendarEvent[] = [
  { id: '1', title: 'Release window', start: day(8), end: day(12), color: 'blue' },
  { id: '2', title: 'Design review', start: day(14), color: 'green' },
  { id: '3', title: 'Team offsite', start: day(20), end: day(22), color: 'purple' },
  { id: '4', title: 'Payroll run', start: day(25), color: 'orange' },
  { id: '5', title: 'Quarterly planning', start: day(14), end: day(15), color: 'yellow' },
  { id: '6', title: 'Interviews', start: day(14), color: 'pink' },
  { id: '7', title: 'Board update', start: day(14), color: 'red' },
  { id: '8', title: 'Launch party', start: day(3), color: '#0EA5E9' },
  { id: '9', title: 'Holiday', start: day(28), end: day(29) },
];

const meta = {
  title: 'Components/Event calendar',
  component: EventCalendar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A full-size calendar for planning. The header jumps to any year and month, and a Month and Year switch changes the view. Events over several days run as one bar; a busy day shows "+2 more". Under 600px wide it switches to dots, with the chosen day\'s events listed underneath. Arrow keys move between days. Use `renderDay` to add your own content to each day.',
      },
    },
  },
  args: { events },
} satisfies Meta<typeof EventCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Just the title, arrows and Today. */
export const SimpleHeader: Story = { args: { header: 'simple' } };

/** The twelve months, each with how many events it holds. Pick one to open it. */
export const YearView: Story = { args: { defaultView: 'year' } };

/** On a phone: dots in each day, and the chosen day's events below. */
export const Mobile: Story = {
  render: (args) => (
    <div style={{ width: 375 }}>
      <EventCalendar {...args} />
    </div>
  ),
};

/** Your own content in each day, like room prices. */
export const CustomDays: Story = {
  render: function Render() {
    const [selected, setSelected] = useState<Date | null>(null);
    return (
      <EventCalendar
        header="simple"
        value={selected}
        onValueChange={setSelected}
        renderDay={(d) => {
          const price = 80 + ((d.getDate() * 37) % 60);
          return <span style={{ color: price < 100 ? 'var(--halo-tag-green-text)' : 'var(--halo-text-secondary)' }}>₦{price}k</span>;
        }}
      />
    );
  },
};
