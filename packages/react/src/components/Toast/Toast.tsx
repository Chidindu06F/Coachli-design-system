import { createContext, forwardRef, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { Portal } from '../../internal/floating';
import { Icon } from '../../internal/Icon';
import { CompactButton } from '../CompactButton';
import { STATUS_ICONS } from '../Alert/Alert';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import styles from './Toast.module.css';

export type ToastType = 'neutral' | 'information' | 'success' | 'warning' | 'error';

/** Parts you can style with `classNames` and `styles`. */
export type ToastPart = 'root' | 'icon' | 'body' | 'text' | 'title' | 'description' | 'actions' | 'close';

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, PartsProps<ToastPart> {
  /** Sets the icon colour and default icon. Neutral has no icon unless you pass one. Figma: Type. */
  type?: ToastType;
  /** default is white; inverse is dark and stands out more. Figma: Style. */
  variant?: 'default' | 'inverse';
  /** Figma: Title. */
  title: ReactNode;
  /** Figma: Description. */
  description?: ReactNode;
  /** Replaces the type icon, or false to hide it. Figma: L icon. */
  icon?: ReactNode | false;
  /** Small buttons, like Undo. Figma: Actions. */
  actions?: ReactNode;
  /** Shows a close button. Figma: Show close. */
  onClose?: () => void;
  closeLabel?: string;
}

/** A short message about something that just happened. Use `useToast` to show one. */
export const Toast = forwardRef<HTMLDivElement, ToastProps>(function Toast(
  { type = 'neutral', variant = 'default', title, description, icon, actions, onClose, closeLabel = 'Dismiss', className, classNames, styles: partStyles, ...rest },
  ref,
) {
  const part = parts<ToastPart>('toast', { classNames, styles: partStyles });
  const shownIcon = icon === false ? null : icon ?? (type === 'neutral' ? null : <Icon name={STATUS_ICONS[type]} />);
  return (
    <div ref={ref} {...rest} {...part('root', [styles.toast, styles[type], styles[variant], className], rest.style)}>
      {shownIcon && <span {...part('icon', styles.icon)} aria-hidden="true">{shownIcon}</span>}
      <div {...part('body', styles.body)}>
        <div {...part('text', styles.text)}>
          <div {...part('title', styles.title)}>{title}</div>
          {description && <div {...part('description', styles.description)}>{description}</div>}
        </div>
        {actions && <div {...part('actions', styles.actions)}>{actions}</div>}
      </div>
      {onClose && (
        <CompactButton variant="ghost" aria-label={closeLabel} {...part('close', styles.close)} onClick={onClose}>
          <Icon name="X" />
        </CompactButton>
      )}
    </div>
  );
});

/* ---------- Showing toasts ---------- */

export interface ToastOptions extends Omit<ToastProps, 'onClose' | 'ref' | 'id'> {
  /** Milliseconds before it closes on its own. 0 keeps it open. Defaults to 5000, or 8000 with actions. */
  duration?: number;
  /** Shows a close button. Defaults to true. */
  dismissible?: boolean;
}

interface Entry extends ToastOptions {
  id: number;
}

interface ToastApi {
  /** Shows a toast and returns its id. */
  toast: (options: ToastOptions) => number;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

/** Parts of the toast stack you can style with `classNames` and `styles` on ToastProvider. */
export type ToastRegionPart = 'root' | 'list' | 'item';

export interface ToastProviderProps extends PartsProps<ToastRegionPart> {
  children: ReactNode;
  /** Corner of the screen the toasts stack in. */
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center' | 'top-right' | 'top-left' | 'top-center';
  /** Most toasts shown at once. Older ones close first. */
  limit?: number;
}

/** Wrap the app once. Toasts stack in a corner and are read out by screen readers. */
export function ToastProvider({ children, position = 'bottom-right', limit = 3, classNames, styles: partStyles }: ToastProviderProps) {
  const part = parts<ToastRegionPart>('toast-region', { classNames, styles: partStyles });
  const [entries, setEntries] = useState<Entry[]>([]);
  const next = useRef(1);
  const dismiss = useCallback((id: number) => setEntries((list) => list.filter((e) => e.id !== id)), []);
  const toast = useCallback(
    (options: ToastOptions) => {
      const id = next.current++;
      setEntries((list) => [...list, { ...options, id }].slice(-limit));
      return id;
    },
    [limit],
  );
  const api = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);
  return (
    <ToastContext.Provider value={api}>
      {children}
      <Portal>
        <section aria-label="Notifications" {...part('root', [styles.region, styles[position]])}>
          <ol {...part('list', styles.list)}>
            {entries.map((e) => (
              <ToastItem key={e.id} entry={e} onDismiss={() => dismiss(e.id)} part={part} />
            ))}
          </ol>
        </section>
      </Portal>
    </ToastContext.Provider>
  );
}

function ToastItem({ entry, onDismiss, part }: { entry: Entry; onDismiss: () => void; part: ReturnType<typeof parts<ToastRegionPart>> }) {
  const { id: _id, duration, dismissible = true, ...props } = entry;
  const wait = duration ?? (props.actions ? 8000 : 5000);
  const [paused, setPaused] = useState(false);
  const latest = useRef(onDismiss);
  latest.current = onDismiss;
  useEffect(() => {
    if (!wait || paused) return;
    const t = setTimeout(() => latest.current(), wait);
    return () => clearTimeout(t);
  }, [wait, paused]);
  const urgent = props.type === 'error' || props.type === 'warning';
  return (
    <li
      {...part('item', styles.item)}
      role={urgent ? 'alert' : 'status'}
      aria-live={urgent ? 'assertive' : 'polite'}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <Toast {...props} onClose={dismissible ? onDismiss : undefined} />
    </li>
  );
}

/** Returns `toast(options)` and `dismiss(id)`. Needs a ToastProvider above it. */
export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) throw new Error('useToast needs a <ToastProvider> above it.');
  return api;
}
