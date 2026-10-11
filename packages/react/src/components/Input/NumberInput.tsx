import { forwardRef } from 'react';
import { cx } from '../../internal/cx';
import { Icon } from '../../internal/Icon';
import { useControllable } from '../../internal/useControllable';
import { CompactButton } from '../CompactButton';
import { InputField } from './Input';
import type { InputFieldProps } from './Input';
import styles from './NumberInput.module.css';

export interface NumberInputProps
  extends Omit<InputFieldProps, 'type' | 'value' | 'defaultValue' | 'onChange' | 'iconLeft' | 'iconRight' | 'min' | 'max' | 'step'> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

/** A number with minus and plus buttons on either side. Figma: Number input. */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  { value, defaultValue = 0, onValueChange, min = -Infinity, max = Infinity, step = 1, disabled, size = 'md', ...rest },
  ref,
) {
  const [n, setN] = useControllable(value, defaultValue, onValueChange);
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  const btn = size === 'sm' ? 'md' : 'lg';
  return (
    <InputField
      ref={ref}
      {...rest}
      size={size}
      disabled={disabled}
      className={cx(styles.number, rest.className)}
      inputMode="decimal"
      value={String(n)}
      onChange={(e) => {
        const v = Number(e.target.value);
        if (!Number.isNaN(v)) setN(clamp(v));
      }}
      iconLeft={
        <span className={styles.step}>
          <CompactButton variant="ghost" size={btn} aria-label="Decrease" disabled={disabled || n <= min} onClick={() => setN(clamp(n - step))}>
            <Icon name="Minus" />
          </CompactButton>
        </span>
      }
      iconRight={
        <CompactButton variant="ghost" size={btn} aria-label="Increase" disabled={disabled || n >= max} onClick={() => setN(clamp(n + step))}>
          <Icon name="Plus" />
        </CompactButton>
      }
    />
  );
});
