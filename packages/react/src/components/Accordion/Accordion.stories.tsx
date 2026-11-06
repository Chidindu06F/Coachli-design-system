import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowRight } from '@phosphor-icons/react';
import { LinkButton } from '../LinkButton';
import { Text } from '../Text';
import { Accordion, AccordionItem } from './Accordion';

const card: CSSProperties = {
  width: 440,
  padding: '8px 24px',
  borderRadius: 20,
  border: '1px solid var(--halo-border-secondary)',
  background: 'var(--halo-surface-primary)',
};

const meta = {
  title: 'Components/Accordion',
  component: AccordionItem,
  subcomponents: { Accordion },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Stacked sections that open and close. Each `AccordionItem` has a title and a content slot: put any content inside it. Wrap items in `Accordion` to manage them together; `type="single"` keeps only one open at a time. Hover and keyboard focus turn the title teal.',
      },
    },
  },
  argTypes: {
    title: { control: 'text' },
    divider: { control: 'boolean' },
    disabled: { control: 'boolean' },
    defaultOpen: { control: 'boolean' },
    children: { control: false },
  },
  args: {
    title: 'Section title',
    divider: true,
    disabled: false,
    defaultOpen: true,
    children: <Text color="contrast">Content for this section goes here. Replace it or add anything to the content slot.</Text>,
  },
  decorators: [(Story) => <div style={{ maxWidth: 480 }}><Story /></div>],
} satisfies Meta<typeof AccordionItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One item. Try the controls below, or click the header. */
export const Playground: Story = {};

/** Several items in an Accordion. Any number can be open at once. */
export const Group: Story = {
  render: () => (
    <Accordion defaultValue={['start']}>
      <AccordionItem value="start" title="How do I get started?">
        <Text color="contrast">Create an account, pick a plan and invite your team. It takes about two minutes.</Text>
      </AccordionItem>
      <AccordionItem value="plan" title="Can I change my plan later?">
        <Text color="contrast">Yes. Switch plans at any time from your account settings.</Text>
      </AccordionItem>
      <AccordionItem value="secure" title="Is my data secure?">
        <Text color="contrast">Your data is encrypted in transit and at rest.</Text>
      </AccordionItem>
    </Accordion>
  ),
};

/** type="single" closes the open item when another one opens. */
export const SingleOpen: Story = {
  name: 'Single open',
  render: () => (
    <Accordion type="single" defaultValue={['a']}>
      {['a', 'b', 'c'].map((v, i) => (
        <AccordionItem key={v} value={v} title={`Section ${i + 1}`}>
          <Text color="contrast">Only one section is open at a time.</Text>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

/** The content slot takes anything: here, a list of Link buttons. */
export const CustomContent: Story = {
  name: 'Custom content',
  render: () => (
    <AccordionItem title="Need help?" defaultOpen>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start' }}>
        {['Read the getting started guide', 'Watch a two-minute tour', 'Contact support'].map((l) => (
          <LinkButton key={l} href="#" iconRight={<ArrowRight />}>{l}</LinkButton>
        ))}
      </div>
    </AccordionItem>
  ),
};

/** Inside a card, turn off the divider on the last item. A disabled item can't be opened. */
export const InACard: Story = {
  name: 'In a card',
  render: () => (
    <div style={card}>
      <Accordion type="single" defaultValue={['address']}>
        <AccordionItem value="address" title="1. Shipping address">
          <Text color="contrast">Ada Okafor, 12 Marina Road, Lagos.</Text>
        </AccordionItem>
        <AccordionItem value="delivery" title="2. Delivery">
          <Text color="contrast">Standard, 3 to 5 days.</Text>
        </AccordionItem>
        <AccordionItem value="payment" title="3. Payment" disabled divider={false}>
          <Text color="contrast">Complete delivery first.</Text>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};
