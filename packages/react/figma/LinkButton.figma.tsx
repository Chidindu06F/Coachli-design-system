import figma from '@figma/code-connect';
import { LinkButton } from '@halo-ds/react';

figma.connect(LinkButton, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=9792-2301', {
  example: () => <LinkButton />,
});
