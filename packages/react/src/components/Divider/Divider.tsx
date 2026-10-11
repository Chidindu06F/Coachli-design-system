import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import styles from './Divider.module.css';

/** Parts you can style with `classNames` and `styles`. */
export type DividerPart = 'root' | 'line' | 'label';

export interface DividerProps extends HTMLAttributes<HTMLDivElement>, PartsProps<DividerPart> {
  /** A line across, or a line between items in a row. Figma: Orientation. */
  orientation?: 'horizontal' | 'vertical';
  /** Optional text in the line, like "or". Figma: Label. */
  label?: ReactNode;
  /** Where the label sits. Figma: Label position. */
  labelPosition?: 'start' | 'center';
  /** subtle uses border/secondary, strong uses border/strong. Figma: Color. */
  color?: 'subtle' | 'strong';
  /** Figma: Style. */
  variant?: 'solid' | 'dashed';
}

/** A thin line that separates content. */
export const Divider = forwardRef<HTMLDivElement, DividerProps>(function Divider(
  { orientation = 'horizontal', label, labelPosition = 'center', color = 'subtle', variant = 'solid', className, classNames, styles: partStyles, style, ...rest },
  ref,
) {
  const part = parts<DividerPart>('divider', { classNames, styles: partStyles });
  const labelled = label != null;
  const cls = cx(
    styles.divider,
    styles[orientation],
    styles[color],
    styles[variant],
    labelled && styles.labelled,
    labelled && styles[labelPosition],
    className,
  );
  if (!labelled) return <div ref={ref} role="separator" aria-orientation={orientation} {...part('root', cls, style)} {...rest} />;
  return (
    <div ref={ref} role="separator" aria-orientation={orientation} {...part('root', cls, style)} {...rest}>
      <span {...part('line', styles.line)} />
      <span {...part('label', styles.label)}>{label}</span>
      <span {...part('line', styles.line)} />
    </div>
  );
});
