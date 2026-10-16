import figma from '@figma/code-connect';
import { ButtonGroup } from '@chidindu06f/coachli-react';

figma.connect(ButtonGroup, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=9916-367', {
  example: () => <ButtonGroup />,
});
