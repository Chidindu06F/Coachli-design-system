import figma from '@figma/code-connect';
import { ProgressBar, ProgressCircle } from '@chidindu06f/coachli-react';

figma.connect(ProgressBar, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10224-28', {
  example: () => <ProgressBar />,
});

figma.connect(ProgressCircle, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10224-103', {
  example: () => <ProgressCircle />,
});

figma.connect(ProgressBar, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10224-1004', {
  example: () => <ProgressBar />,
});
