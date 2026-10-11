import figma from '@figma/code-connect';
import { Combobox, Select, SelectField } from '@halo-ds/react';

figma.connect(Select, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=10080-232', {
  example: () => <Select />,
});

figma.connect(SelectField, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=10080-16127', {
  example: () => <SelectField />,
});

figma.connect(Combobox, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=10101-3233', {
  example: () => <Combobox />,
});
