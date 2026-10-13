import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { Icon } from '../../internal/Icon';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import { Illustration } from '../Illustration';
import type { IllustrationName } from '../Illustration';
import styles from './Result.module.css';

export type ResultStatus = 'success' | 'error' | 'warning' | 'information' | 'not-found' | 'no-access' | 'server-error' | 'offline' | 'maintenance';

/** Parts you can style with `classNames` and `styles`. */
export type ResultPart = 'root' | 'media' | 'icon' | 'text' | 'title' | 'description' | 'content' | 'actions';

export interface ResultProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, PartsProps<ResultPart> {
  /**
   * What happened. Success, error, warning and information show an icon in a circle; the rest show an illustration.
   * Ant Design's 404, 403 and 500 are `not-found`, `no-access` and `server-error`. Figma: Status.
   */
  status: ResultStatus;
  /** Figma: Title. */
  title: ReactNode;
  /** One or two sentences: what it means and what to do next. Figma: Description. */
  description?: ReactNode;
  /** Buttons, like Back to overview. The first should be the way forward. Figma: Actions. */
  actions?: ReactNode;
  /** Details under the text, like a receipt or a list of what failed. Figma: Content. */
  children?: ReactNode;
  /** Replaces the status icon or illustration. */
  icon?: ReactNode;
  /** md for a full page, sm inside a card or a dialog. Figma: Size. */
  size?: 'sm' | 'md';
}

const ICONS = { success: 'CheckCircle', error: 'XCircle', warning: 'Warning', information: 'Info' } as const;
const ART: Record<string, IllustrationName> = {
  'not-found': 'not-found',
  'no-access': 'no-access',
  'server-error': 'error',
  offline: 'offline',
  maintenance: 'maintenance',
};

/** The outcome of something people did, or why a page can't show: paid, sent, not found, no access. */
export const Result = forwardRef<HTMLDivElement, ResultProps>(function Result(
  { status, title, description, actions, children, icon, size = 'md', className, classNames, styles: partStyles, ...rest },
  ref,
) {
  const part = parts<ResultPart>('result', { classNames, styles: partStyles });
  const art = ART[status];
  const isAlert = status === 'error' || status === 'server-error' || status === 'offline';

  return (
    <div ref={ref} role={isAlert ? 'alert' : 'status'} {...rest} {...part('root', [styles.result, styles[size], className], rest.style)}>
      {icon ? (
        <span {...part('media', styles.custom)} aria-hidden="true">{icon}</span>
      ) : art ? (
        <span {...part('media', styles.art)}>
          <Illustration name={art} size={size === 'sm' ? 120 : 200} />
        </span>
      ) : (
        <span {...part('icon', [styles.circle, styles[status]])} aria-hidden="true">
          <Icon name={ICONS[status as keyof typeof ICONS]} />
        </span>
      )}
      <div {...part('text', styles.text)}>
        <h2 {...part('title', styles.title)}>{title}</h2>
        {description && <p {...part('description', styles.description)}>{description}</p>}
      </div>
      {children && <div {...part('content', styles.content)}>{children}</div>}
      {actions && <div {...part('actions', styles.actions)}>{actions}</div>}
    </div>
  );
});
