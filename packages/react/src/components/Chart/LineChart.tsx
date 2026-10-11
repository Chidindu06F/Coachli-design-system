import { useId, useState } from 'react';
import type { HTMLAttributes, KeyboardEvent, PointerEvent, ReactNode } from 'react';
import { ChartLegend, ChartTooltip, DataTable, tooltipPosition } from './ChartParts';
import { defaultFormat, labelStep, linearPath, niceTicks, num, seriesColor, showLabel, smoothPath, useWidth } from './chartUtils';
import type { ChartDatum, ChartSeries } from './chartUtils';
import { chartParts } from './ChartParts';
import type { ChartPartsProps } from './ChartParts';
import styles from './Chart.module.css';

export interface LineChartProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>, ChartPartsProps {
  /** One object per point on the x axis, like { day: 'Mon', revenue: 420 }. */
  data: ChartDatum[];
  /** The field that labels the x axis. */
  xKey: string;
  /** One or two lines usually read best. */
  series: ChartSeries[];
  /** What the chart shows, like "Revenue this week". Read by screen readers. */
  label: string;
  /** Fill under each line to show volume. Figma: Type=Area. */
  area?: boolean;
  /** Curved or straight lines. */
  curve?: 'smooth' | 'linear';
  /** Height of the plot in px. */
  height?: number;
  /** Show the legend above the chart. Figma: Legend. */
  legend?: boolean;
  /** Format numbers on the y axis and in the tooltip. */
  formatValue?: (n: number) => string;
  /** Format x labels. */
  formatX?: (v: unknown) => ReactNode;
}

const M = { top: 8, right: 16, bottom: 28, left: 44 };

/** Shows how values change over time. Point, hover or use the arrow keys to see the values. Figma: Line chart. */
export function LineChart({ data, xKey, series, label, area, curve = 'smooth', height = 240, legend = true, formatValue = defaultFormat, formatX = (v) => String(v), className, classNames, styles: partStyles, ...rest }: LineChartProps) {
  const part = chartParts('line-chart', { classNames, styles: partStyles });
  const [box, width] = useWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);
  const gradId = useId();
  const plotW = Math.max(0, width - M.left - M.right);
  const plotH = height - M.top - M.bottom;
  const max = Math.max(0, ...data.flatMap((d) => series.map((s) => num(d[s.key]))));
  const ticks = niceTicks(max);
  const top = ticks[ticks.length - 1] || 1;
  const x = (i: number) => M.left + (data.length < 2 ? plotW / 2 : (i * plotW) / (data.length - 1));
  const y = (v: number) => M.top + plotH - (v / top) * plotH;
  const step = labelStep(data.length, plotW);
  const build = curve === 'smooth' ? smoothPath : linearPath;
  const row = active != null ? data[active] : undefined;

  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - r.left - M.left;
    const i = data.length < 2 ? 0 : Math.round((px / plotW) * (data.length - 1));
    setActive(Math.max(0, Math.min(data.length - 1, i)));
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!data.length) return;
    const cur = active ?? -1;
    if (e.key === 'ArrowRight') setActive(Math.min(data.length - 1, cur + 1));
    else if (e.key === 'ArrowLeft') setActive(Math.max(0, cur < 0 ? 0 : cur - 1));
    else if (e.key === 'Home') setActive(0);
    else if (e.key === 'End') setActive(data.length - 1);
    else if (e.key === 'Escape') setActive(null);
    else return;
    e.preventDefault();
  };

  return (
    <div {...rest} {...part('root', [styles.chart, className], rest.style)} role="figure" aria-label={label} tabIndex={0} onKeyDown={onKey} onBlur={() => setActive(null)}>
      {legend && <ChartLegend {...part('legend')} shape="line" items={series.map((s, i) => ({ label: s.label, color: seriesColor(s, i) }))} />}
      <div ref={box} {...part('plot', styles.plot, { height })}>
        {width > 0 && (
          <svg width={width} height={height} aria-hidden="true" onPointerMove={onMove} onPointerLeave={() => setActive(null)} onPointerDown={onMove}>
            <defs>
              {series.map((s, i) => (
                <linearGradient key={s.key} id={`${gradId}-${i}`} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={seriesColor(s, i)} stopOpacity={0.18} />
                  <stop offset="100%" stopColor={seriesColor(s, i)} stopOpacity={0.02} />
                </linearGradient>
              ))}
            </defs>
            {ticks.map((t) => (
              <g key={t}>
                <line {...part('grid', styles.grid)} x1={M.left} x2={M.left + plotW} y1={y(t)} y2={y(t)} />
                <text {...part('axisLabel', styles.axisLabel)} x={M.left - 8} y={y(t)} textAnchor="end" dominantBaseline="middle">{formatValue(t)}</text>
              </g>
            ))}
            {data.map((d, i) => showLabel(i, data.length, step) && (
              <text key={i} {...part('axisLabel', styles.axisLabel)} x={x(i)} y={height - 8} textAnchor={i === 0 && data.length > 1 ? 'start' : i === data.length - 1 && data.length > 1 ? 'end' : 'middle'}>{formatX(d[xKey])}</text>
            ))}
            {series.map((s, si) => {
              const pts = data.map((d, i) => [x(i), y(num(d[s.key]))] as [number, number]);
              const line = build(pts);
              return (
                <g key={s.key}>
                  {area && pts.length > 1 && <path d={`${line} L${pts[pts.length - 1]![0]},${y(0)} L${pts[0]![0]},${y(0)} Z`} fill={`url(#${gradId}-${si})`} />}
                  <path d={line} fill="none" stroke={seriesColor(s, si)} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </g>
              );
            })}
            {row && active != null && (
              <g>
                <line className={styles.guide} x1={x(active)} x2={x(active)} y1={M.top} y2={M.top + plotH} />
                {series.map((s, si) => (
                  <circle key={s.key} cx={x(active)} cy={y(num(row[s.key]))} r={5} className={styles.point} stroke={seriesColor(s, si)} />
                ))}
              </g>
            )}
          </svg>
        )}
        {row && active != null && width > 0 && (
          <ChartTooltip
            {...part('tooltip', undefined, tooltipPosition(x(active), M.top, width))}
            shape="line"
            title={formatX(row[xKey])}
            rows={series.map((s, si) => ({ label: s.label, value: formatValue(num(row[s.key])), color: seriesColor(s, si) }))}
          />
        )}
      </div>
      <DataTable caption={label} columns={[xKey, ...series.map((s) => s.label)]} rows={data.map((d) => [String(d[xKey]), ...series.map((s) => formatValue(num(d[s.key])))])} />
    </div>
  );
}

export interface AreaChartProps extends Omit<LineChartProps, 'area'> {}

/** A line chart with a light fill under each line. Figma: Line chart, Type=Area. */
export function AreaChart(props: AreaChartProps) {
  return <LineChart {...props} area />;
}
