import { forwardRef } from 'react';
import type { SVGAttributes } from 'react';
import { cx } from '../../internal/cx';
import { illustrationMarkup } from './art';
import type { IllustrationName } from './art';
import styles from './Illustration.module.css';

export interface IllustrationProps extends Omit<SVGAttributes<SVGSVGElement>, 'name'> {
  /** Which drawing. Figma: Type. */
  name: IllustrationName;
  /** Width in px. Height follows at a 4:3 ratio. */
  size?: number;
  /** Describes the picture for screen readers. Leave out when the text next to it says the same thing. */
  title?: string;
}

/**
 * Spot illustrations for empty states, drawn in quiet greys with a soft purple accent.
 * Recolour them with the --halo-illustration-* variables, on the page or on one element.
 */
export const Illustration = forwardRef<SVGSVGElement, IllustrationProps>(function Illustration(
  { name, size = 160, title, className, ...rest },
  ref,
) {
  return (
    <svg
      ref={ref}
      viewBox="0 0 160 120"
      width={size}
      height={(size * 3) / 4}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      data-halo="illustration"
      className={cx(styles.illustration, className)}
      // The drawings are fixed strings from this package, never user input.
      dangerouslySetInnerHTML={{ __html: illustrationMarkup(name) }}
      {...rest}
    />
  );
});
