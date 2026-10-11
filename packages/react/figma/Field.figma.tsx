import figma from '@figma/code-connect';
import { FieldLabel } from '@halo-ds/react';

figma.connect(FieldLabel, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=10048-681', {
  example: () => <FieldLabel />,
});
