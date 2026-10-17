import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DotsThree, UsersThree } from '@phosphor-icons/react';
import { Award } from '../Award';
import { Button } from '../Button';
import { CompactButton } from '../CompactButton';
import { GitHubLogo } from '../SocialButton/logos';
import { Text } from '../Text';
import { Tooltip } from '../Tooltip';
import { Avatar } from './Avatar';
import type { AvatarColor } from './Avatar';
import { AvatarGroup } from './AvatarGroup';
import { AvatarStatus } from './AvatarStatus';
import type { AvatarSize, AvatarStatusType } from './AvatarStatus';

// Sample photos from Unsplash and Notionists illustrations from DiceBear (see THIRD_PARTY_NOTICES.md).
const photo = (n: number) => `avatars/photo-${String(n).padStart(2, '0')}.jpg`;
const illustration = (n: number) => `avatars/notionists-${String(n).padStart(2, '0')}.png`;

const sizes: AvatarSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
const colors: AvatarColor[] = ['neutral', 'purple', 'blue', 'green', 'orange'];
const statusTypes: AvatarStatusType[] = ['online', 'offline', 'busy', 'away', 'verified', 'add', 'remove', 'icon', 'notification', 'logo'];
const sizeLabel: Record<AvatarSize, string> = { xs: 'XS', sm: 'S', md: 'M', lg: 'L', xl: 'XL' };
const title = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const row: CSSProperties = { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 };
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

function badge(type: AvatarStatusType, size?: AvatarSize) {
  if (type === 'notification') return <AvatarStatus type="notification" count={3} size={size} />;
  if (type === 'logo') return <AvatarStatus type="logo" logo={<GitHubLogo />} label="GitHub" size={size} />;
  return <AvatarStatus type={type} size={size} />;
}

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'An avatar shows a person or team as a **photo**, **initials** or an **icon**. Pass `src` for a photo; if it is missing or fails to load, the initials from `name` show instead, then the person icon. Add a badge on the bottom right with `status` and on the top right with `topStatus`. Badges sit centred on the edge of the circle, half in and half out.\n\nUse `AvatarGroup` to stack several avatars, with a "+N" circle for the rest.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: sizes, table: { type: { summary: sizes.map((s) => `'${s}'`).join(' | ') } } },
    color: { control: 'inline-radio', options: colors, table: { type: { summary: colors.map((c) => `'${c}'`).join(' | ') } } },
    status: { control: 'select', options: [undefined, ...statusTypes.filter((t) => t !== 'notification' && t !== 'logo')] },
    topStatus: { control: 'select', options: [undefined, ...statusTypes.filter((t) => t !== 'notification' && t !== 'logo')] },
    src: { control: 'select', options: [undefined, photo(1), photo(4), illustration(1)] },
    icon: { control: false },
  },
  args: { name: 'Ada Okafor', size: 'xl', color: 'purple', status: 'online', src: undefined },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Try every option with the controls below. */
export const Playground: Story = {};

/** A photo or illustration, initials, or an icon when there is neither. */
export const Types: Story = {
  render: () => (
    <div style={row}>
      <Avatar size="xl" src={photo(1)} name="Tobi Adeyemi" />
      <Avatar size="xl" src={illustration(1)} name="Sam Lee" />
      <Avatar size="xl" name="Ada Okafor" color="purple" />
      <Avatar size="xl" color="blue" />
    </div>
  ),
};

/** XS 24, S 32, M 40, L 48 and XL 64. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 20 }}>
      {[
        (s: AvatarSize) => <Avatar size={s} src={photo(2)} name="Amaka Eze" />,
        (s: AvatarSize) => <Avatar size={s} name="Ada Okafor" color="purple" />,
        (s: AvatarSize) => <Avatar size={s} color="green" />,
      ].map((make, i) => (
        <div key={i} style={row}>{sizes.map((s) => <span key={s}>{make(s)}</span>)}</div>
      ))}
    </div>
  ),
};

/** Five background colours for initials and icon avatars. Use them to tell people apart, not to mean anything. */
export const Colours: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 20 }}>
      <div style={row}>{colors.map((c) => <Avatar key={c} size="lg" color={c} name={title(c)} initials="AO" />)}</div>
      <div style={row}>{colors.map((c) => <Avatar key={c} size="lg" color={c} />)}</div>
    </div>
  ),
};

/** Every badge at every size. Pass a type to `status`, or an `AvatarStatus` for a count or a logo. */
export const Statuses: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: `110px repeat(${sizes.length}, 72px)`, gap: '20px 16px', alignItems: 'center' }}>
      <span />
      {sizes.map((s) => <span key={s} style={caption}>{sizeLabel[s]}</span>)}
      {statusTypes.map((t) => [
        <span key={t} style={{ ...caption, color: 'var(--halo-text-primary)' }}>{title(t)}</span>,
        ...sizes.map((s) => (
          <span key={`${t}-${s}`}>
            <Avatar size={s} src={photo(3)} name="Chidi Obi" status={badge(t)} />
          </span>
        )),
      ])}
    </div>
  ),
};

/** A badge on each corner: presence on the bottom, where someone works on the top. */
export const TwoBadges: Story = {
  name: 'Top and bottom',
  render: () => (
    <div style={row}>
      <Avatar size="xl" src={photo(5)} name="Zainab Bello" status="online" topStatus={badge('logo')} />
      <Avatar size="xl" src={photo(6)} name="Kemi Ade" status="busy" topStatus="verified" />
      <Avatar size="xl" name="Ada Okafor" color="orange" status={badge('notification')} topStatus="icon" />
    </div>
  ),
};

/** An award on the bottom right, sized to the avatar. Any bottom status moves to the top. */
export const WithAward: Story = {
  name: 'Award',
  render: () => (
    <div style={row}>
      <Avatar size="xs" name="Ada Okafor" color="purple" award="champion" />
      <Avatar size="sm" src={photo(2)} name="Kemi Ade" award="on-fire" />
      <Avatar size="md" name="Tunde Ola" color="blue" award="lift-off" />
      <Avatar size="lg" src={photo(5)} name="Zainab Bello" award={<Award name="legend" colors={3} />} />
      <Avatar size="xl" src={photo(6)} name="Kemi Ade" status="online" award="most-loved" />
    </div>
  ),
};

/** If the image fails to load, the initials show instead, then the icon. */
export const Fallback: Story = {
  render: () => (
    <div style={row}>
      <Avatar size="xl" src="avatars/missing.jpg" name="Ngozi Umeh" color="blue" />
      <Avatar size="xl" src="avatars/missing.jpg" color="green" />
    </div>
  ),
};

/** Overlapping avatars with a ring in the page colour. Anyone past `max` collapses into "+N". */
export const Group: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 20 }}>
      {sizes.map((s) => (
        <AvatarGroup key={s} size={s} max={4} total={9}>
          <Avatar src={photo(1)} name="Tobi Adeyemi" />
          <Avatar name="Ada Okafor" color="purple" />
          <Avatar src={photo(7)} name="Femi Ola" />
          <Avatar name="Chioma Nwosu" color="blue" />
          <Avatar src={photo(8)} name="Bayo Ade" />
        </AvatarGroup>
      ))}
    </div>
  ),
};

const team = [
  { name: 'Tobi Adeyemi', role: 'Product designer', src: photo(1), status: 'online' as const },
  { name: 'Ada Okafor', role: 'Engineering lead', color: 'purple' as const, status: 'away' as const },
  { name: 'Femi Ola', role: 'Frontend engineer', src: photo(7), status: 'busy' as const },
  { name: 'Sam Lee', role: 'Researcher', src: illustration(2), status: 'offline' as const },
];

/** A team list and a shared document header, built from Halo components. */
export const InUse: Story = {
  name: 'In use',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' }}>
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Text size="lg" weight="semibold" style={{ flex: 1 }}>Design team</Text>
          <Button size="sm" variant="secondary" iconLeft={<UsersThree />}>Invite</Button>
        </div>
        {team.map((p) => (
          <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar size="md" src={p.src} name={p.name} color={p.color} status={p.status} />
            <div style={{ flex: 1 }}>
              <Text weight="semibold">{p.name}</Text>
              <Text size="sm" color="secondary">{p.role}</Text>
            </div>
            <Tooltip content="More options">
              <CompactButton variant="ghost" aria-label={`More options for ${p.name}`}><DotsThree /></CompactButton>
            </Tooltip>
          </div>
        ))}
      </div>
      <div style={{ ...card, flexDirection: 'row', alignItems: 'center', width: 'auto' }}>
        <Text weight="semibold">Q4 roadmap</Text>
        <AvatarGroup size="sm" max={3} total={7}>
          {team.map((p) => <Avatar key={p.name} src={p.src} name={p.name} color={p.color} />)}
        </AvatarGroup>
        <Button size="sm">Share</Button>
      </div>
    </div>
  ),
};
