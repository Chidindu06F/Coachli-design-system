import figma from '@figma/code-connect';
import { TimePicker, TimePickerField } from '@chidindu06f/coachli-react';

figma.connect(TimePicker, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10351-336', {
  example: () => <TimePicker />,
});

figma.connect(TimePickerField, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10351-589', {
  example: () => <TimePickerField />,
});
