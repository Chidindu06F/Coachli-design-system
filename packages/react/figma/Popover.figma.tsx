import figma from '@figma/code-connect';
import { Popover } from '@chidindu06f/coachli-react';

figma.connect(Popover, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10218-187', {
  example: () => <Popover />,
});
