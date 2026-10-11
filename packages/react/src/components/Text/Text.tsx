import { forwardRef } from 'react';
import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import styles from './Text.module.css';

export type TextSize = 'sm' | 'md' | 'lg';
export type TextWeight = 'regular' | 'semibold';
export type TextColor = 'primary' | 'contrast' | 'secondary';

export interface TextProps extends HTMLAttributes<HTMLElement> {
  /** lg 16/24, md 14/22 (default), sm 12/20. Figma: Size. */
  size?: TextSize;
  /** Figma: Weight. */
  weight?: TextWeight;
  /** Figma: Colour. */
  color?: TextColor;
  /** The element to render. Defaults to a paragraph. */
  as?: 'p' | 'span' | 'div' | 'label' | 'small';
  children: ReactNode;
}

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { size = 'md', weight = 'regular', color = 'primary', as = 'p', className, children, ...rest },
  ref,
) {
  const Tag = as as ElementType;
  const classes = [styles.text, styles[size], styles[weight], styles[color], className].filter(Boolean).join(' ');
  return (
    <Tag ref={ref} data-halo="text" className={classes} {...rest}>
      {children}
    </Tag>
  );
});
