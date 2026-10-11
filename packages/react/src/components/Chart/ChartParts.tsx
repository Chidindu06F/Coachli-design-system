import type { CSSProperties, ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import styles from './Chart.module.css';

/** Parts of the charts you can style with `classNames` and `styles`. */
export type ChartPart = 'root' | 'legend' | 'plot' | 'grid' | 'axisLabel' | 'tooltip' | 'bar' | 'slice' | 'center';
export type ChartPartsProps = PartsProps<ChartPart>;
export const chartParts = (name: string, props: ChartPartsProps) => parts<ChartPart>(name, props);
type PartAttrs = { className?: string; style?: CSSProperties; 'data-part'?: string };

export interface LegendItem {
  label: ReactNode;
  color: string;
  value?: ReactNode;
}

/** The coloured dots or lines that name each series. Figma: Chart legend item. */
export function ChartLegend({ items, shape = 'dot', direction = 'row', className, style, 'data-part': dataPart = 'legend' }: { items: LegendItem[]; shape?: 'dot' | 'line'; direction?: 'row' | 'column' } & PartAttrs) {
  return (
    <ul className={cx(styles.legend, direction === 'column' && styles.legendColumn, className)} style={style} data-part={dataPart}>
      {items.map((it, i) => (
        <li key={i} className={styles.legendItem}>
          <span className={cx(styles.swatch, shape === 'line' && styles.swatchLine)} style={{ background: it.color }} aria-hidden="true" />
          <span className={styles.legendLabel}>{it.label}</span>
          {it.value != null && <span className={styles.legendValue}>{it.value}</span>}
        </li>
      ))}
    </ul>
  );
}

export interface TooltipRow {
  label: ReactNode;
  value: ReactNode;
  color: string;
}

/** The hover and focus card. It has a border, not a shadow. Figma: Chart tooltip. */
export function ChartTooltip({ title, rows, style, shape = 'dot', className, 'data-part': dataPart = 'tooltip' }: { title?: ReactNode; rows: TooltipRow[]; shape?: 'dot' | 'line' } & PartAttrs) {
  return (
    <div className={cx(styles.tooltip, className)} style={style} data-part={dataPart} aria-hidden="true">
      {title != null && <div className={styles.tooltipTitle}>{title}</div>}
      {rows.map((r, i) => (
        <div key={i} className={styles.tooltipRow}>
          <span className={cx(styles.swatch, shape === 'line' && styles.swatchLine)} style={{ background: r.color }} />
          <span className={styles.tooltipLabel}>{r.label}</span>
          <span className={styles.tooltipValue}>{r.value}</span>
        </div>
      ))}
    </div>
  );
}

/** The numbers behind a chart, as a table only screen readers see. */
export function DataTable({ caption, columns, rows }: { caption: string; columns: string[]; rows: (string | number)[][] }) {
  return (
    <table className={styles.srOnly}>
      <caption>{caption}</caption>
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c} scope="col">{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {r.map((v, j) => (j === 0 ? <th key={j} scope="row">{v}</th> : <td key={j}>{v}</td>))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Keeps a tooltip inside the chart box. */
export function tooltipPosition(x: number, y: number, boxWidth: number, tipWidth = 180): CSSProperties {
  const left = x + 12 + tipWidth > boxWidth ? Math.max(0, x - 12 - tipWidth) : x + 12;
  return { left, top: Math.max(0, y) };
}
