import figma from '@figma/code-connect';
import { RichTextEditor, RichTextEditorField } from '@halo-ds/react';

figma.connect(RichTextEditor, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=10187-24316', {
  example: () => <RichTextEditor />,
});

figma.connect(RichTextEditorField, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=10187-24531', {
  example: () => <RichTextEditorField />,
});
