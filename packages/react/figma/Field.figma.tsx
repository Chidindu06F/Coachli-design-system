import figma from '@figma/code-connect';
import { FieldLabel } from '@chidindu06f/coachli-react';

figma.connect(FieldLabel, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10048-681', {
  example: () => <FieldLabel />,
});
