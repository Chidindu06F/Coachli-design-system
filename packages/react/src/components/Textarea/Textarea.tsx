import { forwardRef, useState } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import { StatusIcon } from '../../internal/StatusIcon';
import { Field } from '../Field';
import type { FieldProps, FieldWrapperProps } from '../Field';
import styles from './Textarea.module.css';

/** Parts you can style with `classNames` and `styles`. `className` goes on the textarea itself. */
export type TextareaPart = 'root' | 'textarea';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, PartsProps<TextareaPart> {
  /** Text size and padding. Figma: Size. */
  size?: 'sm' | 'md' | 'lg';
  /** Lets people drag the corner to make it taller. Figma: Resize handle. */
  resize?: boolean;
  invalid?: boolean;
}

/** A multi-line text box. Use TextareaField to add a label, hint and count. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { size = 'md', resize = true, invalid, className, classNames, styles: partStyles, rows = 4, ...rest },
  ref,
) {
  const part = parts<TextareaPart>('textarea', { classNames, styles: partStyles });
  const isInvalid = invalid || !!rest['aria-invalid'];
  const hasStatus = !rest.disabled && isInvalid;
  return (
    <div {...part('root', [styles.wrap, styles[size]])}>
      <textarea
        ref={ref}
        rows={rows}
        aria-invalid={invalid || rest['aria-invalid'] || undefined}
        {...rest}
        {...part('textarea', [styles.textarea, !resize && styles.noResize, hasStatus && styles.withStatus, className], rest.style)}
      />
      <StatusIcon className={styles.status} invalid={isInvalid} disabled={rest.disabled} />
    </div>
  );
});

export interface TextareaFieldProps extends TextareaProps, Pick<FieldProps, 'label' | 'hint' | 'error' | 'optional' | 'info'> {
  /** Shows "used / maxLength" under the box when maxLength is set. Figma: Count. */
  showCount?: boolean;
  fieldClassName?: string;
  fieldClassNames?: FieldWrapperProps['fieldClassNames'];
  fieldStyles?: FieldWrapperProps['fieldStyles'];
}

/** A Textarea with a label, a hint and an optional character count. Figma: Textarea field. */
export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(function TextareaField(
  { label, hint, error, optional, info, required, showCount = true, maxLength, id, fieldClassName, fieldClassNames, fieldStyles, onChange, value, defaultValue, invalid, ...rest },
  ref,
) {
  const [length, setLength] = useState(String(value ?? defaultValue ?? '').length);
  const count = maxLength && showCount ? `${(value != null ? String(value).length : length).toLocaleString()} / ${maxLength.toLocaleString()}` : undefined;
  return (
    <Field label={label} hint={hint} error={error} required={required} optional={optional} info={info} count={count} controlId={id} className={fieldClassName} classNames={fieldClassNames} styles={fieldStyles}>
      {(c) => (
        <Textarea
          ref={ref}
          {...rest}
          {...c}
          invalid={invalid || c['aria-invalid']}
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
