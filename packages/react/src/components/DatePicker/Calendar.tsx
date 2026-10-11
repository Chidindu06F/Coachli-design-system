import { useEffect, useRef, useState } from 'react';
import type { HTMLAttributes, KeyboardEvent, ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { Icon } from '../../internal/Icon';
import { CompactButton } from '../CompactButton';
import { Select } from '../Select';
import styles from './DatePicker.module.css';
import { addDays, addMonths, before, between, formatDate, monthGrid, sameDay, sameMonth, startOfDay } from './dates';

export type DateRange = [Date, Date];

export interface CalendarPreset {
  label: string;
  range: DateRange;
}

interface CalendarBase extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Earliest day that can be picked. */
  min?: Date;
  /** Latest day that can be picked. */
  max?: Date;
  /** Return true for days that can't be picked, like weekends. */
  isDateDisabled?: (date: Date) => boolean;
  /** 0 for Sunday, 1 for Monday. */
  weekStartsOn?: 0 | 1;
  /** For month and weekday names. Defaults to the browser's language. */
  locale?: string;
  /** Month shown first. Defaults to the selected day or today. */
  defaultMonth?: Date;
  /** How many months show side by side. */
  months?: 1 | 2;
  /** Something under the months, like Cancel and Apply buttons. */
  footer?: ReactNode;
  /**
   * Arrows: the month name with back and forward arrows. Select: month and year menus too, to jump
   * straight to any month, like a birthday years ago. Select needs one month on show. Figma: Header.
   */
  header?: 'arrows' | 'select';
  /** Years in the year menu. Defaults to the min and max years, or 100 years back and 10 ahead. */
  yearRange?: [number, number];
}

export interface SingleCalendarProps extends CalendarBase {
  mode?: 'single';
  value: Date | null;
  onChange: (date: Date) => void;
  presets?: never;
}

export interface RangeCalendarProps extends CalendarBase {
  /** Pick a start and an end day. Figma: Type=Range. */
  mode: 'range';
  value: DateRange | null;
  onChange: (range: DateRange) => void;
  /** Quick picks on the left, like "Last 7 days". Figma: Presets. */
  presets?: CalendarPreset[];
}

export interface MultipleCalendarProps extends CalendarBase {
  /** Pick any number of separate days. Each click adds or removes one. Figma: Type=Multiple. */
  mode: 'multiple';
  value: Date[];
  onChange: (dates: Date[]) => void;
  /** The most days people can pick. Other days stop responding once it is reached. */
  maxCount?: number;
  presets?: never;
}

export type CalendarProps = SingleCalendarProps | RangeCalendarProps | MultipleCalendarProps;

/**
 * A month grid for picking a day or a range. Arrow keys move by day and week,
 * Page Up and Page Down by month, Home and End to the start and end of the week.
 */
export function Calendar(props: CalendarProps) {
  const {
    min,
    max,
    isDateDisabled,
    weekStartsOn = 1,
    locale,
    defaultMonth,
    months = props.mode === 'range' ? 2 : 1,
    footer,
    header = 'arrows',
    yearRange,
    className,
    mode: _mode,
    value: _value,
    onChange: _onChange,
    presets: _presets,
    maxCount: _maxCount,
    ...rest
  } = props as CalendarBase & { mode?: unknown; value?: unknown; onChange?: unknown; presets?: unknown; maxCount?: unknown };

  const range = props.mode === 'range';
  const multiple = props.mode === 'multiple';
  const selectedStart = props.mode === 'range' ? props.value?.[0] : props.mode === 'multiple' ? props.value[0] : props.value;
  const today = startOfDay(new Date());
  const [month, setMonth] = useState(() => startOfDay(defaultMonth ?? selectedStart ?? today));
  const [focus, setFocus] = useState(() => startOfDay(selectedStart ?? today));
  // While picking a range, the first click is held here until the second.
  const [anchor, setAnchor] = useState<Date | null>(null);
  const [hovered, setHovered] = useState<Date | null>(null);
  const grid = useRef<HTMLDivElement | null>(null);
  const moved = useRef(false);

  const picked = (d: Date) => props.mode === 'multiple' && props.value.some((v) => sameDay(v, d));
  const full = props.mode === 'multiple' && props.maxCount !== undefined && props.value.length >= props.maxCount;
  const disabled = (d: Date) => (min && before(d, min)) || (max && before(max, d)) || !!isDateDisabled?.(d) || (full && !picked(d));

  useEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    grid.current?.querySelector<HTMLButtonElement>(`[data-day="${focus.toDateString()}"]`)?.focus();
  }, [focus]);

  const moveFocus = (d: Date) => {
    moved.current = true;
    setFocus(d);
    const last = addMonths(month, months - 1);
    if (before(d, month) && !sameMonth(d, month)) setMonth(new Date(d.getFullYear(), d.getMonth(), 1));
    else if (!sameMonth(d, last) && before(last, d)) setMonth(new Date(d.getFullYear(), d.getMonth() - months + 1, 1));
  };

  const choose = (d: Date) => {
    if (disabled(d)) return;
    setFocus(d);
    if (props.mode === 'multiple') {
      const next = picked(d) ? props.value.filter((v) => !sameDay(v, d)) : [...props.value, d];
      return props.onChange(next.sort((a, b) => a.getTime() - b.getTime()));
    }
    if (props.mode !== 'range') return props.onChange(d);
    if (!anchor) {
      setAnchor(d);
      return;
    }
    const pair: DateRange = before(d, anchor) ? [d, anchor] : [anchor, d];
    setAnchor(null);
    setHovered(null);
    (props as RangeCalendarProps).onChange(pair);
  };

  const onKey = (e: KeyboardEvent) => {
    const step: Record<string, () => Date> = {
      ArrowLeft: () => addDays(focus, -1),
      ArrowRight: () => addDays(focus, 1),
      ArrowUp: () => addDays(focus, -7),
      ArrowDown: () => addDays(focus, 7),
      PageUp: () => addMonths(focus, e.shiftKey ? -12 : -1),
      PageDown: () => addMonths(focus, e.shiftKey ? 12 : 1),
      Home: () => addDays(focus, -((focus.getDay() - weekStartsOn + 7) % 7)),
      End: () => addDays(focus, 6 - ((focus.getDay() - weekStartsOn + 7) % 7)),
    };
    const next = step[e.key];
    if (!next) return;
    e.preventDefault();
    moveFocus(next());
  };

  const weekdays = monthGrid(today, weekStartsOn)[1]!.map((d) => ({
    short: formatDate(d, locale, { weekday: 'short' }).slice(0, 2),
    long: formatDate(d, locale, { weekday: 'long' }),
  }));

  // The range to paint: the chosen one, or the one being picked under the pointer.
  const painted: DateRange | null = range
    ? anchor
      ? hovered
        ? before(hovered, anchor)
          ? [hovered, anchor]
          : [anchor, hovered]
        : [anchor, anchor]
      : props.value
    : null;

  const shown = Array.from({ length: months }, (_, i) => addMonths(new Date(month.getFullYear(), month.getMonth(), 1), i));
  // Keep one day reachable with Tab even when the focused day has scrolled out of view.
  const tabbable = shown.some((m) => sameMonth(focus, m)) ? focus : shown[0]!;

  const renderMonth = (m: Date) => (
    <div key={m.toISOString()} className={styles.month}>
      <table role="grid" aria-multiselectable={multiple || undefined} className={styles.grid} aria-label={formatDate(m, locale, { month: 'long', year: 'numeric' })}>
        <thead>
          <tr>
            {weekdays.map((w) => (
              <th key={w.long} scope="col" abbr={w.long} className={styles.weekday}>{w.short}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {monthGrid(m, weekStartsOn).map((week, i) => (
            <tr key={i}>
              {week.map((d) => {
                const outside = !sameMonth(d, m);
                if (outside && months > 1) return <td key={d.toISOString()} className={styles.cell} />;
                const off = disabled(d);
                const isStart = painted ? sameDay(d, painted[0]) : false;
                const isEnd = painted ? sameDay(d, painted[1]) : false;
                const inRange = painted ? between(d, painted[0], painted[1]) : false;
                const selected = range ? isStart || isEnd : multiple ? picked(d) : sameDay(d, props.value as Date | null);
                return (
                  <td
                    key={d.toISOString()}
                    className={cx(
                      styles.cell,
                      inRange && !(isStart && isEnd) && styles.inRange,
                      isStart && !isEnd && styles.rangeStart,
                      isEnd && !isStart && styles.rangeEnd,
                    )}
                    aria-selected={selected || inRange || undefined}
                  >
                    <button
                      type="button"
                      data-day={d.toDateString()}
                      tabIndex={sameDay(d, tabbable) ? 0 : -1}
                      disabled={off}
                      aria-current={sameDay(d, today) ? 'date' : undefined}
                      aria-label={formatDate(d, locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                      className={cx(styles.day, selected && styles.selected, sameDay(d, today) && styles.today, outside && styles.outside)}
                      onClick={() => choose(d)}
                      onPointerEnter={() => anchor && setHovered(d)}
                      onFocus={() => anchor && setHovered(d)}
                    >
                      {d.getDate()}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );


  const presets = range ? props.presets : undefined;
  const [fromYear, toYear] = yearRange ?? [min?.getFullYear() ?? today.getFullYear() - 100, max?.getFullYear() ?? today.getFullYear() + 10];
  const years: number[] = [];
  for (let y = Math.max(toYear, month.getFullYear()); y >= Math.min(fromYear, month.getFullYear()); y--) years.push(y);
  const rangeValue = range ? props.value : null;

  return (
    <div className={cx(styles.calendar, className)} {...rest}>
      <div className={styles.body}>
        {presets && presets.length > 0 && (
          <div className={styles.presets} role="group" aria-label="Presets">
            {presets.map((p) => {
              const on = !!rangeValue && sameDay(rangeValue[0], p.range[0]) && sameDay(rangeValue[1], p.range[1]);
              return (
                <button
                  key={p.label}
                  type="button"
                  aria-pressed={on}
                  className={cx(styles.preset, on && styles.presetOn)}
                  onClick={() => {
                    setAnchor(null);
                    setMonth(new Date(p.range[0].getFullYear(), p.range[0].getMonth(), 1));
                    (props as RangeCalendarProps).onChange(p.range);
                  }}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        )}
        <div className={styles.months}>
          <div className={styles.header}>
            <CompactButton variant="ghost" aria-label="Previous month" onClick={() => setMonth(addMonths(month, -1))}>
              <Icon name="CaretLeft" />
            </CompactButton>
            {header === 'select' && months === 1 ? (
              <div className={styles.selects}>
                <Select
                  aria-label="Month"
                  size="sm"
                  value={String(month.getMonth())}
                  onValueChange={(v) => setMonth(new Date(month.getFullYear(), Number(v), 1))}
                  options={Array.from({ length: 12 }, (_, i) => ({ value: String(i), label: formatDate(new Date(2024, i, 1), locale, { month: 'long' }) }))}
                />
                <Select
                  aria-label="Year"
                  size="sm"
                  value={String(month.getFullYear())}
                  onValueChange={(v) => setMonth(new Date(Number(v), month.getMonth(), 1))}
                  options={years.map((y) => ({ value: String(y), label: String(y) }))}
                />
              </div>
            ) : (
              <div className={styles.titles} aria-live="polite">
                {shown.map((m) => (
                  <span key={m.toISOString()} className={styles.monthTitle}>{formatDate(m, locale, { month: 'long', year: 'numeric' })}</span>
                ))}
              </div>
            )}
            <CompactButton variant="ghost" aria-label="Next month" onClick={() => setMonth(addMonths(month, 1))}>
              <Icon name="CaretRight" />
            </CompactButton>
          </div>
          <div ref={grid} className={styles.monthRow} onKeyDown={onKey} onPointerLeave={() => setHovered(null)}>
            {shown.map(renderMonth)}
          </div>
        </div>
      </div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}
