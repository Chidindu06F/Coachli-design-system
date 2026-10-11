import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Lightning } from '@phosphor-icons/react';
import { Text } from '../Text';
import { QRCode } from './QRCode';

const meta = {
  title: 'Components/QR code',
  component: QRCode,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A scannable QR code for links, sign-in on another device, payments or tickets. Drawn as SVG by an encoder built into Halo, so there is nothing else to install. It stays dark on light in dark mode, because many phones cannot read light-on-dark codes. Give it a `label` saying what scanning does, and show the link or code as text nearby for people who cannot scan.',
      },
    },
  },
  args: { value: 'https://example.com/invite/7Q2K9', label: 'Scan to open the invite link' },
} satisfies Meta<typeof QRCode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** 120, 160 and 200px. Keep codes at least 2cm across when printed. */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24 }}>
      <QRCode {...args} size={120} />
      <QRCode {...args} size={160} />
      <QRCode {...args} size={200} />
    </div>
  ),
};

/** A logo in the middle. The error correction rises to H so the code still scans. */
export const WithLogo: Story = {
  args: {
    logo: (
      <span style={{ display: 'grid', placeItems: 'center', width: '100%', height: '100%', borderRadius: 6, background: 'var(--halo-color-black-900)', color: 'var(--halo-color-neutrals-0)' }}>
        <Lightning weight="fill" />
      </span>
    ),
  },
};

/** While a sign-in code is being made, and after it runs out. */
export const States: Story = {
  render: function Render(args) {
    const [status, setStatus] = useState<'loading' | 'expired'>('expired');
    useEffect(() => {
      if (status !== 'loading') return;
      const t = setTimeout(() => setStatus('expired'), 1500);
      return () => clearTimeout(t);
    }, [status]);
    return (
      <div style={{ display: 'flex', gap: 24 }}>
        <QRCode {...args} status="loading" />
        <QRCode {...args} status={status} onRefresh={() => setStatus('loading')} />
      </div>
    );
  },
};

/** A common layout: the code, what it does, and a fallback for people who cannot scan. */
export const SignInOnPhone: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, maxWidth: 480 }}>
      <QRCode value="https://example.com/login/device?code=WDJB-MJHT" label="Scan to sign in on your phone" size={144} />
      <div style={{ display: 'grid', gap: 8 }}>
        <Text size="lg" weight="semibold">Sign in on your phone</Text>
        <Text color="secondary">Open the camera and point it at the code. Or go to example.com/device and enter WDJB-MJHT.</Text>
      </div>
    </div>
  ),
};
