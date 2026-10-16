import figma from '@figma/code-connect';
import { TableExpandedRow } from '@chidindu06f/coachli-react';

figma.connect(TableExpandedRow, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10612-90411', {
  example: () => <TableExpandedRow colSpan={5}>Details</TableExpandedRow>,
});
