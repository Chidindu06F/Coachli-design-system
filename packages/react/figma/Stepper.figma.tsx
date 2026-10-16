import figma from '@figma/code-connect';
import { Stepper } from '@chidindu06f/coachli-react';

figma.connect(Stepper, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10212-296', {
  example: () => <Stepper />,
});
