import figma from '@figma/code-connect';
import { ImagePlaceholder } from '@chidindu06f/coachli-react';

figma.connect(ImagePlaceholder, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=11685-1743', {
  props: {
    ratio: figma.enum('Ratio', {
      '16:9': '16:9',
      '4:3': '4:3',
      '1:1': '1:1',
      'Small pattern': 'small-pattern',
      'Small logo': 'small-logo',
    }),
  },
  example: ({ ratio }) => <ImagePlaceholder ratio={ratio} />,
});
