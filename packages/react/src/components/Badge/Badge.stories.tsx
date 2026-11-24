import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowsClockwise, Bell, ChatCircle, CheckCircle, Gear, House, Lightning, Star, Tray } from '@phosphor-icons/react';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { CompactButton } from '../CompactButton';
import { Text } from '../Text';
import { Badge } from './Badge';
import type { BadgeColor, BadgeSize, BadgeVariant } from './Badge';

const colors: BadgeColor[] = ['neutral', 'brand', 'information', 'success', 'warning', 'error'];
const variants: BadgeVariant[] = ['soft', 'solid', 'outline'];
const sizes: BadgeSize[] = ['xs', 'sm', 'md', 'lg'];
const sizeLabel: Record<BadgeSize, string> = { xs: 'XS', sm: 'S', md: 'M', lg: 'L' };
const title = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const icons = { None: undefined, Star: <Star />, Lightning: <Lightning />, CheckCircle: <CheckCircle /> };

const row: CSSProperties = { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 };
const caption: CSSProperties = { font: '500 13px/1.4 var(--halo-font-family-body)', color: 'var(--halo-text-secondary)' };
const card: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  width: 360,
  padding: 20,
  borderRadius: 16,
  border: '1px solid var(--halo-border-secondary)',
  background: 'var(--halo-surface-primary)',
};
const line: CSSProperties = { display: 'flex', alignItems: 'center', gap: 12 };

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A small read-only label for the **status**, **category** or **count** of something. Pick the `color` for what it means, the `variant` for how much it stands out (soft, solid or outline) and the `size` to match the text next to it. For things people can click, filter or remove, use a Tag instead.',
      },
    },
  },
  argTypes: {
    color: { control: 'inline-radio', options: colors, table: { type: { summary: colors.map((c) => `'${c}'`).join(' | ') } } },
    variant: { control: 'inline-radio', options: variants, table: { type: { summary: variants.map((v) => `'${v}'`).join(' | ') } } },
    size: { control: 'inline-radio', options: sizes, table: { type: { summary: sizes.map((s) => `'${s}'`).join(' | ') } } },
    icon: { control: 'select', options: Object.keys(icons), mapping: icons, table: { type: { summary: 'ReactNode' } } },
    children: { control: 'text' },
  },
  args: { children: 'Active', color: 'success', variant: 'soft', size: 'md', dot: true },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Try every option with the controls below. */
export const Playground: Story = {};

/** Six colours in three styles. Pick the colour for its meaning, not for decoration. */
export const ColoursAndStyles: Story = {
  name: 'Colours and styles',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '110px repeat(3, max-content)', gap: '16px 24px', alignItems: 'center' }}>
      <span />
      {variants.map((v) => <span key={v} style={caption}>{title(v)}</span>)}
      {colors.map((c) => [
        <span key={c} style={{ ...caption, color: 'var(--halo-text-primary)' }}>{title(c)}</span>,
        ...variants.map((v) => <span key={`${c}-${v}`}><Badge color={c} variant={v}>{title(c)}</Badge></span>),
      ])}
    </div>
  ),
};

/** XS 16, S 20, M 24 and L 28. XS is for counts on icons and nav items. */
export const Sizes: Story = {
  render: () => (
    <div style={row}>
      {sizes.map((s) => (
        <span key={s} style={{ ...row, gap: 8 }}>
          <Badge size={s} color="brand">{sizeLabel[s]}</Badge>
          <Badge size={s} color="error" variant="solid" count={3} aria-label="3 unread" />
        </span>
      ))}
    </div>
  ),
};

/** A dot for statuses, or an icon from the Coachli library. */
export const DotAndIcon: Story = {
  name: 'Dot and icon',
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={row}>
        <Badge color="success" dot>Active</Badge>
        <Badge color="warning" dot>Pending</Badge>
        <Badge color="error" dot>Failed</Badge>
        <Badge color="neutral" dot>Draft</Badge>
      </div>
      <div style={row}>
        <Badge color="brand" variant="outline" icon={<Lightning />}>Pro</Badge>
        <Badge color="success" variant="outline" icon={<CheckCircle />}>Verified</Badge>
        <Badge color="information" variant="outline" icon={<ArrowsClockwise />}>Updated</Badge>
      </div>
    </div>
  ),
};

/** Single digits are circles; bigger numbers grow into a pill and cap at `max`. */
export const Counts: Story = {
  render: () => (
    <div style={row}>
      <Badge size="xs" color="error" variant="solid" count={3} aria-label="3 unread" />
      <Badge size="sm" color="error" variant="solid" count={3} aria-label="3 unread" />
      <Badge color="error" variant="solid" count={12} aria-label="12 unread" />
      <Badge size="lg" color="error" variant="solid" count={150} aria-label="150 unread" />
      <Badge color="brand" count={8} />
      <Badge count={1200} max={999} />
    </div>
  ),
};

/** A team list, navigation with counts and a plan card, built from Coachli components. */
export const InUse: Story = {
  name: 'In use',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' }}>
      <div style={card}>
        <div style={line}>
          <Text size="lg" weight="semibold" style={{ flex: 1 }}>Team</Text>
          <Badge size="sm">4 people</Badge>
        </div>
        {[
          ['Ada Okafor', 'purple', 'Admin', 'success', 'Active'],
          ['Tobi Adeyemi', 'blue', 'Editor', 'success', 'Active'],
          ['Femi Ola', 'green', 'Viewer', 'warning', 'Invited'],
        ].map(([name, avatar, role, status, label]) => (
          <div key={name} style={line}>
            <Avatar name={name} color={avatar as 'purple'} />
            <Text weight="semibold" style={{ flex: 1 }}>{name}</Text>
            <Badge size="sm">{role}</Badge>
            <Badge size="sm" color={status as BadgeColor} dot>{label}</Badge>
          </div>
        ))}
      </div>

      <div style={{ ...card, gap: 8 }}>
        <div style={line}>
          <Text size="lg" weight="semibold" style={{ flex: 1 }}>Workspace</Text>
          <span style={{ position: 'relative', display: 'inline-flex' }}>
            <CompactButton variant="ghost" aria-label="Notifications, 2 new"><Bell /></CompactButton>
            <Badge size="xs" color="error" variant="solid" count={2} aria-hidden="true" style={{ position: 'absolute', top: -6, right: -6 }} />
          </span>
        </div>
        {[
          [<House key="h" />, 'Home', null],
          [<Tray key="t" />, 'Inbox', <Badge key="b" size="sm" color="error" variant="solid" count={3} aria-label="3 unread" />],
          [<ChatCircle key="c" />, 'Messages', <Badge key="b" size="sm" count={12} aria-label="12 unread" />],
          [<Gear key="g" />, 'Settings', null],
        ].map(([icon, label, badge]) => (
          <div key={String(label)} style={{ ...line, gap: 10, padding: '6px 0', color: 'var(--halo-icon-primary)' }}>
            <span style={{ display: 'flex', fontSize: 20 }}>{icon}</span>
            <Text style={{ flex: 1 }}>{label}</Text>
            {badge}
          </div>
        ))}
      </div>

      <div style={card}>
        <div style={line}>
          <Text size="lg" weight="semibold" style={{ flex: 1 }}>Pro</Text>
          <Badge color="brand" variant="solid">Popular</Badge>
        </div>
        <Text color="secondary">$12 per person a month, billed yearly.</Text>
        <div style={{ ...row, gap: 8 }}>
          <Badge size="sm" variant="outline">Unlimited files</Badge>
          <Badge size="sm" variant="outline">Version history</Badge>
        </div>
        <Button style={{ width: '100%' }}>Upgrade to Pro</Button>
      </div>
    </div>
  ),
};
