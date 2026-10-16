import figma from '@figma/code-connect';
import { FileItem, FileUpload } from '@chidindu06f/coachli-react';

figma.connect(FileUpload, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10024-84', {
  example: () => <FileUpload />,
});

figma.connect(FileItem, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10025-160', {
  example: () => <FileItem />,
});
