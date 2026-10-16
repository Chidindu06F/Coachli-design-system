import figma from '@figma/code-connect';
import { Carousel } from '@chidindu06f/coachli-react';

figma.connect(Carousel, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10356-108', {
  example: () => <Carousel />,
});
