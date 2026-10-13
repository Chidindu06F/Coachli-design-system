import figma from '@figma/code-connect';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@halo-ds/react';

figma.connect(ResizableHandle, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=10608-170', {
  props: {
    withHandle: figma.boolean('Grip'),
    direction: figma.enum('Direction', { Horizontal: 'horizontal', Vertical: 'vertical' }),
  },
  example: ({ withHandle, direction }) => (
    <ResizablePanelGroup direction={direction}>
      <ResizablePanel defaultSize={30} minSize={20}>Sidebar</ResizablePanel>
      <ResizableHandle withHandle={withHandle} aria-label="Resize sidebar" />
      <ResizablePanel>Content</ResizablePanel>
    </ResizablePanelGroup>
  ),
});
