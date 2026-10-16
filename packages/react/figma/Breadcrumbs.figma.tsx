import figma from '@figma/code-connect';
import { Breadcrumbs } from '@chidindu06f/coachli-react';

figma.connect(Breadcrumbs, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=9903-7409', {
  example: () => <Breadcrumbs />,
});
