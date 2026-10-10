import { useLayoutEffect, useRef, useState } from 'react';

/** Series colours 1 to 6 map to the chart/series tokens. */
export type SeriesColor = 1 | 2 | 3 | 4 | 5 | 6;

export interface ChartSeries {
  /** The field in each data row that holds this series' number. */
  key: string;
  /** Shown in the legend, the tooltip and the screen reader table. */
  label: string;
  /** chart/series-1 to 6. Defaults to the series' position. */
  color?: SeriesColor;
}

export type ChartDatum = Record<string, unknown>;

export const seriesColor = (s: ChartSeries, i: number) => `var(--halo-chart-series-${s.color ?? ((i % 6) + 1)})`;

export const defaultFormat = (n: number) => new Intl.NumberFormat(undefined, { maximumFractionDigits: 1, notation: Math.abs(n) >= 10000 ? 'compact' : 'standard' }).format(n);

export const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);

/** Round axis steps (1, 2, 2.5, 5 × 10ⁿ) from 0 to at least max. */
export function niceTicks(max: number, count = 5): number[] {
  if (max <= 0) return [0, 1];
  const raw = max / (count - 1);
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? 10 * mag;
  const top = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = 0; v <= top + step / 2; v += step) ticks.push(Number(v.toFixed(10)));
  return ticks;
}

/** A smooth line through the points (Catmull-Rom as cubic Béziers). */
export function smoothPath(points: [number, number][]): string {
  if (!points.length) return '';
  if (points.length < 3) return points.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join(' ');
  let d = `M${points[0]![0]},${points[0]![1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i]!;
    const p2 = points[i + 1]!;
    const p0 = points[i - 1] ?? p1;
    const p3 = points[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p2[0]},${p2[1]}`;
  }
  return d;
}

export const linearPath = (points: [number, number][]) => points.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join(' ');

/** Width of an element, kept up to date as it resizes. */
export function useWidth<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setWidth(el.getBoundingClientRect().width);
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([entry]) => entry && setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

/** Which category labels fit: every nth one, always keeping the first and last. */
export function labelStep(count: number, width: number, minGap = 56) {
  const fit = Math.max(2, Math.floor(width / minGap));
  return count <= fit ? 1 : Math.ceil((count - 1) / (fit - 1));
}

export const showLabel = (i: number, count: number, step: number) => step === 1 || i % step === 0 || i === count - 1;
