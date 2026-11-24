import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SocialButton } from './SocialButton';
import type { SocialButtonVariant, SocialProvider } from './SocialButton';

const providers: SocialProvider[] = ['apple', 'google', 'x', 'linkedin', 'dropbox', 'github'];
const variants: SocialButtonVariant[] = ['filled', 'outline'];
const names: Record<SocialProvider, string> = { apple: 'Apple', google: 'Google', x: 'X', linkedin: 'LinkedIn', dropbox: 'Dropbox', github: 'GitHub' };

const row: CSSProperties = { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 };
const caption: CSSProperties = { font: '500 13px/1.4 var(--halo-font-family-body)', color: 'var(--halo-text-secondary)' };
const card: CSSProperties = {
  width: 400,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  padding: 28,
  borderRadius: 20,
  border: '1px solid var(--halo-border-secondary)',
  background: 'var(--halo-surface-primary)',
  color: 'var(--halo-text-primary)',
  font: '400 14px/22px var(--halo-font-family-body)',
};

const meta = {
  title: 'Components/Social button',
  component: SocialButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Lets people sign in or connect an account with Apple, Google, X, LinkedIn, Dropbox or GitHub. Filled buttons use each provider\'s brand colour; Outline uses the page colour with a border. The label defaults to "Continue with <provider>", and icon-only buttons use the same words as their accessible name.\n\nFocus shows a light grey ring, and pressing gives the same subtle bounce as the Button.',
      },
    },
  },
  argTypes: {
    provider: { control: 'select', options: providers, table: { type: { summary: providers.map((p) => `'${p}'`).join(' | ') } } },
    variant: { control: 'inline-radio', options: variants, table: { type: { summary: variants.map((v) => `'${v}'`).join(' | ') } } },
    iconOnly: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: { provider: 'google', variant: 'filled', iconOnly: false, fullWidth: false },
} satisfies Meta<typeof SocialButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Try every option with the controls below. */
export const Playground: Story = {};

/** Six providers, each in Filled and Outline, with and without a label. */
export const Providers: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '90px repeat(2, max-content) repeat(2, 48px)', gap: '16px 20px', alignItems: 'center' }}>
      <span />
      <span style={caption}>Filled</span>
      <span style={caption}>Outline</span>
      <span style={caption}>Icon</span>
      <span style={caption}>Icon</span>
      {providers.map((p) => [
        <span key={`${p}-n`} style={{ ...caption, color: 'var(--halo-text-primary)' }}>{names[p]}</span>,
        <SocialButton key={`${p}-f`} provider={p} />,
        <SocialButton key={`${p}-o`} provider={p} variant="outline" />,
        <SocialButton key={`${p}-fi`} provider={p} iconOnly />,
        <SocialButton key={`${p}-oi`} provider={p} variant="outline" iconOnly />,
      ])}
    </div>
  ),
};

/** Hover and focus happen on their own: point at the buttons, or press Tab to see the light grey focus ring. */
export const States: Story = {
  render: () => (
    <div style={row}>
      {providers.map((p) => <SocialButton key={p} provider={p} iconOnly />)}
      <SocialButton provider="google" variant="outline" iconOnly />
    </div>
  ),
};

/** Social buttons on real screens: a sign-in card, an icon-only row and connected accounts. */
export const InUse: Story = {
  name: 'In use',
  render: () => (
    <div style={{ ...row, alignItems: 'flex-start', gap: 24 }}>
      <div style={card}>
        <strong style={{ fontSize: 20, lineHeight: '28px' }}>Welcome back</strong>
        <span style={{ color: 'var(--halo-text-secondary)' }}>Sign in to continue to Coachli.</span>
        <SocialButton provider="google" fullWidth />
        <SocialButton provider="apple" fullWidth />
        <SocialButton provider="github" fullWidth />
      </div>
      <div style={{ ...card, alignItems: 'center' }}>
        <strong style={{ fontSize: 20, lineHeight: '28px' }}>Create your account</strong>
        <span style={{ color: 'var(--halo-text-secondary)' }}>Sign up with</span>
        <div style={row}>
          {(['google', 'apple', 'x', 'github'] as const).map((p) => (
            <SocialButton key={p} provider={p} variant="outline" iconOnly />
          ))}
        </div>
      </div>
      <div style={card}>
        <strong style={{ fontSize: 20, lineHeight: '28px' }}>Connected accounts</strong>
        {(['linkedin', 'dropbox', 'github'] as const).map((p) => (
          <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ flex: 1, fontWeight: 500 }}>{names[p]}</span>
            <SocialButton provider={p} variant="outline">Connect</SocialButton>
          </div>
        ))}
      </div>
    </div>
  ),
};
