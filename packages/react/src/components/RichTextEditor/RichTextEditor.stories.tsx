import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RichTextEditor, RichTextEditorField } from './RichTextEditor';

const sample =
  '<h2>Release notes</h2><p>This update makes sharing <b>faster</b> and <i>simpler</i>.</p><ul><li>Share a link with anyone</li><li>See who opened it</li></ul>';

// Pretend upload for the examples: waits a second, then shows your own file. Names starting with "fail-" fail.
const demoUpload = (file: File) =>
  new Promise<string>((resolve, reject) =>
    setTimeout(() => (file.name.startsWith('fail-') ? reject(new Error('Upload failed')) : resolve(URL.createObjectURL(file))), 1000),
  );

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
          'A writing area with a formatting toolbar, built on the browser\'s own editing support so it needs no extra packages. Content comes out as HTML through `onChange` or the ref\'s `getHTML()`; sanitise it on the server before showing it to others. Hide toolbar groups with `tools`.\n\n**Links:** highlight text and click the link button, or add a link with its own text. `coachli.co` becomes `https://coachli.co` and email addresses become `mailto:` links; anything else shows "Enter a valid link.". With the caret in a link, the button edits or removes it.\n\n**Images:** pass `onImageUpload(file)` (upload the file, resolve with its URL) to get an Upload tab and to upload pasted or dropped images. The image shows faded until the upload finishes, and is removed if it fails (`onImageUploadError`). Without it, images are added by link only. `maxImageSize` defaults to 10 MB.\n\n**Pasting** keeps only the toolbar\'s formatting: headings, bold, italic, underline, strikethrough, lists, quotes, code, links and images. Fonts, colours and sizes are dropped.',
      },
    },
  },
  args: { defaultValue: sample, 'aria-label': 'Release notes', onImageUpload: demoUpload },
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

/**
 * Links, uploads and pasting. The upload here is pretend: it waits a second and shows your own file.
 * Pick "fail-" at the start of a file name to see a failed upload.
 */
export const LinksAndImages: Story = {
  render: function Render() {
    const [html, setHtml] = useState('');
    const [message, setMessage] = useState('');
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <RichTextEditor
          aria-label="Event description"
          defaultValue='<p>Book a call on <a href="https://coachli.co/johndoe">our booking page</a>. Paste text from any website, or drop an image here.</p>'
          onChange={setHtml}
          onImageUpload={demoUpload}
          onImageUploadError={(file, error) => setMessage(`${file.name}: ${error instanceof Error ? error.message : 'upload failed'}`)}
        />
        {message && <p style={{ margin: 0, color: 'var(--halo-state-error-primary)' }}>{message}</p>}
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
  render: () => <RichTextEditorField label="Description" hint="Shown on the project page." maxLength={500} defaultValue="" placeholder="Describe the project" onImageUpload={demoUpload} />,
};

/** Only the basic formatting tools. */
/** Small, for phones: tighter padding, and the toolbar scrolls sideways in one row. */
export const Small: Story = {
  render: () => (
    <div style={{ width: 343 }}>
      <RichTextEditorField label="Notes" size="sm" defaultValue={sample} maxLength={2000} onImageUpload={demoUpload} />
    </div>
  ),
};

/** Without `onImageUpload`, images can only be added by link. */
export const ImagesByLinkOnly: Story = { args: { onImageUpload: undefined, defaultValue: '' } };

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
