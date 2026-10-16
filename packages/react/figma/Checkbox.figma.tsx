import figma from '@figma/code-connect';
import { Checkbox, CheckboxGroup } from '@chidindu06f/coachli-react';

figma.connect(Checkbox, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=9935-66', {
  example: () => <Checkbox />,
});

figma.connect(Checkbox, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=9936-40', {
  example: () => <Checkbox />,
});

figma.connect(CheckboxGroup, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=9936-87', {
  example: () => <CheckboxGroup />,
});
