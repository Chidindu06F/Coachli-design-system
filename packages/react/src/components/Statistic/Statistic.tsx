import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { Icon } from '../../internal/Icon';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import { Badge } from '../Badge';
import { Skeleton } from '../Skeleton';
import styles from './Statistic.module.css';

export type StatisticTrend = 'up' | 'down' | 'flat';
export type StatisticSentiment = 'positive' | 'negative' | 'neutral';

/** Parts you can style with `classNames` and `styles`. */
export type StatisticPart = 'root' | 'label' | 'icon' | 'value' | 'prefix' | 'suffix' | 'footer' | 'change' | 'comparison';

export interface StatisticProps extends Omit<HTMLAttributes<HTMLDivElement>, 'prefix'>, PartsProps<StatisticPart> {
  /** What the number measures, like "Active users". Figma: Label. */
  label: ReactNode;
  /** The number. Numbers are formatted for the reader's language, like 12,480. Figma: Value. */
  value: ReactNode;
  /** Decimal places for numeric values. */
  precision?: number;
  /** Before the value, like "$" or "₦". */
  prefix?: ReactNode;
  /** After the value, like "%" or "/ month". */
  suffix?: ReactNode;
  /** Icon before the label. Figma: L icon. */
  icon?: ReactNode;
  /** The change, like "+12.4%". Shown in a badge. Figma: Change. */
  change?: ReactNode;
  /** Direction of the change. Picks the arrow. Figma: Trend. */
  trend?: StatisticTrend;
  /**
   * Whether the change is good or bad, which picks the colour. Defaults to up is good and down is bad.
   * Set it when that's reversed, like churn going up.
   */
  sentiment?: StatisticSentiment;
  /** What the change compares with, like "vs last month". Figma: Comparison. */
  comparison?: ReactNode;
  /** Figma: Size. */
  size?: 'sm' | 'md' | 'lg';
  /** Shows placeholders while the number loads. */
  loading?: boolean;
}

const TREND_ICON = { up: 'TrendUp', down: 'TrendDown', flat: 'Minus' } as const;
const BADGE_COLOR = { positive: 'success', negative: 'error', neutral: 'neutral' } as const;
const SR_TREND = { up: 'Up', down: 'Down', flat: 'No change' };

/** A key number with its label and how it changed, like on a dashboard. Put it in a Card or use it on its own. */
export const Statistic = forwardRef<HTMLDivElement, StatisticProps>(function Statistic(
  { label, value, precision, prefix, suffix, icon, change, trend, sentiment, comparison, size = 'md', loading = false, className, classNames, styles: partStyles, ...rest },
  ref,
) {
  const part = parts<StatisticPart>('statistic', { classNames, styles: partStyles });
  const shown =
    typeof value === 'number'
      ? new Intl.NumberFormat(undefined, precision === undefined ? undefined : { minimumFractionDigits: precision, maximumFractionDigits: precision }).format(value)
      : value;
  const tone = sentiment ?? (trend === 'up' ? 'positive' : trend === 'down' ? 'negative' : 'neutral');
  const hasFooter = change != null || comparison != null;

  return (
    <div ref={ref} {...rest} {...part('root', [styles.statistic, styles[size], className], rest.style)}>
      <div {...part('label', styles.label)}>
        {icon && <span {...part('icon', styles.icon)} aria-hidden="true">{icon}</span>}
        {label}
      </div>
      {loading ? (
        <Skeleton className={styles.valueSkeleton} aria-label="Loading" />
      ) : (
        <div {...part('value', styles.value)}>
          {prefix && <span {...part('prefix', styles.prefix)}>{prefix}</span>}
          {shown}
          {suffix && <span {...part('suffix', styles.suffix)}>{suffix}</span>}
        </div>
      )}
      {hasFooter &&
        (loading ? (
          <Skeleton className={styles.footerSkeleton} />
        ) : (
          <div {...part('footer', styles.footer)}>
            {change != null && (
              <Badge
                {...part('change')}
                size={size === 'lg' ? 'md' : 'sm'}
                color={BADGE_COLOR[tone]}
                icon={trend ? <Icon name={TREND_ICON[trend]} /> : undefined}
              >
                {trend && <span className={styles.srOnly}>{SR_TREND[trend]} </span>}
                {change}
              </Badge>
            )}
            {comparison != null && <span {...part('comparison', styles.comparison)}>{comparison}</span>}
          </div>
        ))}
    </div>
  );
});
