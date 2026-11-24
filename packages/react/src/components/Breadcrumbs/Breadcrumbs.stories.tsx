import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FilePng, FileSvg, FolderSimple, House } from '@phosphor-icons/react';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { Text } from '../Text';
import { BreadcrumbItem, Breadcrumbs } from './Breadcrumbs';
import type { BreadcrumbsSeparator, BreadcrumbsSize } from './Breadcrumbs';

const sizes: BreadcrumbsSize[] = ['sm', 'md'];
const separators: BreadcrumbsSeparator[] = ['slash', 'caret'];

const stack: CSSProperties = { display: 'grid', gap: 20 };
const card: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  width: 380,
  padding: 24,
  borderRadius: 16,
  border: '1px solid var(--halo-border-secondary)',
  background: 'var(--halo-surface-primary)',
};
const line: CSSProperties = { display: 'flex', alignItems: 'center', gap: 10 };

const meta = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  subcomponents: { BreadcrumbItem },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A trail of links that shows where a page sits. Pass one `BreadcrumbItem` per level, from the top down: every item with an `href` is a link, and the last item is the current page. When there are more levels than `maxItems`, the middle ones collapse into a "…" button that shows them again.\n\nLinks darken and underline on hover and keyboard focus.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: sizes, table: { type: { summary: sizes.map((s) => `'${s}'`).join(' | ') } } },
    separator: { control: 'inline-radio', options: separators, table: { type: { summary: separators.map((s) => `'${s}'`).join(' | ') } } },
    maxItems: { control: { type: 'number', min: 2, max: 8 } },
    children: { control: false },
  },
  args: {
    size: 'md',
    separator: 'slash',
    maxItems: 4,
    children: [
      <BreadcrumbItem key="home" href="#" icon={<House />}>Home</BreadcrumbItem>,
      <BreadcrumbItem key="projects" href="#">Projects</BreadcrumbItem>,
      <BreadcrumbItem key="settings">Settings</BreadcrumbItem>,
    ],
  },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Try every option with the controls below. */
export const Playground: Story = {};

/** S for dense layouts, M for most pages. */
export const Sizes: Story = {
  render: () => (
    <div style={stack}>
      {sizes.map((s) => (
        <Breadcrumbs key={s} size={s}>
          <BreadcrumbItem href="#" icon={<House />}>Home</BreadcrumbItem>
          <BreadcrumbItem href="#">Projects</BreadcrumbItem>
          <BreadcrumbItem>Settings</BreadcrumbItem>
        </Breadcrumbs>
      ))}
    </div>
  ),
};

/** Slash or caret. Pick one and use it everywhere. */
export const Separators: Story = {
  render: () => (
    <div style={stack}>
      {separators.map((sep) => (
        <Breadcrumbs key={sep} separator={sep}>
          <BreadcrumbItem href="#" icon={<House />}>Home</BreadcrumbItem>
          <BreadcrumbItem href="#">Projects</BreadcrumbItem>
          <BreadcrumbItem href="#">Mobile app</BreadcrumbItem>
          <BreadcrumbItem>Settings</BreadcrumbItem>
        </Breadcrumbs>
      ))}
    </div>
  ),
};

/** Six levels with `maxItems={4}`: the middle collapses. Select "…" to show every level. */
export const LongPath: Story = {
  name: 'Long path',
  render: () => (
    <Breadcrumbs separator="caret" maxItems={4}>
      <BreadcrumbItem href="#" icon={<House />}>Home</BreadcrumbItem>
      <BreadcrumbItem href="#">Workspace</BreadcrumbItem>
      <BreadcrumbItem href="#">Projects</BreadcrumbItem>
      <BreadcrumbItem href="#">Design system</BreadcrumbItem>
      <BreadcrumbItem href="#">Mobile app</BreadcrumbItem>
      <BreadcrumbItem>Settings</BreadcrumbItem>
    </Breadcrumbs>
  ),
};

/** A settings page, a file browser and a shop, built from Coachli components. */
export const InUse: Story = {
  name: 'In use',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' }}>
      <div style={card}>
        <Breadcrumbs separator="caret">
          <BreadcrumbItem href="#" icon={<House />}>Home</BreadcrumbItem>
          <BreadcrumbItem href="#">Settings</BreadcrumbItem>
          <BreadcrumbItem>Notifications</BreadcrumbItem>
        </Breadcrumbs>
        <Text size="lg" weight="semibold" style={{ marginTop: 4 }}>Notifications</Text>
        <Text color="secondary">Choose what we email you about and how often.</Text>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button size="sm">Save changes</Button>
          <Button size="sm" variant="secondary">Cancel</Button>
        </div>
      </div>

      <div style={card}>
        <Breadcrumbs size="sm" maxItems={4}>
          <BreadcrumbItem href="#" icon={<House />}>Files</BreadcrumbItem>
          <BreadcrumbItem href="#">Marketing</BreadcrumbItem>
          <BreadcrumbItem href="#">2026</BreadcrumbItem>
          <BreadcrumbItem href="#">Brand</BreadcrumbItem>
          <BreadcrumbItem>Logos</BreadcrumbItem>
        </Breadcrumbs>
        {[
          [<FolderSimple key="f" />, 'Exports', '12 files'],
          [<FileSvg key="s" />, 'logo-mark.svg', '4 KB'],
          [<FilePng key="p" />, 'logo-mark@2x.png', '38 KB'],
        ].map(([icon, name, meta]) => (
          <div key={String(name)} style={{ ...line, padding: '6px 0', color: 'var(--halo-icon-primary)' }}>
            <span style={{ display: 'flex', fontSize: 20 }}>{icon}</span>
            <Text style={{ flex: 1 }}>{name}</Text>
            <Text size="sm" color="secondary">{meta}</Text>
          </div>
        ))}
      </div>

      <div style={card}>
        <Breadcrumbs>
          <BreadcrumbItem href="#" icon={<House />}>Shop</BreadcrumbItem>
          <BreadcrumbItem href="#">Shoes</BreadcrumbItem>
          <BreadcrumbItem>Trail runner</BreadcrumbItem>
        </Breadcrumbs>
        <div style={{ ...line, marginTop: 4 }}>
          <Text size="lg" weight="semibold" style={{ flex: 1 }}>Trail runner</Text>
          <Badge color="brand" variant="solid">New</Badge>
        </div>
        <Text color="secondary">$120 · Free returns for 30 days.</Text>
        <Button style={{ width: '100%' }}>Add to bag</Button>
      </div>
    </div>
  ),
};
