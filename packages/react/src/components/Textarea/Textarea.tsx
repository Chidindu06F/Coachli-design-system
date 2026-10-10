import { forwardRef, useState } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import { cx } from '../../internal/cx';
import { StatusIcon } from '../../internal/StatusIcon';
import { Field } from '../Field';
import type { FieldProps } from '../Field';
import styles from './Textarea.module.css';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Text size and padding. Figma: Size. */
  size?: 'sm' | 'md' | 'lg';
  /** Lets people drag the corner to make it taller. Figma: Resize handle. */
  resize?: boolean;
  invalid?: boolean;
  /** A green check at the end once the value checks out. Figma: State=Success. */
  valid?: boolean;
}

/** A multi-line text box. Use TextareaField to add a label, hint and count. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { size = 'md', resize = true, invalid, valid, className, rows = 4, ...rest },
  ref,
) {
  const isInvalid = invalid || !!rest['aria-invalid'];
  const hasStatus = !rest.disabled && (isInvalid || !!valid);
  return (
    <div className={cx(styles.wrap, styles[size])}>
      <textarea
        ref={ref}
        rows={rows}
        className={cx(styles.textarea, !resize && styles.noResize, hasStatus && styles.withStatus, className)}
        aria-invalid={invalid || rest['aria-invalid'] || undefined}
        {...rest}
      />
      <StatusIcon className={styles.status} invalid={isInvalid} valid={valid} disabled={rest.disabled} />
    </div>
  );
});

export interface TextareaFieldProps extends TextareaProps, Pick<FieldProps, 'label' | 'hint' | 'error' | 'optional' | 'info'> {
  /** Shows "used / maxLength" under the box when maxLength is set. Figma: Count. */
  showCount?: boolean;
  fieldClassName?: string;
}

/** A Textarea with a label, a hint and an optional character count. Figma: Textarea field. */
export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(function TextareaField(
  { label, hint, error, optional, info, required, showCount = true, maxLength, id, fieldClassName, onChange, value, defaultValue, invalid, valid, ...rest },
  ref,
) {
  const [length, setLength] = useState(String(value ?? defaultValue ?? '').length);
  const count = maxLength && showCount ? `${(value != null ? String(value).length : length).toLocaleString()} / ${maxLength.toLocaleString()}` : undefined;
  return (
    <Field label={label} hint={hint} error={error} required={required} optional={optional} info={info} count={count} controlId={id} className={fieldClassName}>
      {(c) => (
        <Textarea
          ref={ref}
          {...rest}
          {...c}
          invalid={invalid || c['aria-invalid']}
          valid={valid}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          onChange={(e) => {
            setLength(e.target.value.length);
            onChange?.(e);
          }}
        />
      )}
    </Field>
  );
});
