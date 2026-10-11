import { useState } from 'react';
import type { HTMLAttributes, KeyboardEvent, ReactNode } from 'react';
import { ChartLegend, ChartTooltip, DataTable } from './ChartParts';
import { defaultFormat, useWidth } from './chartUtils';
import type { SeriesColor } from './chartUtils';
import { chartParts } from './ChartParts';
import type { ChartPartsProps } from './ChartParts';
import styles from './Chart.module.css';

export interface PieSlice {
  label: string;
  value: number;
  /** chart/series-1 to 6. Defaults to the slice's position. */
  color?: SeriesColor;
}

export interface PieChartProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>, ChartPartsProps {
  /** Up to six slices read well; group the rest as "Other". */
  data: PieSlice[];
  /** What the chart shows. Read by screen readers. */
  label: string;
  /** Donut leaves room for a total in the middle. Figma: Type. */
  variant?: 'pie' | 'donut';
  /** Diameter in px. */
  size?: number;
  /** Small text in the middle of a donut, like "Total". */
  centerLabel?: ReactNode;
  /** Big text in the middle of a donut. Defaults to the total. */
  centerValue?: ReactNode;
  /** Legend beside the chart, or below it. "auto" moves it below on narrow screens. Figma: Layout. */
  legend?: 'side' | 'bottom' | 'auto' | false;
  /** Show percentages in the legend. */
  showPercent?: boolean;
  formatValue?: (n: number) => string;
}

const color = (s: PieSlice, i: number) => `var(--halo-chart-series-${s.color ?? ((i % 6) + 1)})`;

function arc(cx: number, cy: number, r: number, ir: number, a0: number, a1: number) {
  const large = a1 - a0 > Math.PI ? 1 : 0;
  const p = (rad: number, a: number) => `${cx + rad * Math.cos(a)},${cy + rad * Math.sin(a)}`;
  if (a1 - a0 >= Math.PI * 2 - 1e-6) {
    // A full circle needs two halves.
    return ir > 0
      ? `M${p(r, 0)} A${r},${r} 0 1 1 ${p(r, Math.PI)} A${r},${r} 0 1 1 ${p(r, 0)} M${p(ir, 0)} A${ir},${ir} 0 1 0 ${p(ir, Math.PI)} A${ir},${ir} 0 1 0 ${p(ir, 0)} Z`
      : `M${p(r, 0)} A${r},${r} 0 1 1 ${p(r, Math.PI)} A${r},${r} 0 1 1 ${p(r, 0)} Z`;
  }
  return ir > 0
    ? `M${p(r, a0)} A${r},${r} 0 ${large} 1 ${p(r, a1)} L${p(ir, a1)} A${ir},${ir} 0 ${large} 0 ${p(ir, a0)} Z`
    : `M${cx},${cy} L${p(r, a0)} A${r},${r} 0 ${large} 1 ${p(r, a1)} Z`;
}

/** Shows how a whole splits into parts. Point, hover or use the arrow keys to see each slice. Figma: Pie chart. */
export function PieChart({ data, label, variant = 'donut', size = 200, centerLabel = 'Total', centerValue, legend = 'auto', showPercent = true, formatValue = defaultFormat, className, classNames, styles: partStyles, ...rest }: PieChartProps) {
  const part = chartParts('pie-chart', { classNames, styles: partStyles });
  const [box, width] = useWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);
  const total = data.reduce((a, s) => a + Math.max(0, s.value), 0);
  const pct = (v: number) => (total ? `${Math.round((v / total) * 100)}%` : '0%');
  const below = legend === 'bottom' || (legend === 'auto' && width > 0 && width < size + 200);
  const r = size / 2;
  const ir = variant === 'donut' ? r * 0.66 : 0;
  let a = -Math.PI / 2;
  const slices = data.map((s, i) => {
    const a0 = a;
    const a1 = a + (total ? (Math.max(0, s.value) / total) * Math.PI * 2 : 0);
    a = a1;
    return { s, i, a0, a1, mid: (a0 + a1) / 2 };
  });

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!data.length) return;
    const cur = active ?? -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') setActive((cur + 1) % data.length);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') setActive(cur <= 0 ? data.length - 1 : cur - 1);
    else if (e.key === 'Escape') setActive(null);
    else return;
    e.preventDefault();
  };

  const tipAt = active != null ? slices[active] : null;

  return (
    <div ref={box} {...rest} {...part('root', [styles.chart, styles.pie, below && styles.pieBelow, className], rest.style)} role="figure" aria-label={label} tabIndex={0} onKeyDown={onKey} onBlur={() => setActive(null)}>
      <div {...part('plot', styles.pieGraphic, { width: size, height: size })}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" onPointerLeave={() => setActive(null)}>
          {slices.map(({ s, i, a0, a1 }) => (
            <path
              key={i}
              d={arc(r, r, active === i ? r : r - 2, ir, a0, a1)}
              fill={color(s, i)}
              {...part('slice', [styles.slice, active != null && active !== i && styles.dimmed])}
              onPointerEnter={() => setActive(i)}
              onPointerDown={() => setActive(i)}
            />
          ))}
        </svg>
        {variant === 'donut' && (
          <div {...part('center', styles.pieCenter)} aria-hidden="true">
            {centerLabel != null && <span className={styles.pieCenterLabel}>{centerLabel}</span>}
            <span className={styles.pieCenterValue}>{centerValue ?? formatValue(total)}</span>
          </div>
        )}
        {tipAt && (
          <ChartTooltip
            {...part('tooltip', undefined, { left: Math.min(size - 40, r + Math.cos(tipAt.mid) * r * 0.6), top: Math.max(0, r + Math.sin(tipAt.mid) * r * 0.6 - 20) })}
            rows={[{ label: tipAt.s.label, value: `${formatValue(tipAt.s.value)} · ${pct(tipAt.s.value)}`, color: color(tipAt.s, tipAt.i) }]}
          />
        )}
      </div>
      {legend !== false && (
        <ChartLegend {...part('legend')} direction={below ? 'row' : 'column'} items={data.map((s, i) => ({ label: s.label, color: color(s, i), value: showPercent ? pct(s.value) : formatValue(s.value) }))} />
      )}
      <DataTable caption={label} columns={['Part', 'Value', 'Share']} rows={data.map((s) => [s.label, formatValue(s.value), pct(s.value)])} />
    </div>
  );
}
