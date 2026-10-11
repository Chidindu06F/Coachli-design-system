import figma from '@figma/code-connect';
import { Carousel } from '@halo-ds/react';

figma.connect(Carousel, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=10356-108', {
  example: () => <Carousel />,
});
