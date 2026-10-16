import figma from '@figma/code-connect';
import { ColorField, ColorPicker, ColorSwatch } from '@chidindu06f/coachli-react';

figma.connect(ColorSwatch, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=9943-51', {
  example: () => <ColorSwatch />,
});

figma.connect(ColorField, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=9944-170', {
  example: () => <ColorField />,
});

figma.connect(ColorPicker, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=9944-145', {
  example: () => <ColorPicker />,
});
