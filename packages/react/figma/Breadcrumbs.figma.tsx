import figma from '@figma/code-connect';
import { Breadcrumbs } from '@halo-ds/react';

figma.connect(Breadcrumbs, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=9903-7409', {
  example: () => <Breadcrumbs />,
});
