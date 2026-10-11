import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bell, MagnifyingGlass, Plus } from '@phosphor-icons/react';
import { Button } from '../Button';
import { Input } from '../Input';
import { Text } from '../Text';
import { Tour } from './Tour';
import type { TourStep } from './Tour';

const steps: TourStep[] = [
  {
    title: 'Welcome to your workspace',
    description: 'A quick look around. It takes under a minute, and you can skip it at any time.',
    media: <img src="cards/waves.jpg" alt="" width={340} height={150} style={{ objectFit: 'cover' }} />,
  },
  { target: '#tour-search', title: 'Find anything', description: 'Search projects, people and files from here. Press / to jump to it.', side: 'bottom' },
  { target: '#tour-new', title: 'Start something new', description: 'Create a project, a task or a document.', side: 'bottom', align: 'end' },
  { target: '#tour-alerts', title: 'Stay in the loop', description: 'Mentions and updates land here.', side: 'left' },
  { title: 'You are all set', description: 'Find this tour again under Help whenever you need it.' },
];

function Screen({ onStart }: { onStart: () => void }) {
  return (
    <div style={{ display: 'grid', gap: 24, maxWidth: 880 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, border: '1px solid var(--halo-border-secondary)', borderRadius: 16 }}>
        <div id="tour-search" style={{ flex: 1, maxWidth: 360 }}>
          <Input iconLeft={<MagnifyingGlass />} placeholder="Search" aria-label="Search" />
        </div>
        <span style={{ flex: 1 }} />
        <span id="tour-alerts">
          <Button variant="secondary" iconOnly aria-label="Notifications">
            <Bell />
          </Button>
        </span>
        <span id="tour-new">
          <Button iconLeft={<Plus />}>New</Button>
        </span>
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        <Text size="lg" weight="semibold">Projects</Text>
        <Text color="secondary">Nothing here yet.</Text>
        <div>
          <Button variant="secondary" onClick={onStart}>Start the tour</Button>
        </div>
      </div>
    </div>
  );
}

const meta = {
  title: 'Components/Tour',
  component: Tour,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      story: { inline: false, height: '520px' },
      description: {
        component:
          'Walks new people through a screen one step at a time. Each step points at part of the page, like a Popover, and adds Back, Next and Skip, a step counter and a spotlight that dims everything else. Steps without a `target` sit in the middle, for a welcome or a wrap-up. Arrow keys move between steps and Escape skips. Save `onFinish` and `onSkip` so the tour only shows once.',
      },
    },
  },
  args: { steps },
} satisfies Meta<typeof Tour>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A welcome, three steps on the page, and a wrap-up. */
export const Default: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(true);
    return (
      <>
        <Screen onStart={() => setOpen(true)} />
        <Tour {...args} open={open} onOpenChange={setOpen} />
      </>
    );
  },
};

/** Dots instead of "2 of 5", and no spotlight. */
export const DotsNoSpotlight: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(true);
    return (
      <>
        <Screen onStart={() => setOpen(true)} />
        <Tour {...args} steps={steps.slice(1, 4)} progress="dots" spotlight={false} open={open} onOpenChange={setOpen} />
      </>
    );
  },
};
