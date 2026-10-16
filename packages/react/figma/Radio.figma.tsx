import figma from '@figma/code-connect';
import { Radio, RadioGroup } from '@chidindu06f/coachli-react';

figma.connect(Radio, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10150-46', {
  example: () => <Radio />,
});

figma.connect(Radio, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10150-415', {
  example: () => <Radio />,
});

figma.connect(RadioGroup, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10150-1398', {
  example: () => <RadioGroup />,
});
