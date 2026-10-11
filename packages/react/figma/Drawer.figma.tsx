import figma from '@figma/code-connect';
import { Drawer } from '@halo-ds/react';

figma.connect(Drawer, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=9965-212', {
  example: () => <Drawer />,
});
