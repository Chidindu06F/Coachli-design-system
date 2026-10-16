import figma from '@figma/code-connect';
import { Menu } from '@chidindu06f/coachli-react';

figma.connect(Menu, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10071-72', {
  example: () => <Menu />,
});
