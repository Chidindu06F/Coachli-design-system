import figma from '@figma/code-connect';
import { ColorField, ColorPicker, ColorSwatch } from '@halo-ds/react';

figma.connect(ColorSwatch, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=9943-51', {
  example: () => <ColorSwatch />,
});

figma.connect(ColorField, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=9944-170', {
  example: () => <ColorField />,
});

figma.connect(ColorPicker, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=9944-145', {
  example: () => <ColorPicker />,
});
