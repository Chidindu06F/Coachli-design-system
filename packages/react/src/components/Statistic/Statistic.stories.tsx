import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CurrencyDollar, Users } from '@phosphor-icons/react';
import { Card } from '../Card';
import { Statistic } from './Statistic';

const meta = {
  title: 'Components/Statistic',
  component: Statistic,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A key number with its label and how it changed, like the numbers across the top of a dashboard. Put it in a `Card`, or use it on its own in a row. `trend` picks the arrow and `sentiment` the colour: up is green and down is red by default, so set `sentiment` when that is reversed, like churn going up.',
      },
    },
  },
  args: {
    label: 'Active users',
    value: 12480,
    change: '+12.4%',
    trend: 'up',
    comparison: 'vs last month',
    size: 'md',
  },
} satisfies Meta<typeof Statistic>;

export default meta;
type Story = StoryObj<typeof meta>;

const row: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(180px, 1fr))', gap: 24 };

export const Playground: Story = {};

/** In cards, the usual dashboard row. */
export const InCards: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div style={row}>
      <Card><Statistic label="Active users" value={12480} change="+12.4%" trend="up" comparison="vs last month" /></Card>
      <Card><Statistic label="New sign-ups" value={1284} change="+8.1%" trend="up" comparison="vs last month" /></Card>
      <Card><Statistic label="Churn rate" value={2.3} precision={1} suffix="%" change="-0.4%" trend="down" sentiment="positive" comparison="vs last month" /></Card>
      <Card><Statistic label="Monthly revenue" value={48920} prefix="$" change="+5.6%" trend="up" comparison="vs last month" /></Card>
    </div>
  ),
};

/** Small for dense panels, Medium for most dashboards, Large for a single headline number. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }}>
      <Statistic size="sm" label="Small" value={12480} change="+12.4%" trend="up" comparison="vs last month" />
      <Statistic size="md" label="Medium" value={12480} change="+12.4%" trend="up" comparison="vs last month" />
      <Statistic size="lg" label="Large" value={12480} change="+12.4%" trend="up" comparison="vs last month" />
    </div>
  ),
};

/** Up, down and no change. Churn going down is good news, so it uses `sentiment="positive"`. */
export const Trends: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 48 }}>
      <Statistic label="Revenue" value={48920} prefix="$" change="+5.6%" trend="up" comparison="vs last month" />
      <Statistic label="Orders" value={312} change="-3.2%" trend="down" comparison="vs last month" />
      <Statistic label="Churn rate" value={2.3} precision={1} suffix="%" change="-0.4%" trend="down" sentiment="positive" comparison="vs last month" />
      <Statistic label="Seats" value={24} change="0%" trend="flat" comparison="vs last month" />
    </div>
  ),
};

/** Prefix, suffix and an icon before the label. */
export const PrefixSuffixAndIcon: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 48 }}>
      <Statistic icon={<CurrencyDollar />} label="Payroll this month" value={126500} prefix="₦" />
      <Statistic icon={<Users />} label="Team plan" value={8} prefix="$" suffix="/ member a month" />
    </div>
  ),
};

/** While the number loads. */
export const Loading: Story = {
  args: { loading: true },
};
