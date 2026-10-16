import figma from '@figma/code-connect';
import { Skeleton } from '@chidindu06f/coachli-react';

figma.connect(Skeleton, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10194-19', {
  example: () => <Skeleton />,
});
