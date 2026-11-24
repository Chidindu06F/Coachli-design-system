import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CaretDown, Copy, DownloadSimple, Minus, Plus, ShareNetwork, TextAlignCenter, TextAlignJustify, TextAlignLeft, TextAlignRight } from '@phosphor-icons/react';
import { Button } from '../Button';
import type { ButtonSize } from '../Button';
import { Text } from '../Text';
import { Tooltip } from '../Tooltip';
import { ButtonGroup } from './ButtonGroup';

const sizes: ButtonSize[] = ['xs', 'sm', 'md', 'lg'];
const stack: CSSProperties = { display: 'grid', gap: 20, justifyItems: 'start' };
const card: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 12,
  width: 380,
  padding: 24,
  borderRadius: 16,
  border: '1px solid var(--halo-border-secondary)',
  background: 'var(--halo-surface-primary)',
};

const meta = {
  title: 'Components/Button group',
  component: ButtonGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A row of joined buttons for related actions, shown as one control. Pass `Button` elements as children: they become Secondary buttons in the group\'s `size`, with rounded outer ends and shared dividers. Give the group an `aria-label` so screen readers know what it is for.\n\nTo pick one option from a set, like Day, Week or Month, use a Segmented control instead.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: sizes, table: { type: { summary: sizes.map((s) => `'${s}'`).join(' | ') } } },
    children: { control: false },
  },
  args: {
    size: 'md',
    'aria-label': 'File actions',
    children: [
      <Button key="copy">Copy</Button>,
      <Button key="share">Share</Button>,
      <Button key="download">Download</Button>,
    ],
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Try every option with the controls below. Tab through the items to see the focus ring. */
export const Playground: Story = {};

/** XS 28, S 32, M 40 and L 48, matching Button. */
export const Sizes: Story = {
  render: () => (
    <div style={stack}>
      {sizes.map((s) => (
        <ButtonGroup key={s} size={s} aria-label="File actions">
          <Button>Copy</Button>
          <Button>Share</Button>
          <Button>Download</Button>
        </ButtonGroup>
      ))}
    </div>
  ),
};

/** Text with icons, icon-only, and mixed. Icon-only items need an aria-label; a Tooltip shows it to everyone. */
export const WithIcons: Story = {
  name: 'With icons',
  render: () => (
    <div style={stack}>
      <ButtonGroup aria-label="File actions">
        <Button iconLeft={<Copy />}>Copy</Button>
        <Button iconLeft={<ShareNetwork />}>Share</Button>
        <Button iconLeft={<DownloadSimple />}>Download</Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Text alignment">
        {[
          ['Align left', <TextAlignLeft key="l" />],
          ['Align centre', <TextAlignCenter key="c" />],
          ['Align right', <TextAlignRight key="r" />],
          ['Justify', <TextAlignJustify key="j" />],
        ].map(([label, icon]) => (
          <Button key={String(label)} iconOnly aria-label={String(label)}>{icon}</Button>
        ))}
      </ButtonGroup>
      <ButtonGroup aria-label="Zoom">
        <Button iconOnly aria-label="Zoom out"><Minus /></Button>
        <Button>100%</Button>
        <Button iconOnly aria-label="Zoom in"><Plus /></Button>
      </ButtonGroup>
    </div>
  ),
};

/** A disabled item keeps its borders, so the group still reads as one control. */
export const Disabled: Story = {
  render: () => (
    <ButtonGroup aria-label="Edit">
      <Button>Undo</Button>
      <Button disabled>Redo</Button>
      <Button>Clear</Button>
    </ButtonGroup>
  ),
};

/** File actions, a split button and a zoom control, built from Coachli components. */
export const InUse: Story = {
  name: 'In use',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' }}>
      <div style={card}>
        <Text weight="semibold">Brand guidelines.pdf</Text>
        <Text size="sm" color="secondary">2.4 MB · Updated today</Text>
        <ButtonGroup size="sm" aria-label="File actions">
          <Button iconLeft={<Copy />}>Copy</Button>
          <Button iconLeft={<ShareNetwork />}>Share</Button>
          <Button iconLeft={<DownloadSimple />}>Download</Button>
        </ButtonGroup>
      </div>

      <div style={card}>
        <Text size="lg" weight="semibold">Quarterly report</Text>
        <Text color="secondary">Draft saved 2 minutes ago.</Text>
        <ButtonGroup aria-label="Save">
          <Button>Save</Button>
          <Tooltip content="More save options">
            <Button iconOnly aria-label="More save options"><CaretDown /></Button>
          </Tooltip>
        </ButtonGroup>
      </div>

      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, alignSelf: 'stretch' }}>
          <Text size="lg" weight="semibold" style={{ flex: 1 }}>Canvas</Text>
          <ButtonGroup size="sm" aria-label="Zoom">
            <Tooltip content="Zoom out"><Button iconOnly aria-label="Zoom out"><Minus /></Button></Tooltip>
            <Button>100%</Button>
            <Tooltip content="Zoom in"><Button iconOnly aria-label="Zoom in"><Plus /></Button></Tooltip>
          </ButtonGroup>
        </div>
        <Text color="secondary">Zoom out, reset to 100% or zoom in. Each item is its own button.</Text>
      </div>
    </div>
  ),
};
