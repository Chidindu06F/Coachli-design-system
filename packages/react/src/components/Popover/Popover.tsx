import { useEffect, useId, useRef } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { Portal, useDismiss, useFloating } from '../../internal/floating';
import type { Align, Side } from '../../internal/floating';
import { Icon } from '../../internal/Icon';
import { cloneTrigger } from '../../internal/trigger';
import { useControllable } from '../../internal/useControllable';
import { CompactButton } from '../CompactButton';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import styles from './Popover.module.css';

/** Parts you can style with `classNames` and `styles`. */
export type PopoverPart = 'root' | 'arrow' | 'panel' | 'header' | 'title' | 'description' | 'close' | 'content' | 'actions';

export interface PopoverProps extends PartsProps<PopoverPart> {
  /** The element that opens the popover, like a Button. */
  trigger: ReactElement;
  /** Which side of the trigger it opens on. Flips when there is no room. Figma: Placement. */
  side?: Side;
  /** How it lines up with the trigger along that side. */
  align?: Align;
  /** Shows the arrow pointing at the trigger. Figma: Placement=None hides it. */
  arrow?: boolean;
  /** Figma: Title. */
  title?: ReactNode;
  /** Figma: Description. */
  description?: ReactNode;
  /** Shows a close button. Figma: Close. */
  showClose?: boolean;
  /** Buttons at the bottom right. Figma: Actions. */
  actions?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** The body. Figma: Content slot. */
  children?: ReactNode;
  className?: string;
}

/** A small panel that opens next to what people clicked. Escape or a click outside closes it. */
export function Popover({
  trigger,
  side = 'bottom',
  align = 'center',
  arrow = true,
  title,
  description,
  showClose = true,
  actions,
  open,
  defaultOpen = false,
  onOpenChange,
  children,
  className,
  classNames,
  styles: partStyles,
}: PopoverProps) {
  const part = parts<PopoverPart>('popover', { classNames, styles: partStyles });
  const id = useId();
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const anchor = useRef<HTMLElement | null>(null);
  const { floating, style, side: placed } = useFloating(anchor, isOpen, { side, align, gap: arrow ? 2 : 4 });
  const close = () => {
    setOpen(false);
    anchor.current?.focus();
  };
  useDismiss(isOpen, close, [anchor, floating]);

  // Move focus into the panel when it opens.
  useEffect(() => {
    if (!isOpen) return;
    const f = floating.current;
    const first = f?.querySelector<HTMLElement>('input, select, textarea, button, [href], [tabindex]:not([tabindex="-1"])');
    (first ?? f)?.focus();
  }, [isOpen, floating]);

  const interactive = Boolean(actions) || showClose;
  return (
    <>
      {cloneTrigger(trigger, { ref: anchor, open: isOpen, id, haspopup: 'dialog', onToggle: () => setOpen(!isOpen) })}
      {isOpen && (
        <Portal>
          <div
            ref={floating}
            id={id}
            role={interactive ? 'dialog' : undefined}
            aria-labelledby={title ? `${id}-title` : undefined}
            tabIndex={-1}
            {...part('root', [styles.popover, arrow && styles.withArrow, className], style)}
            data-side={placed}
          >
            {arrow && <span {...part('arrow', styles.arrow)} aria-hidden="true" />}
            <div {...part('panel', styles.panel)}>
              {(title || showClose) && (
                <div {...part('header', styles.header)}>
                  <div className={styles.headText}>
                    {title && <div id={`${id}-title`} {...part('title', styles.title)}>{title}</div>}
                    {description && <div {...part('description', styles.description)}>{description}</div>}
                  </div>
                  {showClose && (
                    <CompactButton variant="ghost" aria-label="Close" {...part('close')} onClick={close}>
                      <Icon name="X" />
                    </CompactButton>
                  )}
                </div>
              )}
              {children && <div {...part('content', styles.content)}>{children}</div>}
              {actions && <div {...part('actions', styles.actions)}>{actions}</div>}
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}
