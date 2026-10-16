import figma from '@figma/code-connect';
import { EmptyState } from '@chidindu06f/coachli-react';

figma.connect(EmptyState, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10019-74', {
  example: () => <EmptyState />,
});
