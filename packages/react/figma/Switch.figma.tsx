import figma from '@figma/code-connect';
import { Switch } from '@chidindu06f/coachli-react';

figma.connect(Switch, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10155-48', {
  example: () => <Switch />,
});

figma.connect(Switch, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10155-21680', {
  example: () => <Switch />,
});
