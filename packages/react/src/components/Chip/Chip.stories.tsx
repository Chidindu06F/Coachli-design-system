import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Chip } from './Chip';

const meta = {
  title: 'Components/Chip',
  component: Chip,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A choice the user switches on and off, like an interest or a filter. Selected chips get a light brand fill, a brand border and a check, so they never look like the primary button. Use several in a wrapping row.',
      },
    },
  },
  args: { children: 'Career coach', size: 'md', selected: false },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => {
    const [on, setOn] = useState(args.selected);
    return <Chip {...args} selected={on} onSelectedChange={setOn} />;
  },
};

/** Off, on and disabled, in both sizes. */
export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      {(['sm', 'md'] as const).map((s) => (
        <div key={s} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Chip size={s}>Career coach</Chip>
          <Chip size={s} selected>Career coach</Chip>
          <Chip size={s} disabled>Career coach</Chip>
          <Chip size={s} selected disabled>Career coach</Chip>
        </div>
      ))}
    </div>
  ),
};

const interests = ['Brand strategist', 'Career coach', 'Designer', 'Developer', 'Content creator', 'UX designer', 'Finance expert', 'Lifestyle coach', 'Photographer', 'Business coach', 'Public speaker', 'Other'];

/** Pick up to 3, as in onboarding. The others stay enabled; a fourth tap shows a note instead. */
export const PickUpToThree: Story = {
  render: () => {
    const [picked, setPicked] = useState<string[]>(['Career coach']);
    const [note, setNote] = useState(false);
    return (
      <div style={{ display: 'grid', gap: 12, maxWidth: 520 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {interests.map((i) => (
            <Chip
              key={i}
              selected={picked.includes(i)}
              onSelectedChange={(on) => {
                setPicked((prev) => {
                  if (on && prev.length >= 3) { setNote(true); return prev; }
                  setNote(false);
                  return on ? [...prev, i] : prev.filter((p) => p !== i);
                });
              }}
            >
              {i}
            </Chip>
          ))}
        </div>
        <span style={{ fontSize: 12, color: 'var(--halo-text-secondary)' }}>{note ? 'You can choose up to 3. Remove one to pick another.' : `${picked.length} of 3 selected`}</span>
      </div>
    );
  },
};
