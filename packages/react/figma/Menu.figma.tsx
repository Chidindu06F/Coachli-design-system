import figma from '@figma/code-connect';
import { Menu } from '@halo-ds/react';

figma.connect(Menu, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=10071-72', {
  example: () => <Menu />,
});
