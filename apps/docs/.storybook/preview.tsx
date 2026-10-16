import type { Preview } from '@storybook/react-vite';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@chidindu06f/coachli-tokens/css';
// Styles for docs pages that use the built package, like Theming.
import '@chidindu06f/coachli-react/styles.css';
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
