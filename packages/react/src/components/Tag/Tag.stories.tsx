import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Hash } from '@phosphor-icons/react';
import { Avatar } from '../Avatar';
import { ColorSwatch } from '../ColorPicker';
import { Tag, TAG_COLORS } from './Tag';

const meta = {
  title: 'Components/Tag',
  component: Tag,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A small label for a chosen value, a filter or a person. Pass `onRemove` to show a remove button. Use a Badge for read-only status instead.',
      },
    },
  },
  args: { children: 'Design', size: 'md' },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Sizes, with an icon, an avatar and disabled. */
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <Tag size="sm">Small</Tag>
        <Tag>Medium</Tag>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Tag icon={<Hash />}>research</Tag>
        <Tag avatar={<Avatar size="xs" name="Ada Obi" color="purple" />}>Ada Obi</Tag>
        <Tag disabled onRemove={() => {}}>Disabled</Tag>
      </div>
    </div>
  ),
};

/** The preset colours. Neutral is the default. */
export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, maxWidth: 420 }}>
      {TAG_COLORS.map((c) => (
        <Tag key={c} color={c} onRemove={() => {}}>{c[0]!.toUpperCase() + c.slice(1)}</Tag>
      ))}
    </div>
  ),
};

/** Any CSS colour works, so people can pick their own tag colours. */
export const CustomColor: Story = {
  render: function Render() {
    const swatches = ['#7C3AED', '#0EA5E9', '#14B8A6', '#84CC16', '#F59E0B', '#EF4444', '#EC4899', '#64748B'];
    const [color, setColor] = useState(swatches[0]!);
    return (
      <div style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
        <Tag color={color} icon={<Hash />}>launch-week</Tag>
        <div role="radiogroup" aria-label="Tag colour" style={{ display: 'flex', gap: 8 }}>
          {swatches.map((s) => (
            <ColorSwatch key={s} color={s} shape="circle" role="radio" aria-checked={s === color} aria-label={s} selected={s === color} onClick={() => setColor(s)} />
          ))}
        </div>
      </div>
    );
  },
};

/** Remove tags one by one. */
export const Removable: Story = {
  render: function Render() {
    const [tags, setTags] = useState(['Design', 'Research', 'Writing', 'Strategy']);
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, maxWidth: 320 }}>
        {tags.map((t) => (
          <Tag key={t} onRemove={() => setTags(tags.filter((x) => x !== t))}>{t}</Tag>
        ))}
      </div>
    );
  },
};
