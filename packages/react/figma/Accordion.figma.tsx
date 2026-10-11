import figma from '@figma/code-connect';
import { AccordionItem } from '@halo-ds/react';

figma.connect(AccordionItem, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=9815-16', {
  example: () => <AccordionItem />,
});
