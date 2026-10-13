import { useState } from 'react';
import type { Key } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DotsThree, DownloadSimple, FunnelSimple, MagnifyingGlass, Plus, Trash } from '@phosphor-icons/react';
import { Avatar } from '../Avatar';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { CompactButton } from '../CompactButton';
import { Input } from '../Input';
import { DataTable, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, TableToolbar } from './Table';
import type { DataTableColumn } from './Table';

interface Member {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Invited';
  projects: number;
}

const first = ['Ada', 'Kofi', 'Lena', 'Mateo', 'Nia', 'Omar', 'Priya', 'Sam', 'Tomas', 'Yara', 'Zoe', 'Ines'];
const last = ['Obi', 'Mensah', 'Park', 'Silva', 'Brown', 'Haddad', 'Rao', 'Lee'];
const members: Member[] = Array.from({ length: 37 }, (_, i) => {
  const name = `${first[i % first.length]} ${last[i % last.length]}`;
  return { id: i + 1, name, email: `${name.split(' ')[0]!.toLowerCase()}${i}@example.com`, role: i % 4 === 0 ? 'Admin' : 'Editor', status: i % 5 === 0 ? 'Invited' : 'Active', projects: (i * 7) % 23 };
});

const columns: DataTableColumn<Member>[] = [
  {
    key: 'name',
    header: 'Name',
    sortable: true,
    render: (m) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Avatar size="sm" name={m.name} color={m.id % 2 ? 'purple' : 'neutral'} />
        <div>
          <div>{m.name}</div>
          <div style={{ color: 'var(--halo-text-secondary)', fontSize: 'var(--halo-font-size-sm)' }}>{m.email}</div>
        </div>
      </div>
    ),
  },
  { key: 'role', header: 'Role', sortable: true },
  { key: 'status', header: 'Status', sortable: true, render: (m) => <Badge size="sm" color={m.status === 'Active' ? 'success' : 'neutral'}>{m.status}</Badge> },
  { key: 'projects', header: 'Projects', sortable: true, numeric: true },
  {
    key: 'actions',
    header: <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}>Actions</span>,
    align: 'right',
    width: 64,
    render: (m) => (
      <CompactButton variant="ghost" size="md" aria-label={`More for ${m.name}`}>
        <DotsThree />
      </CompactButton>
    ),
  },
];

const meta = {
  title: 'Components/Table',
  component: Table,
  subcomponents: { DataTable, TableToolbar, TableHeaderCell, TableCell },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Use `Table` with `TableHead`, `TableRow`, `TableHeaderCell` and `TableCell` for full control, or `DataTable` for loaded data with sorting, row selection and paging built in. Sortable headers are buttons that set `aria-sort`. Wide tables scroll sideways.',
      },
    },
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Sorting, selection, a toolbar that changes when rows are selected, and paging. */
export const Data: Story = {
  render: function Render() {
    const [selected, setSelected] = useState<Key[]>([]);
    return (
      <DataTable
        columns={columns}
        rows={members}
        getRowId={(m) => m.id}
        selectable
        selected={selected}
        onSelectedChange={setSelected}
        toolbar={
          <TableToolbar
            title="Team members"
            description="Manage who can see and edit projects."
            selectedCount={selected.length}
            onClearSelection={() => setSelected([])}
            bulkActions={
              <>
                <Button variant="secondary" size="sm" iconLeft={<DownloadSimple />}>Export</Button>
                <Button variant="destructive" size="sm" iconLeft={<Trash />}>Remove</Button>
              </>
            }
            actions={
              <>
                <Input size="sm" aria-label="Search members" placeholder="Search" iconLeft={<MagnifyingGlass />} />
                <Button variant="secondary" size="sm" iconLeft={<FunnelSimple />}>Filter</Button>
                <Button size="sm" iconLeft={<Plus />}>Invite</Button>
              </>
            }
          />
        }
      />
    );
  },
};

/** Built by hand, in small size. */
export const Simple: Story = {
  render: () => (
    <Table size="sm" caption="Monthly usage">
      <TableHead>
        <tr>
          <TableHeaderCell>Month</TableHeaderCell>
          <TableHeaderCell align="right">Visits</TableHeaderCell>
          <TableHeaderCell align="right">Sign ups</TableHeaderCell>
        </tr>
      </TableHead>
      <TableBody>
        {[['January', 12840, 312], ['February', 14210, 355], ['March', 16975, 401]].map(([m, v, s]) => (
          <TableRow key={m}>
            <TableCell>{m}</TableCell>
            <TableCell numeric>{v!.toLocaleString()}</TableCell>
            <TableCell numeric>{s}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

/** Filters in the Role and Status headers, and rows that open to show details. */
export const FiltersAndExpandableRows: Story = {
  render: () => (
    <DataTable
      columns={columns.map((c) =>
        c.key === 'role'
          ? { ...c, filters: [{ value: 'Admin', label: 'Admin' }, { value: 'Editor', label: 'Editor' }] }
          : c.key === 'status'
            ? { ...c, filters: [{ value: 'Active', label: 'Active' }, { value: 'Invited', label: 'Invited' }] }
            : c,
      )}
      rows={members}
      getRowId={(m) => m.id}
      pageSize={5}
      expandable={{
        render: (m) => (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', justifyContent: 'start', gap: '4px 48px', font: '14px/22px var(--halo-font-family-body)' }}>
            <span style={{ color: 'var(--halo-text-secondary)' }}>Email</span>
            <span style={{ color: 'var(--halo-text-secondary)' }}>Projects</span>
            <span style={{ color: 'var(--halo-text-secondary)' }}>Joined</span>
            <span>{m.email}</span>
            <span>{m.projects}</span>
            <span>{`${(m.id % 28) + 1} Mar 2026`}</span>
          </div>
        ),
        rowExpandable: (m) => m.status === 'Active',
      }}
    />
  ),
};

/** The header stays while rows scroll, and the first column stays while the table scrolls sideways. */
export const StickyHeaderAndColumn: Story = {
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <Table stickyHeader stickyFirstColumn maxHeight={280} style={{ minWidth: 820 }}>
        <TableHead>
          <tr>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>Role</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell align="right">Projects</TableHeaderCell>
          </tr>
        </TableHead>
        <TableBody>
          {members.slice(0, 15).map((m) => (
            <TableRow key={m.id}>
              <TableCell style={{ whiteSpace: 'nowrap' }}>{m.name}</TableCell>
              <TableCell>{m.email}</TableCell>
              <TableCell>{m.role}</TableCell>
              <TableCell>{m.status}</TableCell>
              <TableCell numeric>{m.projects}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
};
