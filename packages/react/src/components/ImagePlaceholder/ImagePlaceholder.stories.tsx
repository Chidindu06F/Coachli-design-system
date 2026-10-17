import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ImagePlaceholder } from './ImagePlaceholder';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { Card } from '../Card';
import { Text } from '../Text';

const meta = {
  title: 'Components/Image placeholder',
  component: ImagePlaceholder,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "The default image Coachli shows when someone hasn't uploaded one: offering and event covers, product images and thumbnails. A grey background with a pattern of coaching and mentorship icons; the small logo version shows the faint Coachli mark. It fills its slot, so give the slot its corner radius. Follows light and dark mode.",
      },
    },
  },
  args: { ratio: '16:9', width: 480 },
} satisfies Meta<typeof ImagePlaceholder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const row: CSSProperties = { display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' };
const label: CSSProperties = { display: 'grid', gap: 8, justifyItems: 'start' };

export const Ratios: Story = {
  render: () => (
    <div style={row}>
      {(
        [
          ['16:9', 400],
          ['4:3', 300],
          ['1:1', 240],
          ['small-pattern', 64],
          ['small-logo', 64],
        ] as const
      ).map(([ratio, width]) => (
        <div key={ratio} style={label}>
          <ImagePlaceholder ratio={ratio} width={width} />
          <Text size="sm" color="secondary">
            {ratio}
          </Text>
        </div>
      ))}
    </div>
  ),
};

const list: CSSProperties = { display: 'grid', gap: 12, width: 320 };
const item: CSSProperties = { display: 'flex', gap: 12, alignItems: 'center' };
const thumb: CSSProperties = { borderRadius: 8 };

export const InUse: Story = {
  name: 'In use',
  render: () => (
    <div style={row}>
      <Card media={<ImagePlaceholder ratio="16:9" label="No cover image" />} style={{ width: 320 }}>
        <div style={{ display: 'grid', gap: 6 }}>
          <Badge dot>Live event</Badge>
          <Text size="lg" weight="semibold">
            Creators conference
          </Text>
          <Text size="sm" color="secondary">
            Sat 18 Oct · 9:30 AM · Google Meet
          </Text>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
            <Text size="lg" weight="semibold">
              USD 25
            </Text>
            <Button size="sm">Register</Button>
          </div>
        </div>
      </Card>
      <div style={list}>
        <Text size="lg" weight="semibold">
          Digital products
        </Text>
        {['Brand strategy workbook', 'Content calendar template', 'Pricing your offer'].map((name, i) => (
          <div key={name} style={item}>
            <ImagePlaceholder ratio={i % 2 ? 'small-pattern' : 'small-logo'} width={48} style={thumb} />
            <div>
              <Text weight="semibold">{name}</Text>
              <Text size="sm" color="secondary">
                {i % 2 ? 'small-pattern' : 'small-logo'}
              </Text>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};
