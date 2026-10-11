import figma from '@figma/code-connect';
import { Overlay } from '@halo-ds/react';

figma.connect(Overlay, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=9957-107', {
  example: () => <Overlay />,
});
