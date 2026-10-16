import figma from '@figma/code-connect';
import { EventCalendar } from '@chidindu06f/coachli-react';

figma.connect(EventCalendar, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10535-667', {
  example: () => <EventCalendar />,
});
