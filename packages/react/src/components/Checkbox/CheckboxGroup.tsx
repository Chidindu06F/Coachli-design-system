import { forwardRef } from 'react';
import type { FieldsetHTMLAttributes, ReactNode } from 'react';
import type { CheckboxSize } from './Checkbox';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import styles from './Checkbox.module.css';

/** Parts you can style with `classNames` and `styles`. */
export type CheckboxGroupPart = 'root' | 'legend' | 'items';

export interface CheckboxGroupProps extends FieldsetHTMLAttributes<HTMLFieldSetElement>, PartsProps<CheckboxGroupPart> {
  /** Names the group. Screen readers read it with each option. Figma: Label. */
  label: ReactNode;
  /** Hides the label visually but keeps it for screen readers. Figma: Show label off. */
  hideLabel?: boolean;
  /** Spacing and label size. Match it to the checkboxes inside. Figma: Size. */
  size?: CheckboxSize;
  /** `Checkbox` elements. Figma: Items slot. */
  children: ReactNode;
}

/** A labelled list of checkboxes. */
export const CheckboxGroup = forwardRef<HTMLFieldSetElement, CheckboxGroupProps>(function CheckboxGroup(
  { label, hideLabel = false, size = 'md', className, classNames, styles: partStyles, children, ...rest },
  ref,
) {
  const part = parts<CheckboxGroupPart>('checkbox-group', { classNames, styles: partStyles });
  return (
    <fieldset ref={ref} {...rest} {...part('root', [styles.group, styles[size], className], rest.style)}>
      <legend {...part('legend', hideLabel ? styles.srOnly : styles.legend)}>{label}</legend>
      <div {...part('items', styles.items)}>{children}</div>
    </fieldset>
  );
});
