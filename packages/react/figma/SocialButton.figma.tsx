import figma from '@figma/code-connect';
import { SocialButton } from '@chidindu06f/coachli-react';

figma.connect(SocialButton, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=9760-2787', {
  example: () => <SocialButton />,
});
