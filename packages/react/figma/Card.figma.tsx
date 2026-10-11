import figma from '@figma/code-connect';
import { Card } from '@halo-ds/react';

figma.connect(Card, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=9925-73', {
  example: () => <Card />,
});
