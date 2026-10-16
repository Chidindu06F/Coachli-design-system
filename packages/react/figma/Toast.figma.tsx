import figma from '@figma/code-connect';
import { Toast } from '@chidindu06f/coachli-react';

figma.connect(Toast, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=9990-219', {
  example: () => <Toast />,
});
