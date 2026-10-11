import figma from '@figma/code-connect';
import { Modal } from '@halo-ds/react';

figma.connect(Modal, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=9953-139', {
  example: () => <Modal />,
});
