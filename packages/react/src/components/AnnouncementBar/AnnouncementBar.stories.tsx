import type { Meta, StoryObj } from '@storybook/react-vite';
import { CaretRight } from '@phosphor-icons/react';
import { LinkButton } from '../LinkButton';
import { AnnouncementBar } from './AnnouncementBar';

const register = (
  <LinkButton href="#" size="sm" iconRight={<CaretRight />}>
    Register now
  </LinkButton>
);

const meta = {
  title: 'Components/Announcement bar',
  component: AnnouncementBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A full-width dark bar at the very top of the app, for news about all of Coachli, like an upcoming Coachli event. It sits above the sidebar and the page header and stays put while the page scrolls. The message is only the event name (`title`) and its date, then a \"Register now\" link: keep it to 60 characters. It never runs past two lines; on a phone the link takes its own line under it. It has no close button: show it until the event is over. It is always dark, in light and dark mode. Use an Alert for news about one page.',
      },
    },
  },
  args: {
    title: 'Coachli Creator Summit 2026',
    children: 'Thu 26 Nov',
    action: register,
  },
} satisfies Meta<typeof AnnouncementBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Without a link, when there is nothing to do yet. */
export const WithoutLink: Story = { args: { action: undefined } };

/** At phone width: the link moves to its own line, centred. */
export const Phone: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: (args) => (
    <div style={{ maxWidth: 390 }}>
      <AnnouncementBar {...args} sticky={false} />
    </div>
  ),
};

/** At the top of the app, above the sidebar and the page. It stays put while the page scrolls. */
export const InTheApp: Story = {
  render: (args) => (
    <div style={{ height: 360, overflow: 'auto', background: 'var(--halo-surface-minimal)' }}>
      <AnnouncementBar {...args} />
      <div style={{ display: 'flex', gap: 16, padding: 16 }}>
        <div style={{ width: 220, height: 600, borderRadius: 12, background: 'var(--halo-surface-primary)' }} />
        <div style={{ flex: 1, height: 600, borderRadius: 12, background: 'var(--halo-surface-primary)' }} />
      </div>
    </div>
  ),
};
