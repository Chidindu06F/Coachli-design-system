import figma from '@figma/code-connect';
import { EventCalendar } from '@halo-ds/react';

figma.connect(EventCalendar, 'https://www.figma.com/design/LVZSmXHpIl0qR5fKYzzLrK/Halo?node-id=10535-667', {
  example: () => <EventCalendar />,
});
