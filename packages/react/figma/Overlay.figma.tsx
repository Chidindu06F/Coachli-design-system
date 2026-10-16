import figma from '@figma/code-connect';
import { Overlay } from '@chidindu06f/coachli-react';

figma.connect(Overlay, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=9957-107', {
  example: () => <Overlay />,
});
