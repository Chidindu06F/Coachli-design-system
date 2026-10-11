import { useEffect, useId, useRef } from 'react';
import type { KeyboardEvent, ReactElement, ReactNode } from 'react';
import { Portal, useDismiss, useFloating } from '../../internal/floating';
import type { Align, Side } from '../../internal/floating';
import { Icon } from '../../internal/Icon';
import { cloneTrigger } from '../../internal/trigger';
import { useControllable } from '../../internal/useControllable';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import styles from './Menu.module.css';

export interface MenuAction {
  type?: 'item';
  label: ReactNode;
  /** Icon before the label. Figma: L icon. */
  icon?: ReactNode;
  /** A keyboard shortcut shown on the right, like "⌘E". Figma: Shortcut. */
  shortcut?: string;
  /** Red label for actions that delete or can't be undone. Figma: Type=Destructive. */
  destructive?: boolean;
  /** Check mark and semibold label, for a chosen option like a sort order. Figma: State=Selected. */
  selected?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
}
export interface MenuSeparator {
  type: 'separator';
}
export interface MenuLabel {
  type: 'label';
  label: ReactNode;
}
export type MenuEntry = MenuAction | MenuSeparator | MenuLabel;

/** Parts you can style with `classNames` and `styles`. */
export type MenuPart = 'root' | 'item' | 'icon' | 'label' | 'shortcut' | 'check' | 'separator' | 'groupLabel';

export interface MenuProps extends PartsProps<MenuPart> {
  /** The element that opens the menu, like a "more" CompactButton. */
  trigger: ReactElement;
  items: MenuEntry[];
  side?: Side;
  align?: Align;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Screen reader name for the menu. */
  'aria-label'?: string;
  className?: string;
}

const isAction = (e: MenuEntry): e is MenuAction => !e.type || e.type === 'item';

/** A list of actions that opens from a button. Arrow keys move, Enter chooses, Escape closes. */
export function Menu({ trigger, items, side = 'bottom', align = 'start', open, defaultOpen = false, onOpenChange, className, classNames, styles: partStyles, ...rest }: MenuProps) {
  const part = parts<MenuPart>('menu', { classNames, styles: partStyles });
  const id = useId();
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const anchor = useRef<HTMLElement | null>(null);
  const { floating, style } = useFloating(anchor, isOpen, { side, align });
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const close = (refocus = true) => {
    setOpen(false);
    if (refocus) anchor.current?.focus();
  };
  useDismiss(isOpen, () => close(false), [anchor, floating]);

  const enabled = items.map((e, i) => (isAction(e) && !e.disabled ? i : -1)).filter((i) => i >= 0);
  const focusAt = (i: number | undefined) => i !== undefined && itemRefs.current[i]?.focus();

  useEffect(() => {
    if (isOpen) focusAt(enabled[0]);
  }, [isOpen]);

  const onKey = (e: KeyboardEvent) => {
    const current = itemRefs.current.findIndex((el) => el === document.activeElement);
    const at = enabled.indexOf(current);
    if (e.key === 'ArrowDown') focusAt(enabled[(at + 1) % enabled.length]);
    else if (e.key === 'ArrowUp') focusAt(enabled[(at - 1 + enabled.length) % enabled.length]);
    else if (e.key === 'Home') focusAt(enabled[0]);
    else if (e.key === 'End') focusAt(enabled[enabled.length - 1]);
    else if (e.key === 'Tab') close(false);
    else return;
    e.preventDefault();
  };

  return (
    <>
      {cloneTrigger(trigger, { ref: anchor, open: isOpen, id, haspopup: 'menu', onToggle: () => setOpen(!isOpen) })}
      {isOpen && (
        <Portal>
          <div ref={floating} id={id} role="menu" aria-label={rest['aria-label']} {...part('root', [styles.menu, className], style)} onKeyDown={onKey}>
            {items.map((entry, i) => {
              if (entry.type === 'separator') return <div key={i} role="separator" {...part('separator', styles.separator)} />;
              if (entry.type === 'label') return <div key={i} {...part('groupLabel', styles.groupLabel)}>{entry.label}</div>;
              return (
                <div
                  key={i}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  role={entry.selected !== undefined ? 'menuitemradio' : 'menuitem'}
                  aria-checked={entry.selected}
                  aria-disabled={entry.disabled || undefined}
                  tabIndex={-1}
                  {...part('item', [styles.item, entry.destructive && styles.destructive, entry.selected && styles.selected])}
                  onClick={() => {
                    if (entry.disabled) return;
                    entry.onSelect?.();
                    close();
                  }}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && !entry.disabled) {
                      e.preventDefault();
                      entry.onSelect?.();
                      close();
                    }
                  }}
                >
                  {entry.icon && <span {...part('icon', styles.icon)} aria-hidden="true">{entry.icon}</span>}
                  <span {...part('label', styles.itemLabel)}>{entry.label}</span>
                  {entry.shortcut && <span {...part('shortcut', styles.shortcut)}>{entry.shortcut}</span>}
                  {entry.selected && <Icon name="Check" {...part('check', styles.check)} />}
                </div>
              );
            })}
          </div>
        </Portal>
      )}
    </>
  );
}
