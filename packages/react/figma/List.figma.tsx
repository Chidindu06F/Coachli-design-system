import figma from '@figma/code-connect';
import { List, ListItem } from '@halo-ds/react';

figma.connect(ListItem, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=10033-136', {
  example: () => <ListItem />,
});

figma.connect(List, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=10034-328', {
  example: () => <List />,
});
