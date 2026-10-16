import figma from '@figma/code-connect';
import { Pagination } from '@chidindu06f/coachli-react';

figma.connect(Pagination, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10163-6623', {
  example: () => <Pagination />,
});
