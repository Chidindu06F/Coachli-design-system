import figma from '@figma/code-connect';
import { List, ListItem } from '@chidindu06f/coachli-react';

figma.connect(ListItem, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10033-136', {
  example: () => <ListItem />,
});

figma.connect(List, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10034-328', {
  example: () => <List />,
});
