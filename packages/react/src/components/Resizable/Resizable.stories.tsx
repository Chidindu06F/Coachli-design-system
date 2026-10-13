import type { CSSProperties, ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './Resizable';

const meta = {
  title: 'Components/Resizable',
  component: ResizablePanelGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Panels people resize by dragging the line between them, like a file list beside a preview. Each `ResizablePanel` takes a `defaultSize`, `minSize` and `maxSize` in percent. Handles work with the keyboard too: focus one with Tab, then use the arrow keys, Home and End. Save the layout with `onLayout` to restore it next time.',
      },
    },
  },
  args: { direction: 'horizontal', children: null },
} satisfies Meta<typeof ResizablePanelGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const frame: CSSProperties = { height: 280, border: '1px solid var(--halo-border-secondary)', borderRadius: 16, overflow: 'hidden', background: 'var(--halo-surface-primary)' };
const Fill = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', font: '600 14px/20px var(--halo-font-family-label)', color: 'var(--halo-text-secondary)' }}>{children}</div>
);

/** Two panels side by side. */
export const Horizontal: Story = {
  render: () => (
    <div style={frame}>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={30} minSize={20}>
          <Fill>Sidebar</Fill>
        </ResizablePanel>
        <ResizableHandle aria-label="Resize sidebar" />
        <ResizablePanel>
          <Fill>Content</Fill>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

/** With a grip, so the handle is easy to spot. */
export const WithGrip: Story = {
  render: () => (
    <div style={frame}>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50}>
          <Fill>One</Fill>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>
          <Fill>Two</Fill>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

/** Stacked, and nested: a top area over a split bottom. */
export const VerticalAndNested: Story = {
  render: () => (
    <div style={{ ...frame, height: 360 }}>
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel defaultSize={40}>
          <Fill>Header</Fill>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={25}>
              <Fill>Files</Fill>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
              <Fill>Editor</Fill>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={25}>
              <Fill>Preview</Fill>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};
