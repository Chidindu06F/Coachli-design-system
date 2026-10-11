import figma from '@figma/code-connect';
import { TimePicker, TimePickerField } from '@halo-ds/react';

figma.connect(TimePicker, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=10351-336', {
  example: () => <TimePicker />,
});

figma.connect(TimePickerField, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=10351-589', {
  example: () => <TimePickerField />,
});
