import figma from '@figma/code-connect';
import { SegmentedControl } from '@chidindu06f/coachli-react';

figma.connect(SegmentedControl, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10238-28210', {
  example: () => <SegmentedControl />,
});
