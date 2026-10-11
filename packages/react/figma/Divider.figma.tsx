import figma from '@figma/code-connect';
import { Divider } from '@halo-ds/react';

figma.connect(Divider, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=10006-47', {
  example: () => <Divider />,
});
