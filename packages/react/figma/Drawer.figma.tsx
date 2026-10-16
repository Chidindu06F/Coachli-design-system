import figma from '@figma/code-connect';
import { Drawer } from '@chidindu06f/coachli-react';

figma.connect(Drawer, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=9965-212', {
  example: () => <Drawer />,
});
