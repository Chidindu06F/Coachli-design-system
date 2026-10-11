import figma from '@figma/code-connect';
import { Pagination } from '@halo-ds/react';

figma.connect(Pagination, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=10163-6623', {
  example: () => <Pagination />,
});
