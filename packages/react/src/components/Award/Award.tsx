import { forwardRef, useId } from 'react';
import type { SVGAttributes } from 'react';
import { cx } from '../../internal/cx';
import { awardLabel, awardMarkup } from './art';
import type { AwardColors, AwardName } from './art';
import styles from './Award.module.css';

export interface AwardProps extends Omit<SVGAttributes<SVGSVGElement>, 'name'> {
  /** Which award. */
  name: AwardName;
  /** One flat colour, or a blend of two or three. Figma: Colours. */
  colors?: AwardColors;
  /** Width in px. Height follows the badge shape. */
  size?: number;
  /** Name read by screen readers. Defaults to the award's name; pass an empty string when text next to it says the same. */
  title?: string;
}

/** A raised, colourful badge people earn, like a streak or a finished course. */
export const Award = forwardRef<SVGSVGElement, AwardProps>(function Award({ name, colors = 2, size = 96, title, className, ...rest }, ref) {
  const id = useId().replace(/:/g, '');
  const label = title ?? awardLabel(name);
  return (
    <svg
      ref={ref}
      viewBox="0 0 96 104"
      width={size}
      height={(size * 104) / 96}
      role={label ? 'img' : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      focusable="false"
      data-halo="award"
      className={cx(styles.award, className)}
      // The drawing is a fixed string from this package, never user input.
      dangerouslySetInnerHTML={{ __html: awardMarkup(name, colors, `award-${id}`) }}
      {...rest}
    />
  );
});
