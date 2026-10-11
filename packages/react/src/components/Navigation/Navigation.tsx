import { createContext, forwardRef, useContext } from 'react';
import type { AnchorHTMLAttributes, HTMLAttributes, MouseEventHandler, ReactNode, Ref } from 'react';
import { Icon } from '../../internal/Icon';
import { useControllable } from '../../internal/useControllable';
import { Badge } from '../Badge';
import { CompactButton } from '../CompactButton';
import { Tooltip } from '../Tooltip';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import styles from './Navigation.module.css';

type NavType = 'sidebar' | 'collapsed' | 'top';
const NavCtx = createContext<NavType>('sidebar');

/** Parts you can style with `classNames` and `styles` on NavItem. */
export type NavItemPart = 'root' | 'icon' | 'label' | 'chevron';

export interface NavItemProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'onClick'>, PartsProps<NavItemPart> {
  /** Figma: Label. */
  children: ReactNode;
  /** Figma: L icon. Needed in a collapsed Sidebar. */
  icon?: ReactNode;
  /** A count or short label at the end. Figma: Badge. */
  badge?: ReactNode;
  /** Shows a caret for items that open a group. Pass the open state. Figma: Chevron. */
  expanded?: boolean;
  /** The page people are on. Figma: State=Selected. */
  selected?: boolean;
  disabled?: boolean;
  /** Renders a button instead of a link when there is no href. */
  onClick?: MouseEventHandler<HTMLElement>;
}

/** A link in a Sidebar or TopBar. In a collapsed Sidebar it shows only the icon, with the label as a tooltip. */
export const NavItem = forwardRef<HTMLElement, NavItemProps>(function NavItem(
  { children, icon, badge, expanded, selected, disabled, href, onClick, className, classNames, styles: partStyles, ...rest },
  ref,
) {
  const part = parts<NavItemPart>('nav-item', { classNames, styles: partStyles });
  const type = useContext(NavCtx);
  const collapsed = type === 'collapsed';
  const body = (
    <>
      {icon && <span {...part('icon', styles.icon)} aria-hidden="true">{icon}</span>}
      <span {...part('label', collapsed ? styles.srOnly : styles.label)}>{children}</span>
      {!collapsed && badge !== undefined && (typeof badge === 'number' ? <Badge size="xs" count={badge} /> : typeof badge === 'string' ? <Badge size="xs">{badge}</Badge> : badge)}
      {!collapsed && expanded !== undefined && <Icon name="CaretDown" {...part('chevron', [styles.chevron, expanded && styles.chevronOpen])} />}
    </>
  );
  const common = {
    ...part('root', [styles.item, type === 'collapsed' && styles.typeCollapsed, type === 'top' && styles.typeTop, selected && styles.selected, disabled && styles.disabled, className], rest.style),
    'aria-current': selected ? ('page' as const) : undefined,
    'aria-expanded': expanded,
  };
  const el =
    href && !disabled ? (
      <a ref={ref as Ref<HTMLAnchorElement>} href={href} onClick={onClick} {...rest} {...common}>
        {body}
      </a>
    ) : (
      <button ref={ref as Ref<HTMLButtonElement>} type="button" disabled={disabled} onClick={onClick} {...common}>
        {body}
      </button>
    );
  return collapsed ? (
    <Tooltip content={children} side="right">
      {el}
    </Tooltip>
  ) : (
    el
  );
});

/* ---------- Sidebar ---------- */

/** Parts you can style with `classNames` and `styles` on Sidebar. */
export type SidebarPart = 'root' | 'header' | 'brand' | 'collapse' | 'items' | 'footer' | 'divider' | 'user';

export interface SidebarProps extends HTMLAttributes<HTMLElement>, PartsProps<SidebarPart> {
  /** Logo or workspace name at the top. */
  header?: ReactNode;
  /** NavItems below the main ones, like Settings and Help. */
  footer?: ReactNode;
  /** The signed-in person, below a divider. */
  user?: ReactNode;
  /** Shows only icons. Figma: Layout=Collapsed. */
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  /** Pass to show a collapse button in the header. */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Screen reader name for the navigation landmark. */
  'aria-label'?: string;
}

/** The main app navigation down the left side. Children are NavItems. */
export function Sidebar({
  header,
  footer,
  user,
  collapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  className,
  classNames,
  styles: partStyles,
  children,
  'aria-label': label = 'Main',
  ...rest
}: SidebarProps) {
  const part = parts<SidebarPart>('sidebar', { classNames, styles: partStyles });
  const [isCollapsed, setCollapsed] = useControllable(collapsed, defaultCollapsed, onCollapsedChange);
  const toggle = onCollapsedChange || collapsed === undefined;
  return (
    <NavCtx.Provider value={isCollapsed ? 'collapsed' : 'sidebar'}>
      <nav aria-label={label} {...rest} {...part('root', [styles.sidebar, isCollapsed && styles.isCollapsed, className], rest.style)}>
        {(header || toggle) && (
          <div {...part('header', styles.sidebarHeader)}>
            {!isCollapsed && header && <div {...part('brand', styles.brand)}>{header}</div>}
            {toggle && (
              <CompactButton {...part('collapse')} variant="ghost" aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} aria-expanded={!isCollapsed} onClick={() => setCollapsed(!isCollapsed)}>
                <Icon name="SidebarSimple" />
              </CompactButton>
            )}
          </div>
        )}
        <div {...part('items', styles.items)}>{children}</div>
        <div className={styles.spacer} />
        {footer && <div {...part('footer', styles.items)}>{footer}</div>}
        {user && (
          <>
            <hr {...part('divider', styles.divider)} />
            <div {...part('user', styles.user)}>{user}</div>
          </>
        )}
      </nav>
    </NavCtx.Provider>
  );
}

/* ---------- Top bar ---------- */

/** Parts you can style with `classNames` and `styles` on TopBar. */
export type TopBarPart = 'root' | 'menu' | 'brand' | 'links' | 'actions';

export interface TopBarProps extends HTMLAttributes<HTMLElement>, PartsProps<TopBarPart> {
  /** Logo or product name on the left. */
  logo?: ReactNode;
  /** Search, notifications and the account menu on the right. */
  actions?: ReactNode;
  /** Shows a menu button on small screens, where the links are hidden. Figma: Layout=Mobile. */
  onMenuClick?: () => void;
  'aria-label'?: string;
}

/** A bar across the top of the app. Children are NavItems; they hide on small screens. */
export function TopBar({ logo, actions, onMenuClick, className, classNames, styles: partStyles, children, 'aria-label': label = 'Main', ...rest }: TopBarProps) {
  const part = parts<TopBarPart>('top-bar', { classNames, styles: partStyles });
  return (
    <NavCtx.Provider value="top">
      <header {...rest} {...part('root', [styles.topBar, className], rest.style)}>
        {onMenuClick && (
          <CompactButton variant="ghost" aria-label="Open menu" {...part('menu', styles.menuButton)} onClick={onMenuClick}>
            <Icon name="List" />
          </CompactButton>
        )}
        {logo && <div {...part('brand', styles.brand)}>{logo}</div>}
        {children && (
          <nav aria-label={label} {...part('links', styles.links)}>
            {children}
          </nav>
        )}
        <div className={styles.spacer} />
        {actions && <div {...part('actions', styles.actions)}>{actions}</div>}
      </header>
    </NavCtx.Provider>
  );
}
