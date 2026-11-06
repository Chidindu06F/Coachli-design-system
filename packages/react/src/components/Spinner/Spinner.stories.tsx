import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { LoadingIndicator, Spinner } from './Spinner';
import type { SpinnerSize } from './Spinner';

const sizes: SpinnerSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  subcomponents: { LoadingIndicator },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A spinning ring for short waits, like saving or sending. It is announced as "Loading" (change it with `label`). Use `LoadingIndicator` to show a visible label too. When you know the layout of what is coming, use a Skeleton instead.',
      },
    },
  },
  args: { size: 'md', color: 'brand' },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Five sizes, from inside a small Button to a whole page. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      {sizes.map((s) => <Spinner key={s} size={s} />)}
    </div>
  ),
};

/** onBrand on a primary Button, neutral for quieter places. */
export const InButtons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Button iconLeft={<Spinner size="sm" color="onBrand" label="" />} disabled={false}>Saving…</Button>
      <Button variant="secondary" iconLeft={<Spinner size="sm" color="neutral" label="" />}>Loading</Button>
    </div>
  ),
};

/** A spinner with a visible label. */
export const WithLabel: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 48, alignItems: 'center' }}>
      <LoadingIndicator>Loading more…</LoadingIndicator>
      <LoadingIndicator layout="stacked">Loading your files…</LoadingIndicator>
    </div>
  ),
};
