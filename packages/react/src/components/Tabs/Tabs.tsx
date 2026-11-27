import { createContext, forwardRef, useContext, useId, useRef } from 'react';
import type { HTMLAttributes, KeyboardEvent, ReactNode } from 'react';
import { useControllable } from '../../internal/useControllable';
import { Badge } from '../Badge';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import styles from './Tabs.module.css';

interface TabsContext {
  id: string;
  value: string | undefined;
  select: (value: string) => void;
  vertical: boolean;
  part: ReturnType<typeof parts<TabsPart>>;
}
const Ctx = createContext<TabsContext | null>(null);
const useTabs = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('Tab, TabList and TabPanel must be inside <Tabs>.');
  return c;
};
const safe = (v: string) => v.replace(/[^\w-]/g, '_');

/** Parts you can style with `classNames` and `styles` on Tabs. Every Tab, TabList and TabPanel picks them up. */
export type TabsPart = 'root' | 'list' | 'tab' | 'icon' | 'label' | 'panel';

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'>, PartsProps<TabsPart> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** line has an underline; pill has a grey pill. Figma: Style. */
  variant?: 'line' | 'pill';
  /** 32 or 40px tall. Figma: Size. */
  size?: 'sm' | 'md';
  /** horizontal, fullWidth (tabs share the width) or vertical (list on the left). Figma: Layout. */
  layout?: 'horizontal' | 'fullWidth' | 'vertical';
}

/**
 * Switches between views in the same place. Arrow keys move between tabs and show the panel;
 * Home and End jump to the ends.
 */
export function Tabs({ value, defaultValue, onValueChange, variant = 'line', size = 'md', layout = 'horizontal', className, classNames, styles: partStyles, children, ...rest }: TabsProps) {
  const id = useId();
  const part = parts<TabsPart>('tabs', { classNames, styles: partStyles });
  const [current, select] = useControllable<string | undefined>(value, defaultValue, onValueChange as (v: string | undefined) => void);
  return (
    <Ctx.Provider value={{ id, value: current, select, vertical: layout === 'vertical', part }}>
      <div {...rest} {...part('root', [styles.tabs, styles[variant], styles[size], styles[layout], className], rest.style)}>
        {children}
      </div>
    </Ctx.Provider>
  );
}

export interface TabListProps extends HTMLAttributes<HTMLDivElement> {
  /** Names the set of tabs for screen readers. */
  'aria-label'?: string;
}

/** Holds the Tab buttons. */
export function TabList({ className, children, ...rest }: TabListProps) {
  const { vertical, part } = useTabs();
  const list = useRef<HTMLDivElement | null>(null);
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const tabs = [...(list.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)') ?? [])];
    const at = tabs.indexOf(document.activeElement as HTMLButtonElement);
    if (at < 0) return;
    const next = { [vertical ? 'ArrowDown' : 'ArrowRight']: at + 1, [vertical ? 'ArrowUp' : 'ArrowLeft']: at - 1, Home: 0, End: tabs.length - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    const tab = tabs[(next + tabs.length) % tabs.length];
    tab?.focus();
    tab?.click();
  };
  return (
    <div ref={list} role="tablist" aria-orientation={vertical ? 'vertical' : 'horizontal'} onKeyDown={onKey} {...rest} {...part('list', [styles.list, className], rest.style)}>
      {children}
    </div>
  );
}

export interface TabProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'value'> {
  value: string;
  /** Icon before the label. Figma: L icon. */
  icon?: ReactNode;
  /** A count or short label after the text. Figma: Badge. */
  badge?: ReactNode;
  disabled?: boolean;
}

export const Tab = forwardRef<HTMLButtonElement, TabProps>(function Tab({ value, icon, badge, disabled, className, children, onClick, ...rest }, ref) {
  const { id, value: current, select, part } = useTabs();
  const selected = current === value;
  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      id={`${id}-tab-${safe(value)}`}
      aria-selected={selected}
      aria-controls={`${id}-panel-${safe(value)}`}
      tabIndex={selected ? 0 : -1}
      disabled={disabled}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) select(value);
      }}
      {...rest}
      {...part('tab', [styles.tab, selected && styles.selected, className], rest.style)}
    >
      <span className={styles.content}>
        {icon && <span {...part('icon', styles.icon)} aria-hidden="true">{icon}</span>}
        <span {...part('label', styles.label)}>{children}</span>
        {badge !== undefined && (typeof badge === 'number' || typeof badge === 'string' ? <Badge size="xs" count={typeof badge === 'number' ? badge : undefined}>{typeof badge === 'string' ? badge : undefined}</Badge> : badge)}
      </span>
    </button>
  );
});

export interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  /** Keep the panel in the page when hidden, to save its state. */
  keepMounted?: boolean;
}

/** The content for one Tab. Only the selected panel shows. */
export function TabPanel({ value, keepMounted, className, children, ...rest }: TabPanelProps) {
  const { id, value: current, part } = useTabs();
  const selected = current === value;
  if (!selected && !keepMounted) return null;
  return (
    <div
      role="tabpanel"
      id={`${id}-panel-${safe(value)}`}
      aria-labelledby={`${id}-tab-${safe(value)}`}
      hidden={!selected}
      tabIndex={0}
      {...rest}
      {...part('panel', [styles.panel, className], rest.style)}
    >
      {children}
    </div>
  );
}
