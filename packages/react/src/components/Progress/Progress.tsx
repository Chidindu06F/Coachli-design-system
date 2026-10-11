import { forwardRef, useId } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { Icon } from '../../internal/Icon';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import styles from './Progress.module.css';

export type ProgressStatus = 'default' | 'success' | 'error';

/** Parts you can style with `classNames` and `styles`. */
export type ProgressBarPart = 'root' | 'header' | 'label' | 'value' | 'track' | 'fill' | 'hint';

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement>, PartsProps<ProgressBarPart> {
  /** How much is done. Leave it out for an indeterminate bar. */
  value?: number;
  /** The value that counts as complete. */
  max?: number;
  /** Colour of the fill. Figma: Status. */
  status?: ProgressStatus;
  /** 4px (sm) or 8px (md) tall. Figma: Size. */
  size?: 'sm' | 'md';
  /** What is in progress, shown above the bar. Figma: Label. */
  label?: ReactNode;
  /** The value shown on the right, like "60%" or "7.2 of 10 GB". Defaults to the percentage; false hides it. Figma: Value. */
  valueLabel?: ReactNode;
  /** What is happening or what to do next. Figma: Hint. */
  hint?: ReactNode;
}

const clamp = (v: number, max: number) => Math.min(Math.max(v, 0), max);

/** Shows how far along something is, like an upload. Indeterminate when `value` is left out. */
export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(function ProgressBar(
  { value, max = 100, status = 'default', size = 'sm', label, valueLabel, hint, className, classNames, styles: partStyles, 'aria-label': ariaLabel, ...rest },
  ref,
) {
  const part = parts<ProgressBarPart>('progress-bar', { classNames, styles: partStyles });
  const id = useId();
  const indeterminate = value === undefined;
  const pct = indeterminate ? 0 : (clamp(value, max) / max) * 100;
  const shownValue = valueLabel === false ? null : (valueLabel ?? (indeterminate ? null : `${Math.round(pct)}%`));
  const bar = (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={indeterminate ? undefined : clamp(value, max)}
      aria-valuetext={typeof valueLabel === 'string' ? valueLabel : undefined}
      aria-label={label ? undefined : ariaLabel}
      aria-labelledby={label ? `${id}-label` : undefined}
      aria-describedby={hint ? `${id}-hint` : undefined}
      {...part('track', [styles.track, styles[size], styles[status], indeterminate && styles.indeterminate])}
    >
      <span {...part('fill', styles.fill, indeterminate ? undefined : { width: `${pct}%` })} />
    </div>
  );
  if (!label && !hint && shownValue == null) return <div ref={ref} {...rest} {...part('root', className, rest.style)}>{bar}</div>;
  return (
    <div ref={ref} {...rest} {...part('root', [styles.field, className], rest.style)}>
      {(label || shownValue != null) && (
        <div {...part('header', styles.header)}>
          {label && <span id={`${id}-label`} {...part('label', styles.label)}>{label}</span>}
          {shownValue != null && <span {...part('value', styles.value)}>{shownValue}</span>}
        </div>
      )}
      {bar}
      {hint && (
        <span id={`${id}-hint`} {...part('hint', [styles.hint, status === 'error' && styles.hintError])}>
          {status === 'error' && <Icon name="WarningCircle" className={styles.hintIcon} />}
          {hint}
        </span>
      )}
    </div>
  );
});

/** Parts you can style with `classNames` and `styles`. */
export type ProgressCirclePart = 'root' | 'ring' | 'arc' | 'value';

export interface ProgressCircleProps extends HTMLAttributes<HTMLDivElement>, PartsProps<ProgressCirclePart> {
  value: number;
  max?: number;
  /** 24, 40 or 64px. Figma: Size. */
  size?: 'sm' | 'md' | 'lg';
  /** Shows the percentage in the middle (md and lg). Figma: Label. */
  showValue?: boolean;
  /** Read by screen readers. */
  'aria-label'?: string;
}

const CIRCLES = { sm: [24, 3], md: [40, 4], lg: [64, 6] } as const;

/** A ring that fills clockwise from the top. */
export const ProgressCircle = forwardRef<HTMLDivElement, ProgressCircleProps>(function ProgressCircle(
  { value, max = 100, size = 'md', showValue = true, className, classNames, styles: partStyles, style, ...rest },
  ref,
) {
  const part = parts<ProgressCirclePart>('progress-circle', { classNames, styles: partStyles });
  const [s, w] = CIRCLES[size];
  const r = (s - w) / 2;
  const c = 2 * Math.PI * r;
  const pct = (clamp(value, max) / max) * 100;
  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={clamp(value, max)}
      {...rest}
      {...part('root', [styles.circle, styles[`circle-${size}`], className], { width: s, height: s, ...style })}
    >
      <svg viewBox={`0 0 ${s} ${s}`} width={s} height={s} aria-hidden="true">
        <circle {...part('ring', styles.ring)} cx={s / 2} cy={s / 2} r={r} strokeWidth={w} fill="none" />
        <circle
          {...part('arc', styles.arc)}
          cx={s / 2}
          cy={s / 2}
          r={r}
          strokeWidth={w}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${(pct / 100) * c} ${c}`}
        />
      </svg>
      {showValue && size !== 'sm' && <span {...part('value', styles.circleValue)} aria-hidden="true">{Math.round(pct)}%</span>}
    </div>
  );
});
