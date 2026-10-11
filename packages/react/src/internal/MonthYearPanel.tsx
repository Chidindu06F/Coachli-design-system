import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, KeyboardEventHandler } from 'react';
import { cx } from './cx';
import { Icon } from './Icon';
import { CompactButton } from '../components/CompactButton';
import styles from './MonthYearPanel.module.css';

export interface MonthYearPanelProps {
  /** Any day in the month on show. */
  value: Date;
  /** Called with the first day of the month (or year) people pick. */
  onSelect: (date: Date) => void;
  /** Pick a month, or only a year (for a year view). */
  unit?: 'month' | 'year';
  fromYear?: number;
  toYear?: number;
  locale?: string;
  className?: string;
  onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
}

/**
 * Twelve months under the year, or twelve years. Opens from a calendar's title to jump
 * straight to another month or year. Arrow keys move around the grid.
 */
export function MonthYearPanel({ value, onSelect, unit = 'month', fromYear = -Infinity, toYear = Infinity, locale, className, onKeyDown }: MonthYearPanelProps) {
  const [view, setView] = useState<'months' | 'years'>(unit === 'year' ? 'years' : 'months');
  const [year, setYear] = useState(value.getFullYear());
  const [decade, setDecade] = useState(() => value.getFullYear() - (value.getFullYear() % 12));
  const grid = useRef<HTMLDivElement | null>(null);

  // Start on the chosen month or year.
  useEffect(() => {
    const g = grid.current;
    (g?.querySelector<HTMLButtonElement>('[aria-current="true"]:not(:disabled)') ?? g?.querySelector<HTMLButtonElement>('button:not(:disabled)'))?.focus();
  }, [view]);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -3, ArrowDown: 3 };
    if (!(e.key in moves)) return;
    const buttons = [...(grid.current?.querySelectorAll<HTMLButtonElement>('button') ?? [])];
    const i = buttons.indexOf(document.activeElement as HTMLButtonElement);
    const next = buttons[Math.max(0, Math.min(buttons.length - 1, i + moves[e.key]!))];
    if (next) {
      e.preventDefault();
      next.focus();
    }
  };

  const yearName = (y: number) => String(y);
  const years = Array.from({ length: 12 }, (_, i) => decade + i);

  return (
    <div className={cx(styles.panel, className)} onKeyDown={onKeyDown}>
      <div className={styles.head}>
        <CompactButton
          variant="ghost"
          aria-label={view === 'months' ? 'Previous year' : 'Previous years'}
          disabled={view === 'months' ? year - 1 < fromYear : decade - 1 < fromYear}
          onClick={() => (view === 'months' ? setYear(year - 1) : setDecade(decade - 12))}
        >
          <Icon name="CaretLeft" />
        </CompactButton>
        {view === 'months' ? (
          <button type="button" className={styles.headButton} aria-label={`${year}, choose a year`} onClick={() => setView('years')}>
            {yearName(year)}
            <Icon name="CaretDown" className={styles.caret} />
          </button>
        ) : (
          <span className={styles.headLabel} aria-live="polite">
            {decade} – {decade + 11}
          </span>
        )}
        <CompactButton
          variant="ghost"
          aria-label={view === 'months' ? 'Next year' : 'Next years'}
          disabled={view === 'months' ? year + 1 > toYear : decade + 12 > toYear}
          onClick={() => (view === 'months' ? setYear(year + 1) : setDecade(decade + 12))}
        >
          <Icon name="CaretRight" />
        </CompactButton>
      </div>
      <div ref={grid} className={styles.grid} onKeyDown={onKey}>
        {view === 'months'
          ? Array.from({ length: 12 }, (_, m) => {
              const current = year === value.getFullYear() && m === value.getMonth();
              return (
                <button
                  key={m}
                  type="button"
                  className={cx(styles.cell, current && styles.selected)}
                  aria-current={current || undefined}
                  aria-label={new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(new Date(year, m, 1))}
                  onClick={() => onSelect(new Date(year, m, 1))}
                >
                  {new Intl.DateTimeFormat(locale, { month: 'short' }).format(new Date(2024, m, 1))}
                </button>
              );
            })
          : years.map((y) => {
              const current = y === (unit === 'year' ? value.getFullYear() : year);
              return (
                <button
                  key={y}
                  type="button"
                  disabled={y < fromYear || y > toYear}
                  className={cx(styles.cell, current && styles.selected)}
                  aria-current={current || undefined}
                  onClick={() => {
                    if (unit === 'year') onSelect(new Date(y, value.getMonth(), 1));
                    else {
                      setYear(y);
                      setView('months');
                    }
                  }}
                >
                  {y}
                </button>
              );
            })}
      </div>
    </div>
  );
}
