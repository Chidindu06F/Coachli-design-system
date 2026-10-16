import figma from '@figma/code-connect';
import { Card } from '@chidindu06f/coachli-react';

figma.connect(Card, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=9925-73', {
  example: () => <Card />,
});
