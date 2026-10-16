import figma from '@figma/code-connect';
import { QRCode } from '@chidindu06f/coachli-react';

figma.connect(QRCode, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10525-100', {
  example: () => <QRCode />,
});
