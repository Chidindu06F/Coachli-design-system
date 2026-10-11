import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RichTextEditor, RichTextEditorField } from './RichTextEditor';

const sample =
  '<h2>Release notes</h2><p>This update makes sharing <b>faster</b> and <i>simpler</i>.</p><ul><li>Share a link with anyone</li><li>See who opened it</li></ul>';

const meta = {
  title: 'Components/Rich text editor',
  component: RichTextEditor,
  subcomponents: { RichTextEditorField },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A writing area with a formatting toolbar, built on the browser\'s own editing support so it needs no extra packages. Content comes out as HTML through `onChange` or the ref\'s `getHTML()`; sanitise it on the server before showing it to others. Links only accept http, https and mailto addresses. Hide toolbar groups with `tools`.',
      },
    },
  },
  args: { defaultValue: sample, 'aria-label': 'Release notes' },
  decorators: [(Story) => <div style={{ maxWidth: 560 }}><Story /></div>],
} satisfies Meta<typeof RichTextEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Render(args) {
    const [html, setHtml] = useState(args.defaultValue ?? '');
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <RichTextEditor {...args} onChange={setHtml} />
        <details>
          <summary>HTML</summary>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>{html}</pre>
        </details>
      </div>
    );
  },
};

/** With a label, hint and character count. */
export const WithField: Story = {
  render: () => <RichTextEditorField label="Description" hint="Shown on the project page." maxLength={500} defaultValue="" placeholder="Describe the project" />,
};

/** Only the basic formatting tools. */
export const Minimal: Story = { args: { defaultValue: '', tools: { textStyle: false, blocks: false, insert: false }, minHeight: 96 } };

/** Error and disabled. */
export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <RichTextEditor aria-label="Notes" defaultValue="<p>Too short.</p>" invalid minHeight={64} />
      <RichTextEditor aria-label="Notes" defaultValue="<p>Read only for now.</p>" disabled minHeight={64} />
    </div>
  ),
};
