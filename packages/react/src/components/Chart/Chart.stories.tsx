import type { Meta, StoryObj } from '@storybook/react-vite';
import { AreaChart, LineChart } from './LineChart';
import { BarChart } from './BarChart';
import { PieChart } from './PieChart';
import { Sparkline } from './Sparkline';

const week = [
  { day: 'Mon', thisWeek: 30, lastWeek: 20 },
  { day: 'Tue', thisWeek: 42, lastWeek: 28 },
  { day: 'Wed', thisWeek: 38, lastWeek: 35 },
  { day: 'Thu', thisWeek: 55, lastWeek: 30 },
  { day: 'Fri', thisWeek: 48, lastWeek: 42 },
  { day: 'Sat', thisWeek: 70, lastWeek: 40 },
  { day: 'Sun', thisWeek: 64, lastWeek: 52 },
];

const months = [
  { month: 'Jan', card: 120, transfer: 64, cash: 40 },
  { month: 'Feb', card: 152, transfer: 80, cash: 40 },
  { month: 'Mar', card: 104, transfer: 96, cash: 32 },
  { month: 'Apr', card: 176, transfer: 88, cash: 56 },
  { month: 'May', card: 160, transfer: 104, cash: 48 },
  { month: 'Jun', card: 192, transfer: 112, cash: 64 },
];

const sources = [
  { source: 'Direct', visits: 320 },
  { source: 'Search', visits: 260 },
  { source: 'Social', visits: 180 },
  { source: 'Email', visits: 120 },
  { source: 'Referral', visits: 80 },
];

const meta = {
  title: 'Components/Charts',
  component: LineChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Line, area, bar, pie and sparkline charts drawn with SVG, with no chart library. They fill the width of their container, show fewer labels on narrow screens, and use the `chart/series-1` to `6` and `chart/grid` tokens, so they follow dark mode. Point, hover, tap or focus a chart and use the arrow keys to read values in the tooltip; screen readers get the chart name and a table of the numbers.',
      },
    },
  },
  args: {
    label: 'Visitors this week and last week',
    data: week,
    xKey: 'day',
    series: [
      { key: 'thisWeek', label: 'This week' },
      { key: 'lastWeek', label: 'Last week' },
    ],
  },
  decorators: [(Story) => <div style={{ maxWidth: 640 }}><Story /></div>],
} satisfies Meta<typeof LineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Line: Story = {};

/** A light fill under the line shows volume. */
export const Area: Story = {
  render: () => <AreaChart label="Active users" data={week} xKey="day" series={[{ key: 'thisWeek', label: 'Active users' }]} />,
};

/** Two series side by side. */
export const BarGrouped: Story = {
  render: () => (
    <BarChart
      label="Card and transfer payments by month"
      data={months}
      xKey="month"
      series={[
        { key: 'card', label: 'Card' },
        { key: 'transfer', label: 'Transfer' },
      ]}
      formatValue={(n) => `₦${n}k`}
    />
  ),
};

/** Parts of a total. */
export const BarStacked: Story = {
  render: () => (
    <BarChart
      label="Payments by method each month"
      mode="stacked"
      data={months}
      xKey="month"
      series={[
        { key: 'card', label: 'Card' },
        { key: 'transfer', label: 'Transfer' },
        { key: 'cash', label: 'Cash' },
      ]}
    />
  ),
};

/** Long category names, and the best bar chart for phones. */
export const BarHorizontal: Story = {
  render: () => <BarChart label="Visits by source" orientation="horizontal" data={sources} xKey="source" series={[{ key: 'visits', label: 'Visits' }]} />,
};

/** Donut with a total in the middle. The legend moves under the chart when space is tight. */
export const Donut: Story = {
  render: () => (
    <PieChart
      label="Spending by category"
      centerLabel="Spent"
      formatValue={(n) => `₦${n}k`}
      data={[
        { label: 'Bills', value: 194 },
        { label: 'Food', value: 122 },
        { label: 'Transport', value: 97 },
        { label: 'Shopping', value: 73 },
      ]}
    />
  ),
};

export const Pie: Story = {
  render: () => (
    <PieChart
      label="Payments by method"
      variant="pie"
      data={[
        { label: 'Card', value: 40 },
        { label: 'Transfer', value: 25 },
        { label: 'USSD', value: 20 },
        { label: 'Cash', value: 15 },
      ]}
    />
  ),
};

/** A trend next to a number. */
export const SparklineInCard: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24, fontFamily: 'var(--halo-font-family-body)' }}>
      <div>
        <div style={{ color: 'var(--halo-text-secondary)', fontSize: 14 }}>Earnings this month</div>
        <div style={{ fontSize: 28, fontWeight: 600 }}>₦1,860,000</div>
      </div>
      <Sparkline label="Earnings up 18% over the month" data={[8, 14, 11, 18, 16, 24, 22, 30]} />
    </div>
  ),
};

/** On a phone: fewer axis labels, legend wraps, horizontal bars. */
export const Mobile: Story = {
  render: () => (
    <div style={{ width: 343, display: 'grid', gap: 32 }}>
      <AreaChart label="Active users" data={week} xKey="day" series={[{ key: 'thisWeek', label: 'Active users' }]} height={200} />
      <BarChart label="Visits by source" orientation="horizontal" data={sources} xKey="source" series={[{ key: 'visits', label: 'Visits' }]} />
      <PieChart label="Payments by method" data={[{ label: 'Card', value: 40 }, { label: 'Transfer', value: 25 }, { label: 'USSD', value: 20 }, { label: 'Cash', value: 15 }]} />
    </div>
  ),
};
