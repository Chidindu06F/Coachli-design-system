import figma from '@figma/code-connect';
import { Modal } from '@chidindu06f/coachli-react';

figma.connect(Modal, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=9953-139', {
  example: () => <Modal />,
});
