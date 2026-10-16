import figma from '@figma/code-connect';
import { AccordionItem } from '@chidindu06f/coachli-react';

figma.connect(AccordionItem, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=9815-16', {
  example: () => <AccordionItem />,
});
