import figma from '@figma/code-connect';
import { TableCell, TableHeaderCell } from '@halo-ds/react';

figma.connect(TableHeaderCell, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=10160-46', {
  example: () => <TableHeaderCell />,
});

figma.connect(TableCell, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=10160-477', {
  example: () => <TableCell />,
});
