import figma from '@figma/code-connect';
import { NavItem, Sidebar, TopBar } from '@halo-ds/react';

figma.connect(NavItem, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=10232-224', {
  example: () => <NavItem />,
});

figma.connect(Sidebar, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=10233-277', {
  example: () => <Sidebar />,
});

figma.connect(TopBar, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=10233-407', {
  example: () => <TopBar />,
});
