import figma from '@figma/code-connect';
import { Tab, Tabs } from '@chidindu06f/coachli-react';

figma.connect(Tab, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10174-217', {
  example: () => <Tab />,
});

figma.connect(Tabs, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10179-23875', {
  example: () => <Tabs />,
});
