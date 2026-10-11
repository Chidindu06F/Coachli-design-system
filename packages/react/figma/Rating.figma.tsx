import figma from '@figma/code-connect';
import { Rating } from '@halo-ds/react';

figma.connect(Rating, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=10354-627', {
  example: () => <Rating />,
});
