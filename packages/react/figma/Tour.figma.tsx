import figma from '@figma/code-connect';
import { Tour } from '@halo-ds/react';

figma.connect(Tour, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=10529-940', {
  example: () => <Tour />,
});
