import figma from '@figma/code-connect';
import { Button, FormActions, FormSection, InputField } from '@halo-ds/react';

figma.connect(FormSection, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=10613-27', {
  props: {
    title: figma.string('Title'),
    description: figma.boolean('Show description', { true: figma.string('Description'), false: undefined }),
  },
  example: (props) => (
    <FormSection {...props}>
      <InputField name="email" label="Email" required />
    </FormSection>
  ),
});

figma.connect(FormActions, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=10613-117', {
  props: { divider: figma.enum('Divider', { On: true }) },
  example: (props) => (
    <FormActions {...props}>
      <Button variant="secondary" type="reset">Cancel</Button>
      <Button type="submit">Save</Button>
    </FormActions>
  ),
});
