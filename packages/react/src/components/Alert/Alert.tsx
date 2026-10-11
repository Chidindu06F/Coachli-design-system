import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { Icon } from '../../internal/Icon';
import type { IconName } from '../../internal/iconPaths';
import { CompactButton } from '../CompactButton';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import styles from './Alert.module.css';

export type AlertType = 'information' | 'success' | 'warning' | 'error';

export const STATUS_ICONS: Record<AlertType, IconName> = {
  information: 'Info',
  success: 'CheckCircle',
  warning: 'Warning',
  error: 'WarningCircle',
};

/** Parts you can style with `classNames` and `styles`. */
export type AlertPart = 'root' | 'icon' | 'body' | 'text' | 'title' | 'description' | 'actions' | 'close';

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, PartsProps<AlertPart> {
  /** Sets the colour and default icon. Figma: Type. */
  type?: AlertType;
  /** soft is tinted, outline is white with a coloured icon, filled is solid colour. Figma: Style. */
  variant?: 'soft' | 'outline' | 'filled';
  /** inline stacks the text in a box; banner is one row across the top of a page. Figma: Layout. */
  layout?: 'inline' | 'banner';
  /** Figma: Size. */
  size?: 'md' | 'sm';
  /** Figma: Title. */
  title: ReactNode;
  /** Supporting text. Figma: Description. */
  description?: ReactNode;
  /** Replaces the type icon, or false to hide it. Figma: L icon. */
  icon?: ReactNode | false;
  /** Buttons, usually one small secondary Button. Figma: Actions. */
  actions?: ReactNode;
  /** Shows a close button and calls this when it is pressed. Figma: Show close. */
  onClose?: () => void;
  closeLabel?: string;
}

/**
 * A message about the page or a task, like an error to fix or a new version to load.
 * Errors and warnings are announced straight away; others are announced politely.
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { type = 'information', variant = 'soft', layout = 'inline', size = 'md', title, description, icon, actions, onClose, closeLabel = 'Dismiss', className, classNames, styles: partStyles, ...rest },
  ref,
) {
  const part = parts<AlertPart>('alert', { classNames, styles: partStyles });
  return (
    <div
      ref={ref}
      role={type === 'error' || type === 'warning' ? 'alert' : 'status'}
      {...rest}
      {...part('root', [styles.alert, styles[type], styles[variant], styles[layout], styles[size], className], rest.style)}
    >
      {icon !== false && (
        <span {...part('icon', styles.icon)} aria-hidden="true">
          {icon ?? <Icon name={STATUS_ICONS[type]} />}
        </span>
      )}
      <div {...part('body', styles.body)}>
        <div {...part('text', styles.text)}>
          <div {...part('title', styles.title)}>{title}</div>
          {description && <div {...part('description', styles.description)}>{description}</div>}
        </div>
        {actions && <div {...part('actions', styles.actions)}>{actions}</div>}
      </div>
      {onClose && (
        <CompactButton variant="ghost" size={size === 'sm' ? 'md' : 'lg'} aria-label={closeLabel} {...part('close', styles.close)} onClick={onClose}>
          <Icon name="X" />
        </CompactButton>
      )}
    </div>
  );
});
