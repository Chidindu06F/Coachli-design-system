import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, HTMLAttributes, KeyboardEvent, ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { Icon } from '../../internal/Icon';
import { useControllable } from '../../internal/useControllable';
import { Button } from '../Button';
import { CompactButton } from '../CompactButton';
import { addDays, addMonths, before, formatDate, monthGrid, sameDay, sameMonth, startOfDay } from '../DatePicker/dates';
import { Popover } from '../Popover';
import { SegmentedControl } from '../SegmentedControl';
import { Select } from '../Select';
import { TAG_COLORS } from '../Tag';
import type { TagColor } from '../Tag';
import styles from './EventCalendar.module.css';

export interface CalendarEvent {
  id: string;
  title: string;
  /** First day of the event. */
  start: Date;
  /** Last day, for events over several days. Leave out for a one-day event. */
  end?: Date;
  /** A preset colour like "blue", or any CSS colour. Defaults to neutral. Uses the Tag colours. */
  color?: TagColor | (string & {});
}

export type EventCalendarView = 'month' | 'year';

export interface EventCalendarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  events?: CalendarEvent[];
  /** The selected day. */
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (date: Date) => void;
  /** Any day in the month on show. */
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  /** A month of days, or the twelve months of a year. Figma: View. */
  view?: EventCalendarView;
  defaultView?: EventCalendarView;
  onViewChange?: (view: EventCalendarView) => void;
  /**
   * Full: year and month menus and a Month and Year switch, to jump anywhere.
   * Simple: the title with Today and arrows. Figma: Header.
   */
  header?: 'full' | 'simple';
  /** Years in the year menu. Defaults to ten years either side of today. */
  yearRange?: [number, number];
  /** Event rows shown in a day before "+2 more". */
  maxEvents?: number;
  /** 0 for Sunday, 1 for Monday. */
  weekStartsOn?: 0 | 1;
  /** For month and weekday names. Defaults to the browser's language. */
  locale?: string;
  /** Extra content inside a day, under its events, like a price or a status. */
  renderDay?: (date: Date, events: CalendarEvent[]) => ReactNode;
  /** Extra content inside a month in the year view. */
  renderMonth?: (month: Date, events: CalendarEvent[]) => ReactNode;
  onEventClick?: (event: CalendarEvent) => void;
}

const DAY = 86400000;
const dayIndex = (d: Date, from: Date) => Math.round((startOfDay(d).getTime() - from.getTime()) / DAY);
const endOf = (e: CalendarEvent) => (e.end && before(e.start, e.end) ? e.end : e.start);
const onDay = (e: CalendarEvent, d: Date) => !before(d, e.start) && !before(endOf(e), d);

function colourProps(color: CalendarEvent['color']): { className?: string; style?: CSSProperties } {
  if (!color || color === 'neutral') return { className: styles.neutral };
  if ((TAG_COLORS as readonly string[]).includes(color)) return { className: styles[color] };
  return { className: styles.custom, style: { '--event-custom': color } as CSSProperties };
}

/** Lays out one week's events in rows, so events that overlap sit on different rows. */
function layoutWeek(events: CalendarEvent[], weekStart: Date) {
  const weekEnd = addDays(weekStart, 6);
  const items = events
    .filter((e) => !before(endOf(e), weekStart) && !before(weekEnd, e.start))
    .map((e) => ({ event: e, from: Math.max(0, dayIndex(e.start, weekStart)), to: Math.min(6, dayIndex(endOf(e), weekStart)) }))
    .sort((a, b) => a.from - b.from || b.to - b.from - (a.to - a.from));
  const rows: boolean[][] = [];
  return items.map((item) => {
    let row = 0;
    while (rows[row]?.slice(item.from, item.to + 1).some(Boolean)) row++;
    rows[row] ??= new Array(7).fill(false);
    for (let i = item.from; i <= item.to; i++) rows[row]![i] = true;
    return { ...item, row };
  });
}

/**
 * A full-size calendar for planning: a month of days with events, or a year of months.
 * Events over several days run as one bar across them. On narrow screens, days show dots
 * and the chosen day's events list underneath. Figma: Event calendar.
 */
export function EventCalendar({
  events = [],
  value,
  defaultValue = null,
  onValueChange,
  month,
  defaultMonth,
  onMonthChange,
  view,
  defaultView = 'month',
  onViewChange,
  header = 'full',
  yearRange,
  maxEvents = 3,
  weekStartsOn = 1,
  locale,
  renderDay,
  renderMonth,
  onEventClick,
  className,
  ...rest
}: EventCalendarProps) {
  const today = startOfDay(new Date());
  const [selected, setSelected] = useControllable<Date | null>(value, defaultValue, (d) => d && onValueChange?.(d));
  const [shown, setShown] = useControllable<Date>(month, startOfDay(defaultMonth ?? defaultValue ?? today), onMonthChange);
  const [mode, setMode] = useControllable<EventCalendarView>(view, defaultView, onViewChange);
  const [focus, setFocus] = useState(() => startOfDay(selected ?? today));
  const grid = useRef<HTMLDivElement | null>(null);
  const moved = useRef(false);

  const first = new Date(shown.getFullYear(), shown.getMonth(), 1);
  const weeks = useMemo(() => {
    const all = monthGrid(first, weekStartsOn);
    // Drop a sixth week that is all next month.
    return all.filter((w, i) => i < 5 || sameMonth(w[0]!, first));
  }, [first.getTime(), weekStartsOn]); // eslint-disable-line react-hooks/exhaustive-deps

  const [fromYear, toYear] = yearRange ?? [today.getFullYear() - 10, today.getFullYear() + 10];
  const years = [];
  for (let y = Math.min(fromYear, shown.getFullYear()); y <= Math.max(toYear, shown.getFullYear()); y++) years.push(y);
  const monthNames = Array.from({ length: 12 }, (_, m) => formatDate(new Date(2024, m, 1), locale, { month: 'short' }));
  const weekdays = weeks[0]!.map((d) => ({ short: formatDate(d, locale, { weekday: 'short' }), long: formatDate(d, locale, { weekday: 'long' }) }));

  const goMonth = (d: Date) => setShown(new Date(d.getFullYear(), d.getMonth(), 1));
  const step = (n: number) => goMonth(mode === 'year' ? addMonths(first, n * 12) : addMonths(first, n));
  const choose = (d: Date) => {
    setSelected(d);
    setFocus(d);
    if (!sameMonth(d, first)) goMonth(d);
  };

  useEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    grid.current?.querySelector<HTMLButtonElement>(`[data-day="${focus.toDateString()}"]`)?.focus();
  }, [focus, shown]);

  const onKey = (e: KeyboardEvent) => {
    const moves: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (!(e.key in moves) || !(e.target as HTMLElement).dataset.day) return;
    e.preventDefault();
    const next = addDays(focus, moves[e.key]!);
    moved.current = true;
    setFocus(next);
    if (!sameMonth(next, first)) goMonth(next);
  };

  const title = mode === 'year' ? String(first.getFullYear()) : formatDate(first, locale, { month: 'long', year: 'numeric' });
  const tabbable = sameMonth(focus, first) ? focus : first;
  const agendaDay = selected ?? (sameMonth(today, first) ? today : first);
  const agenda = events.filter((e) => onDay(e, agendaDay));
  const span = (e: CalendarEvent) =>
    e.end && !sameDay(e.start, e.end)
      ? `${formatDate(e.start, locale, { day: 'numeric', month: 'short' })} to ${formatDate(endOf(e), locale, { day: 'numeric', month: 'short' })}`
      : formatDate(e.start, locale, { weekday: 'long', day: 'numeric', month: 'long' });

  const eventButton = (e: CalendarEvent, extra?: string, style?: CSSProperties) => {
    const c = colourProps(e.color);
    return (
      <button
        key={e.id}
        type="button"
        className={cx(styles.event, c.className, extra)}
        style={{ ...c.style, ...style }}
        aria-label={`${e.title}, ${span(e)}`}
        onClick={() => onEventClick?.(e)}
      >
        <span className={styles.eventTitle}>{e.title}</span>
      </button>
    );
  };

  return (
    <div className={cx(styles.root, className)} {...rest}>
      <div className={styles.header}>
        <div className={styles.lead}>
          <h2 className={styles.title} aria-live="polite">{title}</h2>
          <span className={styles.nav}>
            <CompactButton variant="ghost" aria-label={mode === 'year' ? 'Previous year' : 'Previous month'} onClick={() => step(-1)}>
              <Icon name="CaretLeft" />
            </CompactButton>
            <CompactButton variant="ghost" aria-label={mode === 'year' ? 'Next year' : 'Next month'} onClick={() => step(1)}>
              <Icon name="CaretRight" />
            </CompactButton>
          </span>
          <Button variant="secondary" size="sm" onClick={() => choose(today)}>
            Today
          </Button>
        </div>
        {header === 'full' && (
          <div className={styles.controls}>
            <Select
              aria-label="Year"
              size="sm"
              className={styles.select}
              value={String(first.getFullYear())}
              onValueChange={(y) => goMonth(new Date(Number(y), first.getMonth(), 1))}
              options={years.map((y) => ({ value: String(y), label: String(y) }))}
            />
            {mode === 'month' && (
              <Select
                aria-label="Month"
                size="sm"
                className={styles.select}
                value={String(first.getMonth())}
                onValueChange={(m) => goMonth(new Date(first.getFullYear(), Number(m), 1))}
                options={monthNames.map((n, m) => ({ value: String(m), label: n }))}
              />
            )}
            <SegmentedControl
              aria-label="View"
              size="sm"
              value={mode}
              onValueChange={(v) => setMode(v as EventCalendarView)}
              options={[
                { value: 'month', label: 'Month' },
                { value: 'year', label: 'Year' },
              ]}
            />
          </div>
        )}
      </div>

      {mode === 'year' ? (
        <div className={styles.year} role="list" aria-label={title}>
          {monthNames.map((_, m) => {
            const mDate = new Date(first.getFullYear(), m, 1);
            const mEnd = new Date(first.getFullYear(), m + 1, 0);
            const inMonth = events.filter((e) => !before(endOf(e), mDate) && !before(mEnd, e.start));
            const current = sameMonth(mDate, today);
            return (
              <div key={m} role="listitem" className={styles.monthCellWrap}>
                <button
                  type="button"
                  className={cx(styles.monthCell, current && styles.current)}
                  aria-current={current ? 'date' : undefined}
                  onClick={() => {
                    goMonth(mDate);
                    setMode('month');
                  }}
                >
                  <span className={styles.monthName}>{formatDate(mDate, locale, { month: 'long' })}</span>
                  <span className={styles.monthCount}>
                    {inMonth.length === 0 ? 'No events' : `${inMonth.length} ${inMonth.length === 1 ? 'event' : 'events'}`}
                  </span>
                  {inMonth.length > 0 && (
                    <span className={styles.monthDots} aria-hidden="true">
                      {inMonth.slice(0, 6).map((e) => {
                        const c = colourProps(e.color);
                        return <span key={e.id} className={cx(styles.dot, c.className)} style={c.style} />;
                      })}
                    </span>
                  )}
                </button>
                {renderMonth && <div className={styles.extra}>{renderMonth(mDate, inMonth)}</div>}
              </div>
            );
          })}
        </div>
      ) : (
        <>
          <div ref={grid} className={styles.month} role="grid" aria-label={title} onKeyDown={onKey}>
            <div className={styles.weekdays} role="row">
              {weekdays.map((w) => (
                <span key={w.long} role="columnheader" className={styles.weekday}>
                  <abbr title={w.long}>{w.short}</abbr>
                </span>
              ))}
            </div>
            {weeks.map((week) => {
              const placed = layoutWeek(events, week[0]!);
              const hidden = week.map((d, i) => placed.filter((p) => p.row >= maxEvents && p.from <= i && p.to >= i).map((p) => p.event));
              const rows = Math.min(maxEvents, placed.reduce((n, p) => Math.max(n, p.row + 1), 0));
              return (
                <div
                  key={week[0]!.toISOString()}
                  role="row"
                  className={styles.week}
                  style={{ '--rows': rows + (hidden.some((h) => h.length) ? 1 : 0) } as CSSProperties}
                >
                  {week.map((d, i) => {
                    const dayEvents = events.filter((e) => onDay(e, d));
                    const isSelected = sameDay(d, selected);
                    return (
                      <div
                        key={d.toISOString()}
                        role="gridcell"
                        aria-selected={isSelected || undefined}
                        className={cx(styles.day, !sameMonth(d, first) && styles.outside, isSelected && styles.selected)}
                        style={{ gridColumn: i + 1 }}
                      >
                        <button
                          type="button"
                          data-day={d.toDateString()}
                          tabIndex={sameDay(d, tabbable) ? 0 : -1}
                          aria-current={sameDay(d, today) ? 'date' : undefined}
                          aria-label={`${formatDate(d, locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}${dayEvents.length ? `, ${dayEvents.length} ${dayEvents.length === 1 ? 'event' : 'events'}` : ''}`}
                          className={cx(styles.date, sameDay(d, today) && styles.today)}
                          onClick={() => choose(d)}
                          onFocus={() => setFocus(d)}
                        >
                          {d.getDate()}
                        </button>
                        {dayEvents.length > 0 && (
                          <span className={styles.dots} aria-hidden="true">
                            {dayEvents.slice(0, 3).map((e) => {
                              const c = colourProps(e.color);
                              return <span key={e.id} className={cx(styles.dot, c.className)} style={c.style} />;
                            })}
                          </span>
                        )}
                        {renderDay && <div className={styles.extra}>{renderDay(d, dayEvents)}</div>}
                      </div>
                    );
                  })}
                  {placed
                    .filter((p) => p.row < maxEvents)
                    .map((p) =>
                      eventButton(
                        p.event,
                        cx(styles.bar, before(p.event.start, week[0]!) && styles.continuesBefore, before(week[6]!, endOf(p.event)) && styles.continuesAfter),
                        { gridColumn: `${p.from + 1} / ${p.to + 2}`, gridRow: p.row + 2 },
                      ),
                    )}
                  {hidden.map((list, i) =>
                    list.length ? (
                      <span key={i} className={styles.moreWrap} style={{ gridColumn: i + 1, gridRow: maxEvents + 2 }}>
                        <Popover
                          title={formatDate(week[i]!, locale, { weekday: 'long', day: 'numeric', month: 'long' })}
                          showClose
                          trigger={<button type="button" className={styles.more}>+{list.length} more</button>}
                        >
                          <span className={styles.popList}>{events.filter((e) => onDay(e, week[i]!)).map((e) => eventButton(e, styles.listEvent))}</span>
                        </Popover>
                      </span>
                    ) : null,
                  )}
                </div>
              );
            })}
          </div>
          <section className={styles.agenda} aria-label={`Events on ${formatDate(agendaDay, locale, { day: 'numeric', month: 'long' })}`}>
            <h3 className={styles.agendaTitle}>{formatDate(agendaDay, locale, { weekday: 'long', day: 'numeric', month: 'long' })}</h3>
            {agenda.length === 0 ? (
              <p className={styles.empty}>No events</p>
            ) : (
              <span className={styles.popList}>
                {agenda.map((e) => eventButton(e, styles.listEvent))}
              </span>
            )}
          </section>
        </>
      )}
    </div>
  );
}
