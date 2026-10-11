import { useState } from 'react';
import type { HTMLAttributes, KeyboardEvent, ReactNode } from 'react';
import { ChartLegend, ChartTooltip, DataTable, tooltipPosition } from './ChartParts';
import { defaultFormat, labelStep, niceTicks, num, seriesColor, showLabel, useWidth } from './chartUtils';
import type { ChartDatum, ChartSeries } from './chartUtils';
import { chartParts } from './ChartParts';
import type { ChartPartsProps } from './ChartParts';
import styles from './Chart.module.css';

export interface BarChartProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>, ChartPartsProps {
  /** One object per category, like { month: 'Jan', card: 120, transfer: 80 }. */
  data: ChartDatum[];
  /** The field that names each category. */
  xKey: string;
  series: ChartSeries[];
  /** What the chart shows. Read by screen readers. */
  label: string;
  /** Vertical for months and short labels; horizontal for long category names and phones. Figma: Orientation. */
  orientation?: 'vertical' | 'horizontal';
  /** Side by side, or parts of a total. Only matters with two or more series. Figma: Type. */
  mode?: 'grouped' | 'stacked';
  /** Plot height for vertical bars. Horizontal bars grow with the number of rows. */
  height?: number;
  legend?: boolean;
  formatValue?: (n: number) => string;
  formatX?: (v: unknown) => ReactNode;
  /** Width kept for category names in horizontal bars. */
  categoryWidth?: number;
}

const RADIUS = 4;

/** A rectangle with only the outer end rounded. */
function barPath(x: number, y: number, w: number, h: number, horizontal: boolean, round: boolean) {
  if (w <= 0 || h <= 0) return '';
  const r = round ? Math.min(RADIUS, horizontal ? h / 2 : w / 2, horizontal ? w : h) : 0;
  if (horizontal) return `M${x},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} H${x} Z`;
  return `M${x},${y + h} V${y + r} Q${x},${y} ${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h} Z`;
}

/** Compares amounts across categories. Point, hover or use the arrow keys to see the values. Figma: Bar chart. */
export function BarChart({ data, xKey, series, label, orientation = 'vertical', mode = 'grouped', height = 240, legend = true, formatValue = defaultFormat, formatX = (v) => String(v), categoryWidth = 96, className, classNames, styles: partStyles, ...rest }: BarChartProps) {
  const part = chartParts('bar-chart', { classNames, styles: partStyles });
  const [box, width] = useWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);
  const horizontal = orientation === 'horizontal';
  const stacked = mode === 'stacked' && series.length > 1;
  const totals = data.map((d) => (stacked ? series.reduce((a, s) => a + num(d[s.key]), 0) : Math.max(0, ...series.map((s) => num(d[s.key])))));
  const ticks = niceTicks(Math.max(0, ...totals), horizontal && width < 480 ? 3 : 5);
  const top = ticks[ticks.length - 1] || 1;

  const M = horizontal ? { top: 4, right: 16, bottom: 28, left: Math.min(categoryWidth, width * 0.35) + 8 } : { top: 8, right: 8, bottom: 28, left: 44 };
  const rowH = series.length > 1 && !stacked ? 36 : 32;
  const h = horizontal ? M.top + M.bottom + data.length * rowH : height;
  const plotW = Math.max(0, width - M.left - M.right);
  const plotH = h - M.top - M.bottom;
  const band = (horizontal ? plotH : plotW) / Math.max(1, data.length);
  const thick = Math.min(stacked || series.length === 1 ? (horizontal ? 20 : 24) : horizontal ? 10 : 12, band * 0.7 / (stacked ? 1 : series.length));
  const scale = (v: number) => (v / top) * (horizontal ? plotW : plotH);
  const step = labelStep(data.length, plotW, 48);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!data.length) return;
    const cur = active ?? -1;
    const next = horizontal ? ['ArrowDown', 'ArrowRight'] : ['ArrowRight', 'ArrowDown'];
    const prev = horizontal ? ['ArrowUp', 'ArrowLeft'] : ['ArrowLeft', 'ArrowUp'];
    if (next.includes(e.key)) setActive(Math.min(data.length - 1, cur + 1));
    else if (prev.includes(e.key)) setActive(Math.max(0, cur < 0 ? 0 : cur - 1));
    else if (e.key === 'Home') setActive(0);
    else if (e.key === 'End') setActive(data.length - 1);
    else if (e.key === 'Escape') setActive(null);
    else return;
    e.preventDefault();
  };

  const bars = data.map((d, i) => {
    const start = (horizontal ? M.top : M.left) + i * band;
    const parts: { d: string; color: string; key: string }[] = [];
    if (stacked) {
      let acc = 0;
      const offset = start + (band - thick) / 2;
      series.forEach((s, si) => {
        const v = num(d[s.key]);
        const len = scale(v);
        const isTop = series.slice(si + 1).every((n) => num(d[n.key]) === 0);
        const path = horizontal ? barPath(M.left + scale(acc), offset, len, thick, true, isTop) : barPath(offset, M.top + plotH - scale(acc) - len, thick, len, false, isTop);
        parts.push({ d: path, color: seriesColor(s, si), key: s.key });
        acc += v;
      });
    } else {
      const gap = 2;
      const groupW = series.length * thick + (series.length - 1) * gap;
      series.forEach((s, si) => {
        const len = scale(num(d[s.key]));
        const o = start + (band - groupW) / 2 + si * (thick + gap);
        parts.push({ d: horizontal ? barPath(M.left, o, len, thick, true, true) : barPath(o, M.top + plotH - len, thick, len, false, true), color: seriesColor(s, si), key: s.key });
      });
    }
    return { start, parts };
  });

  const row = active != null ? data[active] : undefined;
  const tip = active != null ? (horizontal ? tooltipPosition(M.left + scale(totals[active] ?? 0), M.top + active * band, width) : tooltipPosition(M.left + (active + 0.5) * band, M.top, width)) : undefined;

  return (
    <div {...rest} {...part('root', [styles.chart, className], rest.style)} role="figure" aria-label={label} tabIndex={0} onKeyDown={onKey} onBlur={() => setActive(null)}>
      {legend && <ChartLegend {...part('legend')} items={series.map((s, i) => ({ label: s.label, color: seriesColor(s, i) }))} />}
      <div ref={box} {...part('plot', styles.plot, { height: h })}>
        {width > 0 && (
          <svg width={width} height={h} aria-hidden="true" onPointerLeave={() => setActive(null)}>
            {ticks.map((t) => {
              const p = horizontal ? M.left + scale(t) : M.top + plotH - scale(t);
              return horizontal ? (
                <g key={t}>
                  <line {...part('grid', styles.grid)} x1={p} x2={p} y1={M.top} y2={M.top + plotH} />
                  <text {...part('axisLabel', styles.axisLabel)} x={p} y={h - 8} textAnchor="middle">{formatValue(t)}</text>
                </g>
              ) : (
                <g key={t}>
                  <line {...part('grid', styles.grid)} x1={M.left} x2={M.left + plotW} y1={p} y2={p} />
                  <text {...part('axisLabel', styles.axisLabel)} x={M.left - 8} y={p} textAnchor="end" dominantBaseline="middle">{formatValue(t)}</text>
                </g>
              );
            })}
            {bars.map((b, i) => (
              <g key={i} {...part('bar', [styles.barGroup, active != null && active !== i && styles.dimmed])} onPointerEnter={() => setActive(i)} onPointerDown={() => setActive(i)}>
                {horizontal ? <rect x={0} y={b.start} width={width} height={band} fill="transparent" /> : <rect x={b.start} y={M.top} width={band} height={plotH} fill="transparent" />}
                {b.parts.map((p) => <path key={p.key} d={p.d} fill={p.color} />)}
                {horizontal ? (
                  <text {...part('axisLabel', styles.axisLabel)} x={M.left - 8} y={b.start + band / 2} textAnchor="end" dominantBaseline="middle">{formatX(data[i]?.[xKey])}</text>
                ) : (
                  showLabel(i, data.length, step) && <text {...part('axisLabel', styles.axisLabel)} x={b.start + band / 2} y={h - 8} textAnchor="middle">{formatX(data[i]?.[xKey])}</text>
                )}
              </g>
            ))}
          </svg>
        )}
        {row && width > 0 && (
          <ChartTooltip
            {...part('tooltip', undefined, tip)}
            title={formatX(row[xKey])}
            rows={series.map((s, si) => ({ label: s.label, value: formatValue(num(row[s.key])), color: seriesColor(s, si) }))}
          />
        )}
      </div>
      <DataTable caption={label} columns={[xKey, ...series.map((s) => s.label)]} rows={data.map((d) => [String(d[xKey]), ...series.map((s) => formatValue(num(d[s.key])))])} />
    </div>
  );
}
