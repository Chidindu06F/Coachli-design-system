import figma from '@figma/code-connect';
import { BarChart, LineChart, PieChart, Sparkline } from '@halo-ds/react';

figma.connect(BarChart, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=10438-445', {
  example: () => <BarChart />,
});

figma.connect(LineChart, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=10439-422', {
  example: () => <LineChart />,
});

figma.connect(PieChart, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=10440-335', {
  example: () => <PieChart />,
});

figma.connect(Sparkline, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=10440-344', {
  example: () => <Sparkline />,
});
