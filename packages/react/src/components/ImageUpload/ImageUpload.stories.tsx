import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ImageUpload } from './ImageUpload';

const meta = {
  title: 'Components/Image upload',
  component: ImageUpload,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A round image with an Upload button. Once there is an image, the buttons become Change and a red Remove. Use `kind="business"` for logos and `layout="compact"` where there is no room for a title and hint.',
      },
    },
  },
  args: { onFile: () => {}, kind: 'person', layout: 'default' },
  decorators: [(Story) => <div style={{ maxWidth: 400 }}><Story /></div>],
} satisfies Meta<typeof ImageUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Pick an image to see it switch to Change and Remove. */
export const Playground: Story = {
  render: function Render(args) {
    const [src, setSrc] = useState<string | undefined>();
    return <ImageUpload {...args} src={src} onFile={(f) => setSrc(URL.createObjectURL(f))} onRemove={() => setSrc(undefined)} />;
  },
};

/** Every Figma variant: Layout × Kind × State. */
export const Variants: Story = {
  render: (args) => {
    const photo = 'avatars/photo-03.jpg';
    return (
      <div style={{ display: 'grid', gap: 24 }}>
        <ImageUpload {...args} kind="person" />
        <ImageUpload {...args} kind="person" src={photo} onRemove={() => {}} />
        <ImageUpload {...args} kind="business" />
        <ImageUpload {...args} kind="business" src={photo} onRemove={() => {}} />
        <ImageUpload {...args} layout="compact" kind="person" />
        <ImageUpload {...args} layout="compact" kind="business" src={photo} onRemove={() => {}} />
      </div>
    );
  },
};
