import figma from '@figma/code-connect';
import { Tooltip } from '@halo-ds/react';

figma.connect(Tooltip, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=9842-32', {
  example: () => <Tooltip />,
});
