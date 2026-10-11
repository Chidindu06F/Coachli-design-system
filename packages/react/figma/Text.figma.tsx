import figma from '@figma/code-connect';
import { Text } from '@halo-ds/react';

figma.connect(Text, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=9823-53', {
  example: () => <Text />,
});
