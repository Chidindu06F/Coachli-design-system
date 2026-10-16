import figma from '@figma/code-connect';
import { Alert } from '@chidindu06f/coachli-react';

figma.connect(Alert, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=9975-179', {
  props: {
    type: figma.enum('Type', { Information: 'information', Success: 'success', Warning: 'warning', Error: 'error' }),
    variant: figma.enum('Style', { Soft: 'soft', Outline: 'outline', Filled: 'filled' }),
    layout: figma.enum('Layout', { Inline: 'inline', Banner: 'banner' }),
    size: figma.enum('Size', { Medium: 'md', Small: 'sm' }),
    description: figma.boolean('Show description', { true: 'Add a short description.', false: undefined }),
  },
  example: (props) => <Alert title="Alert title" {...props} />,
});
