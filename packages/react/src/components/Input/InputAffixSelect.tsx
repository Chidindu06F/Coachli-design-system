import { forwardRef } from 'react';
import type { ReactNode, SelectHTMLAttributes } from 'react';
import { Icon } from '../../internal/Icon';
import { useControllable } from '../../internal/useControllable';
import styles from './InputAffixSelect.module.css';

export interface InputAffixSelectOption {
  value: string;
  /** Short text shown in the box, like "USD". */
  label: string;
  /** A flag, logo or icon before the label; it fits a 20px square. Figma: Icon. */
  icon?: ReactNode;
}

export interface InputAffixSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'defaultValue' | 'onChange'> {
  options: InputAffixSelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Show the option's label next to its icon. Turn off for icon-only pickers, like a social platform. Figma: Show label. */
  showLabel?: boolean;
  /** Name for screen readers, like "Currency". */
  'aria-label': string;
}

/**
 * A small picker for an Input's `prefix` or `suffix`, like the currency in a price field.
 * Shows the option's icon and label with a caret; a native select underneath handles keyboard and screen readers.
 * Figma: Input affix, Kind=Select.
 */
export const InputAffixSelect = forwardRef<HTMLSelectElement, InputAffixSelectProps>(function InputAffixSelect(
  { options, value, defaultValue, onValueChange, disabled, showLabel = true, className, ...rest },
  ref,
) {
  const [current, setCurrent] = useControllable(value, defaultValue ?? options[0]?.value ?? '', onValueChange);
  const selected = options.find((o) => o.value === current) ?? options[0];
  return (
    <span className={[styles.root, disabled && styles.disabled, className].filter(Boolean).join(' ')}>
      {selected?.icon && <span className={styles.icon} aria-hidden="true">{selected.icon}</span>}
      {showLabel && <span className={styles.label} aria-hidden="true">{selected?.label}</span>}
      <Icon name="CaretDown" className={styles.caret} />
      <select ref={ref} className={styles.native} value={current} disabled={disabled} onChange={(e) => setCurrent(e.target.value)} {...rest}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </span>
  );
});
