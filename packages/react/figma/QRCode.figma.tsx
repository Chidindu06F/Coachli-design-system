import figma from '@figma/code-connect';
import { QRCode } from '@halo-ds/react';

figma.connect(QRCode, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=10525-100', {
  example: () => <QRCode />,
});
