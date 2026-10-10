import { forwardRef, useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { mergeRefs, Portal, useDismiss, useFloating } from '../../internal/floating';
import { Icon } from '../../internal/Icon';
import { useControllable } from '../../internal/useControllable';
import { Field } from '../Field';
import type { FieldProps } from '../Field';
import inputStyles from '../Input/Input.module.css';
import menuStyles from '../Menu/Menu.module.css';
import styles from './Select.module.css';

export interface SelectOption {
  value: string;
  label: string;
  /** Icon or flag before the label. Figma: L icon, Flag. */
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  /** Icon at the start of the box, shown when the chosen option has none. Figma: L icon. */
  icon?: ReactNode;
  /** 32, 40 or 48px. Figma: Size. */
  size?: 'sm' | 'md' | 'lg';
  invalid?: boolean;
  /** Green border when the value checks out. Figma: State=Success. */
  valid?: boolean;
  disabled?: boolean;
  /** Form field name. A hidden input carries the value. */
  name?: string;
  id?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
  required?: boolean;
  className?: string;
}

/** Picks one option from a known list. Typing jumps to a match. Figma: Select. */
export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  { options, value, defaultValue, onValueChange, placeholder = 'Select an option', icon, size = 'md', invalid, valid, disabled, name, id, className, required, ...aria },
  ref,
) {
  const listId = useId();
  const [v, setV] = useControllable<string | undefined>(value, defaultValue, onValueChange as (v: string | undefined) => void);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const anchor = useRef<HTMLButtonElement | null>(null);
  const { floating, style } = useFloating(anchor, open, { matchWidth: true });
  useDismiss(open, () => setOpen(false), [anchor, floating]);
  const typed = useRef({ text: '', at: 0 });
  const selected = options.find((o) => o.value === v);

  useEffect(() => {
    if (open) setActive(Math.max(0, options.findIndex((o) => o.value === v)));
  }, [open, options, v]);

  useEffect(() => {
    if (open && active >= 0) floating.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [open, active, floating]);

  const move = (from: number, dir: 1 | -1) => {
    for (let i = 1; i <= options.length; i++) {
      const n = (from + dir * i + options.length) % options.length;
      if (!options[n]?.disabled) return n;
    }
    return from;
  };
  const choose = (i: number) => {
    const o = options[i];
    if (!o || o.disabled) return;
    setV(o.value);
    setOpen(false);
  };

  const onKey = (e: KeyboardEvent) => {
    if (disabled) return;
    if (e.key.length === 1 && /\S/.test(e.key)) {
      // Typeahead: jump to the first option that starts with what was typed.
      const now = Date.now();
      typed.current.text = now - typed.current.at < 600 ? typed.current.text + e.key.toLowerCase() : e.key.toLowerCase();
      typed.current.at = now;
      const i = options.findIndex((o) => !o.disabled && o.label.toLowerCase().startsWith(typed.current.text));
      if (i >= 0) (open ? setActive(i) : setV(options[i]!.value));
      return;
    }
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (e.key === 'ArrowDown') setActive(move(active, 1));
    else if (e.key === 'ArrowUp') setActive(move(active, -1));
    else if (e.key === 'Home') setActive(move(-1, 1));
    else if (e.key === 'End') setActive(move(options.length, -1));
    else if (e.key === 'Enter' || e.key === ' ') choose(active);
    else if (e.key === 'Tab') setOpen(false);
    else return;
    if (e.key !== 'Tab') e.preventDefault();
  };

  return (
    <>
      <button
        ref={mergeRefs(ref, anchor)}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
        aria-invalid={invalid || aria['aria-invalid'] || undefined}
        aria-label={aria['aria-label']}
        aria-describedby={aria['aria-describedby']}
        aria-required={required || undefined}
        disabled={disabled}
        className={cx(inputStyles.box, inputStyles[size], styles.trigger, (invalid || aria['aria-invalid']) && inputStyles.invalid, valid && !invalid && !aria['aria-invalid'] && !disabled && inputStyles.valid, disabled && inputStyles.disabled, className)}
        onClick={() => setOpen(!open)}
        onKeyDown={onKey}
      >
        {(selected?.icon ?? icon) && <span className={inputStyles.icon} aria-hidden="true">{selected?.icon ?? icon}</span>}
        <span className={cx(styles.value, !selected && styles.placeholder)}>{selected?.label ?? placeholder}</span>
        <Icon name="CaretDown" className={cx(styles.caret, open && styles.caretOpen)} />
      </button>
      {name && <input type="hidden" name={name} value={v ?? ''} />}
      {open && (
        <Portal>
          <div ref={floating} id={listId} role="listbox" className={menuStyles.menu} style={style}>
            {options.map((o, i) => (
              <div
                key={o.value}
                id={`${listId}-${i}`}
                data-index={i}
                role="option"
                aria-selected={o.value === v}
                aria-disabled={o.disabled || undefined}
                data-active={i === active}
                className={menuStyles.item}
                onPointerEnter={() => !o.disabled && setActive(i)}
                onPointerDown={(e) => e.preventDefault()}
                onClick={() => choose(i)}
              >
                {o.icon && <span className={menuStyles.icon} aria-hidden="true">{o.icon}</span>}
                <span className={menuStyles.itemLabel}>{o.label}</span>
                {o.value === v && <Icon name="Check" className={menuStyles.check} />}
              </div>
            ))}
          </div>
        </Portal>
      )}
    </>
  );
});

export interface SelectFieldProps extends Omit<SelectProps, 'aria-describedby' | 'aria-invalid'>, Pick<FieldProps, 'label' | 'hint' | 'error' | 'success' | 'optional' | 'info'> {
  fieldClassName?: string;
}

/** A Select with a label and hint. Figma: Select field. */
export const SelectField = forwardRef<HTMLButtonElement, SelectFieldProps>(function SelectField(
  { label, hint, error, success, optional, info, required, id, fieldClassName, valid, ...rest },
  ref,
) {
  return (
    <Field label={label} hint={hint} error={error} success={success} required={required} optional={optional} info={info} controlId={id} className={fieldClassName}>
      {(c) => <Select ref={ref} {...rest} {...c} valid={valid || (success != null && error == null)} />}
    </Field>
  );
});
