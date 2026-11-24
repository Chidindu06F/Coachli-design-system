import { useState } from 'react';
import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Text } from '../Text';
import { Checkbox } from './Checkbox';
import { CheckboxGroup } from './CheckboxGroup';
import type { CheckboxSize } from './Checkbox';

const sizes: CheckboxSize[] = ['sm', 'md'];
const stack: CSSProperties = { display: 'grid', gap: 16, justifyItems: 'start' };
const row: CSSProperties = { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 };
const card: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 16,
  width: 380,
  padding: 24,
  borderRadius: 16,
  border: '1px solid var(--halo-border-secondary)',
  background: 'var(--halo-surface-primary)',
};

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  subcomponents: { CheckboxGroup },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A box people tick to choose any number of options, or to agree to something. It is a real checkbox input, so Tab, Space, forms and screen readers all work. Give it a `label`, and optionally a `description`. Use `CheckboxGroup` for a labelled list.\n\nFor a setting that changes straight away, use a Switch instead; to pick exactly one option, use Radio.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: sizes, table: { type: { summary: sizes.map((s) => `'${s}'`).join(' | ') } } },
    label: { control: 'text' },
    description: { control: 'text' },
  },
  args: { label: 'Email', description: 'A weekly summary and account updates.', size: 'md', defaultChecked: true, indeterminate: false, invalid: false, disabled: false },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Try every option with the controls below. */
export const Playground: Story = {};

/** Off, On and Indeterminate, in both sizes. */
export const Checked: Story = {
  render: () => (
    <div style={stack}>
      {sizes.map((s) => (
        <div key={s} style={row}>
          <Checkbox size={s} label="Off" />
          <Checkbox size={s} label="On" defaultChecked />
          <Checkbox size={s} label="Indeterminate" indeterminate />
        </div>
      ))}
    </div>
  ),
};

/** Disabled and Error. Pair an error with a message that says what to do. */
export const States: Story = {
  render: () => (
    <div style={stack}>
      <div style={row}>
        <Checkbox label="Disabled" disabled />
        <Checkbox label="Disabled and ticked" disabled defaultChecked />
      </div>
      <Checkbox label="I agree to the terms" invalid description="Tick this box to continue." />
    </div>
  ),
};

/** A labelled group of options, read as one question by screen readers. */
export const Group: Story = {
  render: () => (
    <CheckboxGroup label="Notifications">
      <Checkbox label="Email" description="A weekly summary and account updates." defaultChecked />
      <Checkbox label="Push notifications" description="Mentions, replies and reminders." defaultChecked />
      <Checkbox label="Text messages" description="Only for sign-in codes." />
    </CheckboxGroup>
  ),
};

function SelectAll() {
  const files = ['Invoice 1042.pdf', 'Invoice 1043.pdf', 'Invoice 1044.pdf'];
  const [ticked, setTicked] = useState<string[]>([files[0]!, files[2]!]);
  const all = ticked.length === files.length;
  return (
    <div style={{ ...card, gap: 10 }}>
      <Checkbox
        size="sm"
        label="Select all"
        checked={all}
        indeterminate={ticked.length > 0 && !all}
        onCheckedChange={(on) => setTicked(on ? files : [])}
      />
      {files.map((f) => (
        <Checkbox
          key={f}
          size="sm"
          label={f}
          checked={ticked.includes(f)}
          onCheckedChange={(on) => setTicked((t) => (on ? [...t, f] : t.filter((x) => x !== f)))}
        />
      ))}
      <Button size="sm" variant="secondary" disabled={ticked.length === 0}>
        Download {ticked.length} {ticked.length === 1 ? 'file' : 'files'}
      </Button>
    </div>
  );
}

/** Settings, a sign-up form and a list with "Select all", built from Coachli components. */
export const InUse: Story = {
  name: 'In use',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' }}>
      <div style={card}>
        <CheckboxGroup label="Notifications">
          <Checkbox label="Email" description="A weekly summary and account updates." defaultChecked />
          <Checkbox label="Push notifications" description="Mentions, replies and reminders." defaultChecked />
          <Checkbox label="Text messages" description="Only for sign-in codes." />
        </CheckboxGroup>
      </div>
      <div style={card}>
        <Text size="lg" weight="semibold">Create your account</Text>
        <Checkbox label="I agree to the Terms of Service and Privacy Policy" defaultChecked />
        <Checkbox label="Send me product news (optional)" />
        <Button style={{ width: '100%' }}>Create account</Button>
      </div>
      <SelectAll />
    </div>
  ),
};
