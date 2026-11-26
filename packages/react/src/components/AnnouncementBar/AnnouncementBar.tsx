import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import styles from './AnnouncementBar.module.css';

/** Parts you can style with `classNames` and `styles`. */
export type AnnouncementBarPart = 'root' | 'message' | 'title' | 'action';

export interface AnnouncementBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, PartsProps<AnnouncementBarPart> {
  /** The event name, in bold at the start, like "Coachli Creator Summit 2026". */
  title?: ReactNode;
  /** The date, like "Thu 26 Nov". Shown after the title, separated by " · ". Nothing else goes here. */
  children?: ReactNode;
  /** One optional link, usually a small LinkButton. Figma: Show link. */
  action?: ReactNode;
  /** Stays at the top of its scroll container while the page scrolls. On by default. */
  sticky?: boolean;
  /** Name read by screen readers for this region. */
  label?: string;
}

/**
 * A full-width dark bar at the very top of the app, for news about all of Coachli, like an upcoming Coachli event.
 * It has no close button: show it until the event is over. Always dark, in light and dark mode.
 * Keep the message (title and date) to 60 characters. It never runs past two lines; anything longer is cut with "…".
 */
export const AnnouncementBar = forwardRef<HTMLDivElement, AnnouncementBarProps>(function AnnouncementBar(
  { title, children, action, sticky = true, label = 'Announcement', className, classNames, styles: partStyles, style, ...rest },
  ref,
) {
  const part = parts<AnnouncementBarPart>('announcement-bar', { classNames, styles: partStyles });
  return (
    <div
      ref={ref}
      role="region"
      aria-label={label}
      // Always the dark theme, whatever the page uses.
      data-theme="dark"
      {...part('root', [styles.bar, sticky && styles.sticky, className], style)}
      {...rest}
    >
      <p {...part('message', styles.message)}>
        {title && <strong {...part('title', styles.title)}>{title}</strong>}
        {title && children ? ' · ' : null}
        {children}
      </p>
      {action && <span {...part('action', styles.action)}>{action}</span>}
    </div>
  );
});
