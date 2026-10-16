import figma from '@figma/code-connect';
import { Slider } from '@chidindu06f/coachli-react';

figma.connect(Slider, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10199-96', {
  example: () => <Slider />,
});

figma.connect(Slider, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10200-55', {
  example: () => <Slider />,
});
