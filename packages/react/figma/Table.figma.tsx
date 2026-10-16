import figma from '@figma/code-connect';
import { Checkbox, TableCell, TableExpandedRow, TableExpandToggle, TableHeaderCell } from '@chidindu06f/coachli-react';

figma.connect(TableHeaderCell, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10160-46', {
  props: {
    label: figma.string('Label'),
    align: figma.enum('Align', { Left: 'left', Right: 'right' }),
    sort: figma.enum('Sort', { Unsorted: 'none', Ascending: 'ascending', Descending: 'descending' }),
    filter: figma.boolean('Filter', { true: <Checkbox size="sm" label="Active" />, false: undefined }),
  },
  example: ({ label, ...props }) => <TableHeaderCell {...props}>{label}</TableHeaderCell>,
});

figma.connect(TableCell, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10160-477', {
  variant: { Type: 'Expand' },
  example: () => (
    <TableCell checkbox>
      <TableExpandToggle expanded={false} onToggle={() => {}} />
    </TableCell>
  ),
});

figma.connect(TableCell, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10160-477', {
  example: () => <TableCell />,
});
