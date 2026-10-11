import figma from '@figma/code-connect';
import { Textarea, TextareaField } from '@halo-ds/react';

figma.connect(Textarea, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=10126-319', {
  example: () => <Textarea />,
});

figma.connect(TextareaField, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=10126-470', {
  example: () => <TextareaField />,
});
