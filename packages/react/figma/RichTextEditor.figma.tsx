import figma from '@figma/code-connect';
import { RichTextEditor, RichTextEditorField } from '@chidindu06f/coachli-react';

figma.connect(RichTextEditor, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10187-24316', {
  example: () => <RichTextEditor />,
});

figma.connect(RichTextEditorField, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10187-24531', {
  example: () => <RichTextEditorField />,
});
