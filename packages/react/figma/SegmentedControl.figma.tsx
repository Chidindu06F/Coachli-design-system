import figma from '@figma/code-connect';
import { SegmentedControl } from '@halo-ds/react';

figma.connect(SegmentedControl, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=10238-28210', {
  example: () => <SegmentedControl />,
});
