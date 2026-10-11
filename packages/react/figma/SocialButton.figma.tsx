import figma from '@figma/code-connect';
import { SocialButton } from '@halo-ds/react';

figma.connect(SocialButton, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=9760-2787', {
  example: () => <SocialButton />,
});
