import figma from '@figma/code-connect';
import { Tour } from '@chidindu06f/coachli-react';

figma.connect(Tour, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10529-940', {
  example: () => <Tour />,
});
