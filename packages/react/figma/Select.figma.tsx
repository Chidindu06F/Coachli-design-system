import figma from '@figma/code-connect';
import { Combobox, Select, SelectField } from '@chidindu06f/coachli-react';

const options = [
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
];

figma.connect(Select, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10080-232', {
  example: () => <Select />,
});

figma.connect(SelectField, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10080-16127', {
  example: () => <SelectField />,
});

figma.connect(Combobox, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10101-3233', {
  props: {
    placeholder: figma.string('Placeholder'),
    multiple: figma.enum('Type', { Multiple: true }),
    size: figma.enum('Size', { Small: 'sm', Medium: 'md', Large: 'lg' }),
    invalid: figma.enum('State', { Error: true }),
    disabled: figma.enum('State', { Disabled: true }),
  },
  example: (props) => <Combobox options={options} {...props} />,
});
