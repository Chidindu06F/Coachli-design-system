import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import styles from './Spinner.module.css';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerColor = 'brand' | 'neutral' | 'onBrand';

/** Parts you can style with `classNames` and `styles`. */
export type SpinnerPart = 'root' | 'track' | 'arc';

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement>, PartsProps<SpinnerPart> {
  /** 12, 16, 24, 32 or 48px. Figma: Size. */
  size?: SpinnerSize;
  /** brand by default; onBrand on purple surfaces like a primary Button. Figma: Colour. */
  color?: SpinnerColor;
  /** Read by screen readers. Defaults to "Loading". Pass an empty string inside labelled parents. */
  label?: string;
}

const SIZES: Record<SpinnerSize, [number, number]> = { xs: [12, 2], sm: [16, 2], md: [24, 3], lg: [32, 3], xl: [48, 4] };

/** A spinning ring that shows something is happening. */
export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size = 'md', color = 'brand', label = 'Loading', className, classNames, styles: partStyles, style, ...rest },
  ref,
) {
  const part = parts<SpinnerPart>('spinner', { classNames, styles: partStyles });
  const [s, w] = SIZES[size];
  const r = (s - w) / 2;
  const c = 2 * Math.PI * r;
  const a11y = label ? { role: 'status', 'aria-label': label } : { 'aria-hidden': true as const };
  return (
    <span ref={ref} {...a11y} {...part('root', [styles.spinner, styles[color], className], { width: s, height: s, ...style })} {...rest}>
      <svg viewBox={`0 0 ${s} ${s}`} width={s} height={s} aria-hidden="true">
        <circle {...part('track', styles.track)} cx={s / 2} cy={s / 2} r={r} strokeWidth={w} fill="none" />
        <circle
          {...part('arc', styles.arc)}
          cx={s / 2}
          cy={s / 2}
          r={r}
          strokeWidth={w}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${c / 4} ${c}`}
        />
      </svg>
    </span>
  );
});

export interface LoadingIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  /** Spinner beside the label, or above it. Figma: Layout. */
  layout?: 'inline' | 'stacked';
  /** What is happening, like "Uploading files…". Figma: Label. */
  children?: ReactNode;
}

/** A spinner with a visible label. */
export function LoadingIndicator({ layout = 'inline', children = 'Loading…', className, ...rest }: LoadingIndicatorProps) {
  return (
    <div role="status" data-halo="loading-indicator" className={cx(styles.indicator, styles[layout], className)} {...rest}>
      <Spinner size={layout === 'inline' ? 'sm' : 'lg'} label="" />
      <span>{children}</span>
    </div>
  );
}
