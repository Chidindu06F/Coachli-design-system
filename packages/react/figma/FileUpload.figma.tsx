import figma from '@figma/code-connect';
import { FileItem, FileUpload } from '@halo-ds/react';

figma.connect(FileUpload, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=10024-84', {
  example: () => <FileUpload />,
});

figma.connect(FileItem, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=10025-160', {
  example: () => <FileItem />,
});
