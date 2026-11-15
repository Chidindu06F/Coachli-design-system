import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import { Icon } from '../../internal/Icon';
import styles from './Chip.module.css';

export type ChipSize = 'sm' | 'md';

/** Parts you can style with `classNames` and `styles`. */
export type ChipPart = 'root' | 'check' | 'label';

export interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'>, PartsProps<ChipPart> {
  /** sm is 28px tall, md is 32px. Figma: Size. */
  size?: ChipSize;
  /** On or off. Shows a check and sets aria-pressed. Figma: Selected. */
  selected?: boolean;
  /** Called with the new value when the chip is clicked. */
  onSelectedChange?: (selected: boolean) => void;
  /** The text. Figma: Label. */
  children: ReactNode;
}

/** A choice the user can switch on and off, like an interest or a filter. Use several in a wrapping row. */
export const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  { size = 'md', selected = false, onSelectedChange, onClick, children, className, classNames, styles: partStyles, style, type = 'button', ...rest },
  ref,
) {
  const part = parts<ChipPart>('chip', { classNames, styles: partStyles });
  return (
    <button
      ref={ref}
      type={type}
      aria-pressed={selected}
      {...part('root', [styles.chip, styles[size], selected && styles.selected, className], style)}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) onSelectedChange?.(!selected);
      }}
      {...rest}
    >
      {selected && (
        <span {...part('check', styles.check)} aria-hidden="true">
          <Icon name="Check" />
        </span>
      )}
      <span {...part('label', styles.label)}>{children}</span>
    </button>
  );
});
