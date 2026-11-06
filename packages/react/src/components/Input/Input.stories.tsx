import type { Meta, StoryObj } from '@storybook/react-vite';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { Input, InputField, PasswordInput } from './Input';
import { NumberInput } from './NumberInput';
import { VerificationCode } from './VerificationCode';
import { InputAffixSelect } from './InputAffixSelect';

const meta = {
  title: 'Components/Input',
  component: InputField,
  subcomponents: { Input, PasswordInput, NumberInput, VerificationCode },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A single-line text box. `InputField` adds a label, a hint and an error message, wired to the input for screen readers. Use `Input` on its own only where a label is nearby. Icons, prefixes and suffixes cover search, website, amount and phone inputs; `PasswordInput`, `NumberInput` and `VerificationCode` cover the special cases.',
      },
    },
  },
  args: { label: 'Email', placeholder: 'name@example.com', hint: 'We never share your email.', size: 'md' },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
} satisfies Meta<typeof InputField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Small, Medium and Large. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Input size="sm" placeholder="Small" aria-label="Small" />
      <Input size="md" placeholder="Medium" aria-label="Medium" />
      <Input size="lg" placeholder="Large" aria-label="Large" />
    </div>
  ),
};

/** Required, optional, an info tip, success, an error and disabled. */
export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 20 }}>
      <InputField label="Full name" required defaultValue="Amara Okafor" />
      <InputField label="Company" optional info="Shown on your invoices." placeholder="Studio" />
      <InputField label="Username" valid defaultValue="amara.okafor" />
      <InputField label="Password" error="Use at least 8 characters." defaultValue="abc" />
      <InputField label="Email" disabled defaultValue="amara@example.com" />
    </div>
  ),
};

/** After a value passes a check: a green check at the end of the box, with no message and no colour change. Use `valid`. An error always wins and shows a red warning icon. */
export const Success: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 20 }}>
      <InputField label="Username" valid defaultValue="amara.okafor" />
      <InputField label="Account number" hint="10 digits" valid defaultValue="0123456789" />
      <Input valid defaultValue="SAVE20" aria-label="Promo code" />
    </div>
  ),
};

/** Icons, prefixes and suffixes. */
export const Affixes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 20 }}>
      <Input iconLeft={<MagnifyingGlass />} placeholder="Search" aria-label="Search" />
      <InputField label="Website" prefix="https://" placeholder="example.com" />
      <InputField label="Weight" suffix="kg" defaultValue="72" />
      <PasswordInput label="Password" defaultValue="correct horse" />
    </div>
  ),
};

/** A number with minus and plus buttons. */
export const Number: Story = {
  render: () => <NumberInput label="Guests" defaultValue={2} min={1} max={10} />,
};

/** One circle per digit. Pasting fills them all. */
export const Code: Story = {
  render: () => <VerificationCode length={6} defaultValue="482" />,
};

// Simple flags for the story only. In the product use the flag set from the design system.
const flag = (body: React.ReactNode) => <svg viewBox="0 0 20 15" width="20" height="15">{body}</svg>;
const FLAGS = {
  USD: flag(<><rect width="20" height="15" fill="#fff" /><path d="M0 0h20v1.2H0zM0 2.3h20v1.2H0zM0 4.6h20v1.2H0zM0 6.9h20v1.2H0zM0 9.2h20v1.2H0zM0 11.5h20v1.2H0zM0 13.8h20V15H0z" fill="#B22234" /><rect width="9" height="8" fill="#3C3B6E" /></>),
  NGN: flag(<><rect width="20" height="15" fill="#fff" /><rect width="6.7" height="15" fill="#008751" /><rect x="13.3" width="6.7" height="15" fill="#008751" /></>),
  GBP: flag(<><rect width="20" height="15" fill="#012169" /><path d="M0 0l20 15M20 0L0 15" stroke="#fff" strokeWidth="3" /><path d="M10 0v15M0 7.5h20" stroke="#fff" strokeWidth="4" /><path d="M10 0v15M0 7.5h20" stroke="#C8102E" strokeWidth="2" /></>),
};
const currencies = (['USD', 'NGN', 'GBP'] as const).map((c) => ({ value: c, label: c, icon: FLAGS[c] }));

/** A price with its currency inside the field: an `InputAffixSelect` in the prefix. For pay what you want, put the currency on the minimum price and keep the suggested price as a plain input. */
export const CurrencyPrice: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <InputField label="Price" defaultValue="50" inputMode="decimal" prefix={<InputAffixSelect aria-label="Currency" options={currencies} defaultValue="USD" />} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <InputField label="Minimum price" defaultValue="20" inputMode="decimal" prefix={<InputAffixSelect aria-label="Currency" options={currencies} defaultValue="NGN" />} />
        <InputField label="Suggested price" defaultValue="50" inputMode="decimal" />
      </div>
    </div>
  ),
};
