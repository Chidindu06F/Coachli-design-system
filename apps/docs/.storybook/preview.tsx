import type { Preview } from '@storybook/react-vite';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import '@fontsource/geist/400.css';
import '@fontsource/geist/600.css';
import '@fontsource/geist/700.css';
import '@halo-ds/tokens/css';
// Styles for docs pages that use the built package, like Theming.
import '@halo-ds/react/styles.css';
import './preview.css';

const preview: Preview = {
  decorators: [
    withThemeByDataAttribute({
      themes: { Light: 'light', Dark: 'dark' },
      defaultTheme: 'Light',
      attributeName: 'data-theme',
    }),
  ],
  parameters: {
    backgrounds: { disable: true },
    a11y: { test: 'todo' },
    options: {
      storySort: { order: ['Introduction', 'Theming', 'Customising', 'Foundations', ['Colors', 'Palette', 'Typography', 'Spacing & Radius', 'Grid & Layout', 'Illustrations', 'Awards'], 'Components'] },
    },
  },
};

export default preview;
