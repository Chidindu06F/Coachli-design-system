import figma from '@figma/code-connect';
import { Stepper } from '@halo-ds/react';

figma.connect(Stepper, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=10212-296', {
  example: () => <Stepper />,
});
