import figma from '@figma/code-connect';
import { LoadingIndicator, Spinner } from '@chidindu06f/coachli-react';

figma.connect(Spinner, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10206-64', {
  example: () => <Spinner />,
});

figma.connect(LoadingIndicator, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10207-28', {
  example: () => <LoadingIndicator />,
});
