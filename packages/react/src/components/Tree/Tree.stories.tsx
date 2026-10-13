import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { File, FileImage, FilePdf, Folder } from '@phosphor-icons/react';
import { Tree } from './Tree';
import type { TreeNode } from './Tree';

const files: TreeNode[] = [
  {
    id: 'brand',
    label: 'Brand',
    icon: <Folder />,
    children: [
      { id: 'logos', label: 'Logos', icon: <Folder />, children: [
        { id: 'logo-light', label: 'Logo light.svg', icon: <FileImage /> },
        { id: 'logo-dark', label: 'Logo dark.svg', icon: <FileImage /> },
      ] },
      { id: 'guidelines', label: 'Brand guidelines.pdf', icon: <FilePdf /> },
    ],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    icon: <Folder />,
    children: [
      { id: 'launch', label: 'Launch plan.pdf', icon: <FilePdf /> },
      { id: 'posts', label: 'Social posts', icon: <Folder />, children: [
        { id: 'post-1', label: 'Week one.png', icon: <FileImage /> },
        { id: 'post-2', label: 'Week two.png', icon: <FileImage /> },
      ] },
    ],
  },
  { id: 'notes', label: 'Meeting notes.txt', icon: <File /> },
  { id: 'archive', label: 'Archive', icon: <Folder />, disabled: true, children: [{ id: 'old', label: 'Old files', icon: <File /> }] },
];

const permissions: TreeNode[] = [
  { id: 'projects', label: 'Projects', children: [
    { id: 'projects-view', label: 'View projects' },
    { id: 'projects-edit', label: 'Edit projects' },
    { id: 'projects-delete', label: 'Delete projects' },
  ] },
  { id: 'billing', label: 'Billing', children: [
    { id: 'billing-view', label: 'View invoices' },
    { id: 'billing-pay', label: 'Pay invoices' },
  ] },
  { id: 'members', label: 'Members', children: [
    { id: 'members-invite', label: 'Invite people' },
    { id: 'members-remove', label: 'Remove people' },
  ] },
];

const meta = {
  title: 'Components/Tree',
  component: Tree,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Nested items people open and close, like folders, categories or permissions. Pick one row, or turn on `checkable` for checkboxes: checking a branch checks everything inside it, and a branch shows a dash when only some of it is checked. Keyboard: arrow keys move and open or close branches, Home and End jump, Enter or Space picks.',
      },
    },
  },
  args: { nodes: files, defaultExpanded: ['brand', 'logos'], 'aria-label': 'Files' },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
} satisfies Meta<typeof Tree>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Folders and files, with one picked. */
export const Playground: Story = { args: { defaultSelected: 'logo-light' } };

/** Checkboxes, for picking several, like permissions for a role. */
export const Checkable: Story = {
  render: () => {
    const [checked, setChecked] = useState<string[]>(['projects-view', 'projects-edit', 'billing-view']);
    return (
      <div>
        <Tree nodes={permissions} checkable checked={checked} onCheckedChange={setChecked} defaultExpanded={['projects', 'billing']} aria-label="Permissions" />
        <p style={{ font: '13px/20px var(--halo-font-family-body)', color: 'var(--halo-text-secondary)' }}>{checked.length} permissions on</p>
      </div>
    );
  },
};

/** Small rows, for dense side panels. */
export const Small: Story = { args: { size: 'sm' } };
