import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stepper } from './Stepper';

const steps = [
  { title: 'Account', description: 'Name and email' },
  { title: 'Profile', description: 'Photo and bio' },
  { title: 'Billing', description: 'Plan and card' },
  { title: 'Review', description: 'Check and confirm' },
];

const meta = {
  title: 'Components/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Shows progress through a task with several steps. Earlier steps show as complete, the current one has `aria-current="step"`, and a step with `error` shows a red mark. Use `compact` on small screens.',
      },
    },
  },
  args: { steps, current: 1, orientation: 'horizontal' },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Down the side of a form. */
export const Vertical: Story = { args: { orientation: 'vertical' }, decorators: [(Story) => <div style={{ maxWidth: 320 }}><Story /></div>] };

/** A step that needs fixing. */
export const WithError: Story = { args: { current: 2, steps: steps.map((s, i) => (i === 1 ? { ...s, error: true, description: 'Add a photo' } : s)) } };

/** A title and a segmented bar for small screens. */
export const Compact: Story = { args: { orientation: 'compact' }, decorators: [(Story) => <div style={{ maxWidth: 360 }}><Story /></div>] };

/**
 * A horizontal stepper switches to compact by itself when it has less than 600px, like on a phone or in a narrow panel.
 * This one sits in a 360px box. Set `compactBelow` to change the width, or `false` to turn it off.
 */
export const SwitchesOnSmallScreens: Story = { decorators: [(Story) => <div style={{ width: 360 }}><Story /></div>] };
