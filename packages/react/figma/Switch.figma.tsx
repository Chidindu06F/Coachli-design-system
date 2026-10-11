import figma from '@figma/code-connect';
import { Switch } from '@halo-ds/react';

figma.connect(Switch, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=10155-48', {
  example: () => <Switch />,
});

figma.connect(Switch, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=10155-21680', {
  example: () => <Switch />,
});
