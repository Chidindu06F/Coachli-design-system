import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import styles from './Badge.module.css';

export type BadgeColor = 'neutral' | 'brand' | 'information' | 'success' | 'warning' | 'error';
export type BadgeVariant = 'soft' | 'solid' | 'outline';
export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';

/** Parts you can style with `classNames` and `styles`. */
export type BadgePart = 'root' | 'dot' | 'icon' | 'label';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, PartsProps<BadgePart> {
  /** What the badge means. Figma: Colour. */
  color?: BadgeColor;
  /** How much it stands out: soft (default), solid or outline. Figma: Style. */
  variant?: BadgeVariant;
  /** XS 16, S 20, M 24, L 28. Figma: Size. */
  size?: BadgeSize;
  /** A small dot before the label, for statuses. Figma: Show dot. */
  dot?: boolean;
  /** An icon before the label. Figma: Show icon and Icon. */
  icon?: ReactNode;
  /** Shows a number instead of children, capped at `max`. Give the badge an aria-label such as "3 unread messages". */
  count?: number;
  /** The highest count shown before it becomes, for example, 99+. */
  max?: number;
  /** The label. Figma: Label. */
  children?: ReactNode;
}

/** A small read-only label for the status, category or count of something. */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { color = 'neutral', variant = 'soft', size = 'md', dot = false, icon, count, max = 99, className, classNames, styles: partStyles, style, children, ...rest },
  ref,
) {
  const label = count !== undefined ? (count > max ? `${max}+` : String(count)) : children;
  const part = parts<BadgePart>('badge', { classNames, styles: partStyles });

  return (
    <span ref={ref} {...part('root', [styles.badge, styles[color], styles[variant], styles[size], className], style)} {...rest}>
      {dot && <span {...part('dot', styles.dot)} aria-hidden="true" />}
      {icon && <span {...part('icon', styles.icon)} aria-hidden="true">{icon}</span>}
      <span {...part('label', styles.label)}>{label}</span>
    </span>
  );
});
