import { useId } from 'react';
import type { SVGAttributes } from 'react';
import { cx } from '../../internal/cx';
import { smoothPath } from './chartUtils';
import type { SeriesColor } from './chartUtils';
import styles from './Chart.module.css';

export interface SparklineProps extends Omit<SVGAttributes<SVGSVGElement>, 'children' | 'color' | 'fill'> {
  /** The values, oldest first. */
  data: number[];
  /** Describe the trend for screen readers, like "Revenue up 18% this month". */
  label: string;
  width?: number;
  height?: number;
  /** Light fill under the line. Figma: Fill. */
  fill?: boolean;
  /** chart/series-1 to 6. */
  color?: SeriesColor;
}

/** A tiny trend line with no axes, for stat cards and table rows. Pair it with a Badge for the change. Figma: Sparkline. */
export function Sparkline({ data, label, width = 120, height = 40, fill = true, color = 1, className, ...rest }: SparklineProps) {
  const id = useId();
  const stroke = `var(--halo-chart-series-${color})`;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pad = 3;
  const pts = data.map((v, i) => [pad + (data.length < 2 ? 0 : (i * (width - pad * 2)) / (data.length - 1)), pad + (height - pad * 2) * (1 - (v - min) / span)] as [number, number]);
  const line = smoothPath(pts);
  const last = pts[pts.length - 1];
  return (
    <svg className={cx(styles.sparkline, className)} width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label} {...rest}>
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity={0.16} />
          <stop offset="100%" stopColor={stroke} stopOpacity={0} />
        </linearGradient>
      </defs>
      {fill && last && pts.length > 1 && <path d={`${line} L${last[0]},${height} L${pts[0]![0]},${height} Z`} fill={`url(#${id})`} />}
      <path d={line} fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {last && <circle cx={last[0]} cy={last[1]} r={3} fill={stroke} />}
    </svg>
  );
}
