import figma from '@figma/code-connect';
import { Slider } from '@halo-ds/react';

figma.connect(Slider, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=10199-96', {
  example: () => <Slider />,
});

figma.connect(Slider, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=10200-55', {
  example: () => <Slider />,
});
