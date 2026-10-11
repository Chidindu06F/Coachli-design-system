import figma from '@figma/code-connect';
import { Toast } from '@halo-ds/react';

figma.connect(Toast, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=9990-219', {
  example: () => <Toast />,
});
