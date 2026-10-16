import figma from '@figma/code-connect';
import { Divider } from '@chidindu06f/coachli-react';

figma.connect(Divider, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10006-47', {
  example: () => <Divider />,
});
