import figma from '@figma/code-connect';
import { Skeleton } from '@halo-ds/react';

figma.connect(Skeleton, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=10194-19', {
  example: () => <Skeleton />,
});
