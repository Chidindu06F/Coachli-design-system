import { useId } from 'react';
import type { HTMLAttributes, LabelHTMLAttributes, ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { Icon } from '../../internal/Icon';
import { CompactButton } from '../CompactButton';
import { Tooltip } from '../Tooltip';
import styles from './Field.module.css';

export interface FieldLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  /** Adds a red asterisk. Figma: Indicator=Required. */
  required?: boolean;
  /** Adds "(Optional)". Use either required or optional across a form, not both. Figma: Indicator=Optional. */
  optional?: boolean;
  /** Extra help shown in a Tooltip from an info button. Figma: Info icon. */
  info?: ReactNode;
  children: ReactNode;
}

/** The label above a form control. Labels have no disabled state; only the control fades. */
export function FieldLabel({ required, optional, info, className, children, ...rest }: FieldLabelProps) {
  return (
    <span className={cx(styles.labelRow, className)}>
      <label className={styles.label} {...rest}>
        {children}
        {required && <span className={styles.required} aria-hidden="true">*</span>}
        {optional && <span className={styles.optional}>(Optional)</span>}
      </label>
      {info && (
        <Tooltip content={info}>
          <CompactButton variant="ghost" size="lg" aria-label="More information">
            <Icon name="Info" />
          </CompactButton>
        </Tooltip>
      )}
    </span>
  );
}

export interface FieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  label?: ReactNode;
  required?: boolean;
  optional?: boolean;
  info?: ReactNode;
  /** Help text under the control. Figma: Hint. */
  hint?: ReactNode;
  /** An error message. Replaces the hint, turns red and marks the control invalid. Figma: State=Error. */
  error?: ReactNode;
  /** Shown at the end of the hint row, like "86 / 2,000". */
  count?: ReactNode;
  /** Render function that receives the ids and state to put on the control. */
  children: (control: { id: string; 'aria-describedby'?: string; 'aria-invalid'?: true; required?: boolean }) => ReactNode;
  /** Id for the control. Generated when left out. */
  controlId?: string;
}

/** Lays out a label, a control and a hint row. Used by the *Field components. */
export function Field({ label, required, optional, info, hint, error, count, children, controlId, className, ...rest }: FieldProps) {
  const autoId = useId();
  const id = controlId ?? autoId;
  const message = error ?? hint;
  const hintId = message ? `${id}-hint` : undefined;
  return (
    <div className={cx(styles.field, className)} {...rest}>
      {label && (
        <FieldLabel htmlFor={id} required={required} optional={optional} info={info}>
          {label}
        </FieldLabel>
      )}
      {children({ id, 'aria-describedby': hintId, 'aria-invalid': error ? true : undefined, required })}
      {(message || count) && (
        <div className={styles.hintRow}>
          {message && (
            <span id={hintId} className={cx(styles.hint, error != null && styles.error)}>
              {error != null && <Icon name="WarningCircle" className={styles.hintIcon} />}
              {message}
            </span>
          )}
          {count && <span className={styles.count}>{count}</span>}
        </div>
      )}
    </div>
  );
}
