import figma from '@figma/code-connect';
import { Rating } from '@chidindu06f/coachli-react';

figma.connect(Rating, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10354-627', {
  example: () => <Rating />,
});
