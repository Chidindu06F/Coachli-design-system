import figma from '@figma/code-connect';
import { Text } from '@chidindu06f/coachli-react';

figma.connect(Text, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=9823-53', {
  example: () => <Text />,
});
