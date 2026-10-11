import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowRight, CaretLeft, CaretRight, DownloadSimple, Gear, Plus, Sparkle, Trash, X } from '@phosphor-icons/react';
import { Button } from './Button';
import type { ButtonSize, ButtonVariant } from './Button';

const icons = {
  None: undefined,
  Plus: <Plus />,
  ArrowRight: <ArrowRight />,
  CaretLeft: <CaretLeft />,
  CaretRight: <CaretRight />,
  Download: <DownloadSimple />,
  Trash: <Trash />,
  Gear: <Gear />,
  Sparkle: <Sparkle />,
  X: <X />,
};

const variants: ButtonVariant[] = ['primary', 'secondary', 'ghost', 'destructive', 'premium'];
const sizes: ButtonSize[] = ['xs', 'sm', 'md', 'lg'];
const sizeLabel: Record<ButtonSize, string> = { xs: 'XS', sm: 'S', md: 'M', lg: 'L' };
const title = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const row: CSSProperties = { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 };
const caption: CSSProperties = { font: '500 13px/1.4 var(--halo-font-family-body)', color: 'var(--halo-text-secondary)' };

function Grid({ columns, rows }: { columns: string[]; rows: [string, ReactNode[]][] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `120px repeat(${columns.length}, max-content)`, gap: '20px 32px', alignItems: 'center' }}>
      <span />
      {columns.map((c) => <span key={c} style={caption}>{c}</span>)}
      {rows.map(([label, cells]) => [
        <span key={label} style={{ ...caption, color: 'var(--halo-text-primary)' }}>{label}</span>,
        ...cells.map((cell, i) => <div key={`${label}-${i}`}>{cell}</div>),
      ])}
    </div>
  );
}

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Buttons start an action, like saving, submitting or deleting. Use one **primary** button per view for the most important action, **secondary** for the alternative, **ghost** for low-emphasis actions and **destructive** for actions that delete data. To go to another page, use a link instead.\n\nWhen pressed, a button shrinks very slightly and springs back with a subtle bounce. This is switched off for people who prefer reduced motion.\n\nButton text meets WCAG 2.2 AA contrast (at least 4.5:1) in light and dark mode: primary 4.5:1 (5.7:1 on hover), destructive 6.1:1, and secondary and ghost over 15:1.',
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: variants, table: { type: { summary: variants.map((v) => `'${v}'`).join(' | ') } } },
    size: { control: 'inline-radio', options: sizes, table: { type: { summary: sizes.map((v) => `'${v}'`).join(' | ') } } },
    iconLeft: { control: 'select', options: Object.keys(icons), mapping: icons, table: { type: { summary: 'ReactNode' } } },
    iconRight: { control: 'select', options: Object.keys(icons), mapping: icons, table: { type: { summary: 'ReactNode' } } },
    iconOnly: { control: false, table: { type: { summary: 'boolean' } } },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: { children: 'Button', variant: 'primary', size: 'md', disabled: false },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Try every option with the controls below. */
export const Playground: Story = {};

/** Four everyday types, from most to least emphasis. Destructive is for actions that delete data. Premium is a special type, shown below. */
export const Types: Story = {
  render: () => (
    <div style={row}>
      <Button variant="primary">Save changes</Button>
      <Button variant="secondary">Cancel</Button>
      <Button variant="ghost" iconRight={<ArrowRight />}>Learn more</Button>
      <Button variant="destructive" iconLeft={<Trash />}>Delete</Button>
    </div>
  ),
};

/**
 * A gradient button for upgrades and paid features, like upgrading a plan or starting a trial.
 * Use at most one per screen and never next to a Primary button, so it keeps its pull.
 * Everyday actions such as saving or sending stay Primary. The gradient comes from the
 * `--halo-button-premium-start`, `-middle` and `-end` tokens.
 */
export const Premium: Story = {
  render: () => (
    <div style={row}>
      <Button variant="premium" size="lg" iconLeft={<Sparkle weight="fill" />}>Upgrade to Pro</Button>
      <Button variant="premium" iconLeft={<Sparkle weight="fill" />}>Start free trial</Button>
      <Button variant="premium" size="sm">Upgrade</Button>
      <Button variant="premium" size="sm" iconOnly aria-label="Upgrade"><Sparkle weight="fill" /></Button>
    </div>
  ),
};

/** Heights are 28, 32, 40 and 48px, for text and icon-only buttons alike. Padding and font size shrink with each size. M is the default. */
export const Sizes: Story = {
  render: () => (
    <Grid
      columns={sizes.map((s) => sizeLabel[s])}
      rows={variants.map((v) => [
        title(v),
        sizes.map((s) => (
          <div key={s} style={row}>
            <Button variant={v} size={s}>Button</Button>
            <Button variant={v} size={s} iconOnly aria-label="Add"><Plus /></Button>
          </div>
        )),
      ])}
    />
  ),
};

/**
 * Hover, pressed and focus happen on their own: point at, click, or Tab to the buttons.
 * Hover and pressed share one colour. Only Disabled is set by hand.
 */
export const States: Story = {
  render: () => (
    <Grid
      columns={['Default', 'Disabled']}
      rows={variants.map((v) => [
        title(v),
        [
          <Button key="d" variant={v} iconLeft={<CaretLeft />} iconRight={<CaretRight />}>Button</Button>,
          <Button key="x" variant={v} iconLeft={<CaretLeft />} iconRight={<CaretRight />} disabled>Button</Button>,
        ],
      ])}
    />
  ),
};

/** A spinner while an action runs. The button keeps its width and ignores clicks. Press one to try it. */
export const Loading: Story = {
  render: function Render() {
    const [busy, setBusy] = useState<string | null>(null);
    const run = (v: string) => {
      setBusy(v);
      setTimeout(() => setBusy(null), 1500);
    };
    return (
      <Grid
        columns={['Loading', 'Try it']}
        rows={variants.map((v) => [
          title(v),
          [
            <Button key="l" variant={v} loading>Save changes</Button>,
            <Button key="t" variant={v} loading={busy === v} onClick={() => run(v)}>Save changes</Button>,
          ],
        ])}
      />
    );
  },
};

/** A leading icon describes the action; a trailing icon shows direction. Any icon works. */
export const WithIcons: Story = {
  name: 'With icons',
  render: () => (
    <div style={row}>
      <Button variant="primary">Save</Button>
      <Button variant="secondary" iconLeft={<Plus />}>New project</Button>
      <Button variant="primary" iconRight={<ArrowRight />}>Continue</Button>
      <Button variant="secondary" iconLeft={<DownloadSimple />}>Download</Button>
    </div>
  ),
};

/** Circular buttons for compact actions. They always need an `aria-label`, since there's no visible text. */
export const IconOnly: Story = {
  name: 'Icon only',
  render: () => (
    <div style={row}>
      {variants.map((v) => (
        <Button key={v} variant={v} iconOnly aria-label="Settings"><Gear /></Button>
      ))}
      <Button variant="ghost" iconOnly aria-label="Close"><X /></Button>
    </div>
  ),
};

/** One primary per view, paired with a secondary for the alternative. */
export const Pairing: Story = {
  render: () => (
    <div style={row}>
      <Button variant="secondary">Cancel</Button>
      <Button variant="primary">Save changes</Button>
    </div>
  ),
};
