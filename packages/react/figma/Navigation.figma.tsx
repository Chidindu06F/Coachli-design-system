import figma from '@figma/code-connect';
import { NavItem, Sidebar, TopBar } from '@chidindu06f/coachli-react';

figma.connect(NavItem, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10232-224', {
  example: () => <NavItem />,
});

figma.connect(Sidebar, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10233-277', {
  props: {
    collapsed: figma.enum('Layout', { Expanded: false, Collapsed: true }),
    beforeFooter: figma.boolean('Show footer', { true: <div>{/* e.g. the Coach / Customer role switch */}</div>, false: undefined }),
    reportBug: figma.boolean('Show report a bug', { true: <NavItem onClick={() => {}}>Report a bug</NavItem>, false: undefined }),
    logOut: figma.boolean('Show log out', { true: <NavItem onClick={() => {}}>Log out</NavItem>, false: undefined }),
    user: figma.boolean('Show user', { true: <div>{/* signed-in person */}</div>, false: undefined }),
  },
  example: ({ collapsed, beforeFooter, reportBug, logOut, user }) => (
    <Sidebar
      collapsed={collapsed}
      beforeFooter={beforeFooter}
      footer={
        <>
          {reportBug}
          {logOut}
        </>
      }
      user={user}
    >
      {/* NavItems */}
    </Sidebar>
  ),
});

figma.connect(TopBar, 'https://www.figma.com/design/fNq8x9qbF4yYA6ixgwdGVR/COACHLI-DESIGN-SYSTEM?node-id=10233-407', {
  example: () => <TopBar />,
});
