import type { HTMLAttributes } from 'react';
import { Icon } from '../../internal/Icon';
import { useControllable } from '../../internal/useControllable';
import { Button } from '../Button';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import styles from './Pagination.module.css';

/** Parts you can style with `classNames` and `styles`. */
export type PaginationPart = 'root' | 'previous' | 'next' | 'pages' | 'page' | 'ellipsis' | 'count';

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange' | 'defaultValue'>, PartsProps<PaginationPart> {
  /** Number of pages. */
  pageCount: number;
  /** The current page, starting at 1. */
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  /** numbers shows page buttons; compact shows "Page 2 of 10" between arrows. Figma: Type. */
  variant?: 'numbers' | 'compact';
  /** Figma: Size. */
  size?: 'sm' | 'md';
  /** Pages shown on each side of the current one before an ellipsis. */
  siblings?: number;
  /** Screen reader name for the navigation landmark. */
  'aria-label'?: string;
}

/** Pages from 1 to count with ellipses, always keeping the first, last and current pages. */
export function pageRange(page: number, count: number, siblings = 1): (number | 'ellipsis')[] {
  const total = siblings * 2 + 5; // first, last, current, two ellipses
  if (count <= total) return Array.from({ length: count }, (_, i) => i + 1);
  const start = Math.max(2, Math.min(page - siblings, count - siblings * 2 - 2));
  const end = Math.min(count - 1, Math.max(page + siblings, siblings * 2 + 3));
  const middle = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  return [1, ...(start > 2 ? ['ellipsis' as const] : []), ...middle, ...(end < count - 1 ? ['ellipsis' as const] : []), count];
}

/** Moves between pages of a long list or table. */
export function Pagination({
  pageCount,
  page,
  defaultPage = 1,
  onPageChange,
  variant = 'numbers',
  size = 'md',
  siblings = 1,
  className,
  classNames,
  styles: partStyles,
  'aria-label': label = 'Pagination',
  ...rest
}: PaginationProps) {
  const part = parts<PaginationPart>('pagination', { classNames, styles: partStyles });
  const [current, setCurrent] = useControllable(page, defaultPage, onPageChange);
  const go = (p: number) => setCurrent(Math.min(pageCount, Math.max(1, p)));
  const first = current <= 1;
  const last = current >= pageCount;
  const buttonSize = size === 'sm' ? 'sm' : 'md';

  return (
    <nav aria-label={label} {...rest} {...part('root', [styles.pagination, styles[size], className], rest.style)}>
      {variant === 'compact' ? (
        <>
          <Button {...part('previous')} variant="ghost" size={buttonSize} iconOnly aria-label="Previous page" disabled={first} onClick={() => go(current - 1)}>
            <Icon name="CaretLeft" />
          </Button>
          <span {...part('count', styles.count)} aria-live="polite">
            Page {current} of {pageCount}
          </span>
          <Button {...part('next')} variant="ghost" size={buttonSize} iconOnly aria-label="Next page" disabled={last} onClick={() => go(current + 1)}>
            <Icon name="CaretRight" />
          </Button>
        </>
      ) : (
        <>
          <Button {...part('previous')} variant="ghost" size={buttonSize} iconLeft={<Icon name="CaretLeft" />} disabled={first} onClick={() => go(current - 1)}>
            Previous
          </Button>
          <ul {...part('pages', styles.pages)}>
            {pageRange(current, pageCount, siblings).map((p, i) =>
              p === 'ellipsis' ? (
                <li key={`e${i}`} {...part('ellipsis', [styles.page, styles.ellipsis])} aria-hidden="true">…</li>
              ) : (
                <li key={p}>
                  <button
                    type="button"
                    {...part('page', [styles.page, p === current && styles.selected])}
                    aria-label={`Page ${p}`}
                    aria-current={p === current ? 'page' : undefined}
                    onClick={() => go(p)}
                  >
                    {p}
                  </button>
                </li>
              ),
            )}
          </ul>
          <Button {...part('next')} variant="ghost" size={buttonSize} iconRight={<Icon name="CaretRight" />} disabled={last} onClick={() => go(current + 1)}>
            Next
          </Button>
        </>
      )}
    </nav>
  );
}
