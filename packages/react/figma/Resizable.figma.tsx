import figma from '@figma/code-connect';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@chidindu06f/coachli-react';

figma.connect(ResizableHandle, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10608-170', {
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
