import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Confetti } from './Confetti';

const meta = {
  title: 'Components/Confetti',
  component: Confetti,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A short burst of confetti for moments worth celebrating, like "Session published" or "New badge earned". Put it inside a positioned parent (`position: relative`), such as a Modal body: it fills the parent, is clipped at its edge and never blocks clicks. It plays once when it mounts, and again each time `active` turns true. People who ask for reduced motion see no confetti.',
      },
    },
  },
  args: { pieces: 40, duration: 2400 },
} satisfies Meta<typeof Confetti>;

export default meta;
type Story = StoryObj<typeof meta>;

const box = {
  position: 'relative',
  width: 480,
  height: 320,
  borderRadius: 16,
  border: '1px solid var(--halo-border-secondary)',
  background: 'var(--halo-surface-primary)',
  display: 'grid',
  placeItems: 'center',
} as const;

/** Press the button to play it again. */
export const Playground: Story = {
  render: (args) => {
    const [run, setRun] = useState(0);
    return (
      <div style={box}>
        <Confetti key={run} {...args} />
        <Button variant="secondary" onClick={() => setRun((n) => n + 1)}>Play again</Button>
      </div>
    );
  },
};

/** Controlled: `active` starts the burst and `onDone` tells you when it has finished. */
export const Controlled: Story = {
  render: (args) => {
    const [active, setActive] = useState(false);
    return (
      <div style={box}>
        <Confetti {...args} active={active} onDone={() => setActive(false)} />
        <Button onClick={() => setActive(true)} disabled={active}>Publish session</Button>
      </div>
    );
  },
};
