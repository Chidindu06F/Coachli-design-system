import { forwardRef, useState } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import { Icon } from '../../internal/Icon';
import { useControllable } from '../../internal/useControllable';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import styles from './Rating.module.css';

export type RatingSize = 'sm' | 'md' | 'lg';

/** Parts you can style with `classNames` and `styles`. */
export type RatingPart = 'root' | 'star' | 'empty' | 'fill';

export interface RatingProps extends PartsProps<RatingPart> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /** Number of stars. Default 5. */
  max?: number;
  /** Lets people pick half stars, and shows halves when read only. */
  allowHalf?: boolean;
  /** Shows the score without letting people change it. Figma: Read only. */
  readOnly?: boolean;
  disabled?: boolean;
  /** 16, 20 or 28px stars. Figma: Size. */
  size?: RatingSize;
  /** Form field name. A hidden input carries the value. */
  name?: string;
  /** Screen reader name, like "Rate this course". */
  'aria-label'?: string;
  'aria-labelledby'?: string;
  className?: string;
}

/** Stars for giving or showing a score. Arrow keys change it; click a star to set it. Figma: Rating. */
export const Rating = forwardRef<HTMLDivElement, RatingProps>(function Rating(
  { value, defaultValue = 0, onValueChange, max = 5, allowHalf = false, readOnly = false, disabled = false, size = 'md', name, className, classNames, styles: partStyles, ...aria },
  ref,
) {
  const part = parts<RatingPart>('rating', { classNames, styles: partStyles });
  const [v, setV] = useControllable<number>(value, defaultValue, onValueChange as (v: number) => void);
  const [hover, setHover] = useState<number | null>(null);
  const step = allowHalf ? 0.5 : 1;
  const interactive = !readOnly && !disabled;
  const shown = hover ?? (readOnly && !allowHalf ? Math.round(v ?? 0) : (v ?? 0));
  const text = `${v ?? 0} out of ${max} stars`;

  const fromPointer = (e: MouseEvent<HTMLSpanElement>, i: number) => {
    const box = e.currentTarget.getBoundingClientRect();
    const half = allowHalf && e.clientX - box.left < box.width / 2;
    return half ? i + 0.5 : i + 1;
  };

  const onKey = (e: KeyboardEvent) => {
    const now = v ?? 0;
    const next =
      e.key === 'ArrowRight' || e.key === 'ArrowUp' ? Math.min(max, now + step)
      : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? Math.max(0, now - step)
      : e.key === 'Home' ? 0
      : e.key === 'End' ? max
      : null;
    if (next === null) return;
    e.preventDefault();
    setV(next);
  };

  const stars = Array.from({ length: max }, (_, i) => {
    const fill = Math.max(0, Math.min(1, shown - i));
    return (
      <span
        key={i}
        {...part('star', styles.star)}
        onPointerMove={interactive ? (e) => setHover(fromPointer(e, i)) : undefined}
        onClick={interactive ? (e) => setV(fromPointer(e, i)) : undefined}
      >
        <Icon name="StarFill" {...part('empty', styles.empty)} />
        {fill > 0 && (
          <span {...part('fill', styles.fill, { width: `${fill * 100}%` })}>
            <Icon name="StarFill" />
          </span>
        )}
      </span>
    );
  });

  return (
    <div
      ref={ref}
      {...part('root', [styles.rating, styles[size], interactive && styles.interactive, disabled && styles.disabled, className])}
      {...(readOnly
        ? { role: 'img', 'aria-label': aria['aria-label'] ? `${aria['aria-label']}: ${text}` : text }
        : {
            role: 'slider',
            tabIndex: disabled ? -1 : 0,
            'aria-label': aria['aria-label'],
            'aria-labelledby': aria['aria-labelledby'],
            'aria-valuemin': 0,
            'aria-valuemax': max,
            'aria-valuenow': v ?? 0,
            'aria-valuetext': text,
            'aria-disabled': disabled || undefined,
            onKeyDown: disabled ? undefined : onKey,
            onPointerLeave: () => setHover(null),
          })}
    >
      {stars}
      {name && <input type="hidden" name={name} value={v ?? 0} />}
    </div>
  );
});
