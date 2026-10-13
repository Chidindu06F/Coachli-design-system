import type { ComponentType } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TreeSelect, TreeSelectField } from './TreeSelect';
import type { TreeSelectProps } from './TreeSelect';
import type { TreeNode } from './Tree';

const teams: TreeNode[] = [
  { id: 'product', label: 'Product', children: [
    { id: 'design', label: 'Design' },
    { id: 'engineering', label: 'Engineering', children: [
      { id: 'web', label: 'Web' },
      { id: 'mobile', label: 'Mobile' },
      { id: 'platform', label: 'Platform' },
    ] },
    { id: 'research', label: 'Research' },
  ] },
  { id: 'operations', label: 'Operations', children: [
    { id: 'finance', label: 'Finance' },
    { id: 'people', label: 'People' },
    { id: 'legal', label: 'Legal' },
  ] },
  { id: 'sales', label: 'Sales', children: [
    { id: 'enterprise', label: 'Enterprise' },
    { id: 'smb', label: 'Small business' },
  ] },
];

const meta = {
  title: 'Components/Tree select',
  component: TreeSelect as ComponentType<TreeSelectProps>,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Picks from nested options, like a team inside a department. Opens a Tree in a layer under the box. With `multiple`, rows get checkboxes and picks show as tags; checking a branch picks everything inside it. Turn on `search` for long trees.',
      },
    },
  },
  args: { nodes: teams, placeholder: 'Choose a team', 'aria-label': 'Team' },
  decorators: [(Story) => <div style={{ width: 320, minHeight: 360 }}><Story /></div>],
} satisfies Meta<TreeSelectProps>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One team. */
export const Playground: Story = { args: { defaultExpanded: ['product'] } };

/** Several teams, with search. */
export const Multiple: Story = {
  render: () => <TreeSelect nodes={teams} multiple search placeholder="Choose teams" aria-label="Teams" defaultValue={['design', 'web']} defaultExpanded={['product', 'engineering']} />,
};

/** With a label and a hint, and the error state. */
export const Field: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      <TreeSelectField label="Team" hint="Where this person works." nodes={teams} placeholder="Choose a team" search />
      <TreeSelectField label="Team" error="Choose a team." nodes={teams} placeholder="Choose a team" />
    </div>
  ),
};
