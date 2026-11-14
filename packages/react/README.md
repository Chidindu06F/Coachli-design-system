# @chidindu06f/coachli-react

React components for the Halo design system, with light and dark mode, built on the `@chidindu06f/coachli-tokens` CSS variables.

```bash
npm install @chidindu06f/coachli-react @chidindu06f/coachli-tokens @fontsource/geist
```

Load the tokens, the component styles and the font once, at the top of your app:

```tsx
import '@chidindu06f/coachli-tokens/css';
import '@chidindu06f/coachli-react/styles.css';
import '@fontsource/geist/400.css';
import '@fontsource/geist/600.css';
import '@fontsource/geist/700.css';
```

Then use the components:

```tsx
import { Button, Modal, EmptyState, Illustration } from '@chidindu06f/coachli-react';

export function Projects() {
  return (
    <EmptyState
      media={<Illustration name="no-projects" />}
      title="Start your first project"
      description="Projects keep your files, tasks and people in one place."
      actions={<Button>Create project</Button>}
    />
  );
}
```

Set `data-theme` on `<html>` to `light`, `dark` or `system`.

## Docs

Every component, with live examples and props: https://chidindu06f.github.io/Coachli-design-system/

## License

MIT
