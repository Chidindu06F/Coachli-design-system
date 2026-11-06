import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CaretRight, FileText, Image as ImageIcon, MusicNote } from '@phosphor-icons/react';
import { Avatar } from '../Avatar';
import { Badge } from '../Badge';
import { Switch } from '../Switch';
import { List, ListItem } from './List';

const meta = {
  title: 'Components/List',
  component: List,
  subcomponents: { ListItem },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A vertical list of rows, like files, settings or people. Give a ListItem `href` or `onClick` to make the whole row clickable. Use `leading` and `trailing` for an Avatar, Badge, Switch or value.',
      },
    },
  },
  args: { variant: 'plain', size: 'md' },
  decorators: [(Story) => <div style={{ maxWidth: 360 }}><Story /></div>],
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Render(args) {
    const [chosen, setChosen] = useState('report');
    const files = [
      { id: 'report', title: 'Quarterly report.pdf', description: '2.4 MB', icon: <FileText /> },
      { id: 'cover', title: 'Cover image.png', description: '840 KB', icon: <ImageIcon /> },
      { id: 'intro', title: 'Intro music.mp3', description: '5.1 MB', icon: <MusicNote /> },
    ];
    return (
      <List {...args}>
        {files.map((f) => (
          <ListItem key={f.id} title={f.title} description={f.description} icon={f.icon} trailingIcon={<CaretRight />} selected={chosen === f.id} onClick={() => setChosen(f.id)} />
        ))}
        <ListItem title="Archived notes.txt" description="Read only" icon={<FileText />} disabled onClick={() => {}} />
      </List>
    );
  },
};

/** Selectable lists, like a conversation list or a customer picker: `inset` gives every row 8px side padding so the hover and selected highlight don't touch the avatar. */
export const Inset: Story = {
  render: function Render(args) {
    const [chosen, setChosen] = useState('ada');
    const people = [
      { id: 'ada', name: 'Ada Obi', last: 'Perfect, thank you! See you Friday', when: 'Today' },
      { id: 'chioma', name: 'Chioma Eze', last: 'Is the masterclass still open for enrolment?', when: 'Today' },
      { id: 'kemi', name: 'Kemi Lawal', last: 'Can I pay for the bundle in two parts?', when: 'Yesterday' },
    ];
    return (
      <List {...args} inset>
        {people.map((p) => (
          <ListItem key={p.id} title={p.name} description={p.last} leading={<Avatar size="sm" name={p.name} />} trailing={<span style={{ fontSize: 12 }}>{p.when}</span>} selected={chosen === p.id} onClick={() => setChosen(p.id)} />
        ))}
      </List>
    );
  },
};

/** Lines between rows. */
export const Divided: Story = {
  render: () => (
    <List variant="divided">
      <ListItem title="Ada Obi" description="ada@example.com" leading={<Avatar size="sm" name="Ada Obi" color="purple" />} trailing={<Badge color="success">Active</Badge>} />
      <ListItem title="Kofi Mensah" description="kofi@example.com" leading={<Avatar size="sm" name="Kofi Mensah" />} trailing={<Badge>Invited</Badge>} />
      <ListItem title="Lena Park" description="lena@example.com" leading={<Avatar size="sm" name="Lena Park" color="purple" />} trailing={<Badge color="success">Active</Badge>} />
    </List>
  ),
};

/** A bordered box, here for settings in small size. */
export const Card: Story = {
  render: () => (
    <List variant="card" size="sm">
      <ListItem title="Email updates" description="A weekly summary" trailing={<Switch aria-label="Email updates" defaultChecked />} />
      <ListItem title="Push notifications" description="Mentions and replies" trailing={<Switch aria-label="Push notifications" />} />
    </List>
  ),
};
