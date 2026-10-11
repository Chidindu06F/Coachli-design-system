import { forwardRef } from 'react';
import type { CSSProperties, HTMLAttributes } from 'react';
import { cx } from '../../internal/cx';
import styles from './Skeleton.module.css';

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  /** text: a 12px line. circle: avatars and icons. rectangle: images and charts. Figma: Shape. */
  shape?: 'text' | 'circle' | 'rectangle';
  /** Any CSS width, like 120 or "60%". */
  width?: CSSProperties['width'];
  /** Any CSS height. */
  height?: CSSProperties['height'];
  /** Shimmer, or none. Reduced motion always turns it off. */
  animation?: 'shimmer' | 'none';
}

const DEFAULTS = { text: ['100%', 12], circle: [40, 40], rectangle: ['100%', 120] } as const;

/** A grey shape that holds the place of content while it loads. Hidden from screen readers. */
export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton(
  { shape = 'text', width, height, animation = 'shimmer', className, style, ...rest },
  ref,
) {
  const [w, h] = DEFAULTS[shape];
  return (
    <span
      ref={ref}
      aria-hidden="true"
      data-halo="skeleton"
      className={cx(styles.skeleton, styles[shape], animation === 'shimmer' && styles.shimmer, className)}
      style={{ width: width ?? w, height: height ?? h, ...style }}
      {...rest}
    />
  );
});
