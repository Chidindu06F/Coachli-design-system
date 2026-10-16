import figma from '@figma/code-connect';
import { LinkButton } from '@chidindu06f/coachli-react';

figma.connect(LinkButton, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=9792-2301', {
  example: () => <LinkButton />,
});
