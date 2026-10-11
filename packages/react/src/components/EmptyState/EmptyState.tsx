import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import styles from './EmptyState.module.css';

/** Parts you can style with `classNames` and `styles`. */
export type EmptyStatePart = 'root' | 'icon' | 'text' | 'title' | 'description' | 'actions';

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, PartsProps<EmptyStatePart> {
  /** Figma: Size. */
  size?: 'lg' | 'sm';
  /** An icon shown in a grey circle. Figma: Media slot. */
  icon?: ReactNode;
  /** An illustration or image instead of the icon circle. Figma: Media slot. */
  media?: ReactNode;
  /** Figma: Title. */
  title: ReactNode;
  /** Say why it is empty and what to do next. Figma: Description. */
  description?: ReactNode;
  /** Usually a primary Button and a secondary one. Figma: Actions. */
  actions?: ReactNode;
}

/** Fills a space with nothing to show yet, like an empty list or no search results. */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { size = 'lg', icon, media, title, description, actions, className, classNames, styles: partStyles, ...rest },
  ref,
) {
  const part = parts<EmptyStatePart>('empty-state', { classNames, styles: partStyles });
  return (
    <div ref={ref} {...rest} {...part('root', [styles.empty, styles[size], className], rest.style)}>
      {media ?? (icon && <span {...part('icon', styles.icon)} aria-hidden="true">{icon}</span>)}
      <div {...part('text', styles.text)}>
        <div {...part('title', styles.title)}>{title}</div>
        {description && <div {...part('description', styles.description)}>{description}</div>}
      </div>
      {actions && <div {...part('actions', styles.actions)}>{actions}</div>}
    </div>
  );
});
