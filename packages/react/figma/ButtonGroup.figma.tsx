import figma from '@figma/code-connect';
import { ButtonGroup } from '@halo-ds/react';

figma.connect(ButtonGroup, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=9916-367', {
  example: () => <ButtonGroup />,
});
