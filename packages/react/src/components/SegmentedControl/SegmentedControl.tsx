import { useRef } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { useControllable } from '../../internal/useControllable';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import styles from './SegmentedControl.module.css';

export interface SegmentedOption {
  value: string;
  /** Text label. Leave it out for an icon-only option, and set aria-label. */
  label?: ReactNode;
  icon?: ReactNode;
  'aria-label'?: string;
  disabled?: boolean;
}

/** Parts you can style with `classNames` and `styles`. */
export type SegmentedControlPart = 'root' | 'segment' | 'icon';

export interface SegmentedControlProps extends PartsProps<SegmentedControlPart> {
  options: SegmentedOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** 28 or 36px segments. Figma: Size. */
  size?: 'sm' | 'md';
  /** Fit the options, or share the full width equally. Figma: Width. */
  fullWidth?: boolean;
  /** Names the group for screen readers, like "View". */
  'aria-label': string;
  className?: string;
}

/** Picks one of 2 to 5 options and applies it straight away, like Day, Week or Month. */
export function SegmentedControl({ options, value, defaultValue, onValueChange, size = 'md', fullWidth, className, classNames, styles: partStyles, ...rest }: SegmentedControlProps) {
  const part = parts<SegmentedControlPart>('segmented-control', { classNames, styles: partStyles });
  const [v, setV] = useControllable(value, defaultValue ?? options[0]?.value ?? '', onValueChange);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const enabled = options.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0);

  const onKey = (e: KeyboardEvent) => {
    const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const at = enabled.indexOf(options.findIndex((o) => o.value === v));
    const next =
      e.key === 'Home' ? enabled[0]
      : e.key === 'End' ? enabled[enabled.length - 1]
      : enabled[(at + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1) + enabled.length) % enabled.length];
    if (next === undefined) return;
    setV(options[next]!.value);
    refs.current[next]?.focus();
  };

  return (
    <div role="radiogroup" aria-label={rest['aria-label']} {...part('root', [styles.track, styles[size], fullWidth && styles.full, className])} onKeyDown={onKey}>
      {options.map((o, i) => {
        const on = o.value === v;
        return (
          <button
            key={o.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={on}
            aria-label={o['aria-label']}
            tabIndex={on ? 0 : -1}
            disabled={o.disabled}
            {...part('segment', [styles.segment, !o.label && styles.iconOnly])}
            onClick={() => setV(o.value)}
          >
            {o.icon && <span {...part('icon', styles.icon)} aria-hidden="true">{o.icon}</span>}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
