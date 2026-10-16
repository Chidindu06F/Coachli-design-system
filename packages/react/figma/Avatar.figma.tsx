import figma from '@figma/code-connect';
import { Avatar, AvatarGroup, AvatarStatus } from '@chidindu06f/coachli-react';

figma.connect(Avatar, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=9848-261', {
  example: () => <Avatar />,
});

figma.connect(AvatarStatus, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=9853-131', {
  example: () => <AvatarStatus />,
});

figma.connect(AvatarGroup, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=9854-411', {
  example: () => <AvatarGroup />,
});
