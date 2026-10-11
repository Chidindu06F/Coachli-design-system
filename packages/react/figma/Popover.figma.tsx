import figma from '@figma/code-connect';
import { Popover } from '@halo-ds/react';

figma.connect(Popover, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=10218-187', {
  example: () => <Popover />,
});
