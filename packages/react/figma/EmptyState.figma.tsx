import figma from '@figma/code-connect';
import { EmptyState } from '@halo-ds/react';

figma.connect(EmptyState, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=10019-74', {
  example: () => <EmptyState />,
});
