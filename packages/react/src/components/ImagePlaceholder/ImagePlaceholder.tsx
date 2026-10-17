import { forwardRef } from 'react';
import type { CSSProperties, HTMLAttributes } from 'react';
import { cx } from '../../internal/cx';
import { PATTERN_SIZE, PATTERN_TILE } from './pattern';
import styles from './ImagePlaceholder.module.css';

export type ImagePlaceholderRatio = '16:9' | '4:3' | '1:1' | 'small-pattern' | 'small-logo';

export interface ImagePlaceholderProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Pick the one closest to the image slot. `16:9` for covers, `4:3` or `1:1` for cards.
   * Under about 80px use `small-pattern` or `small-logo`. Figma: Ratio.
   */
  ratio?: ImagePlaceholderRatio;
  /** Any CSS width. Large ratios fill their container by default; small ones are 64px. */
  width?: CSSProperties['width'];
  /** Read out instead of hiding it, for example "No cover image". Hidden from screen readers when empty. */
  label?: string;
}

const ASPECT: Record<ImagePlaceholderRatio, string> = {
  '16:9': '16 / 9',
  '4:3': '4 / 3',
  '1:1': '1 / 1',
  'small-pattern': '1 / 1',
  'small-logo': '1 / 1',
};

/**
 * The default image Coachli shows when someone hasn't uploaded one: a grey background with a
 * pattern of coaching and mentorship icons (or the faint Coachli mark, for small thumbnails).
 * It fills the slot it's put in; give the slot its corner radius.
 */
export const ImagePlaceholder = forwardRef<HTMLDivElement, ImagePlaceholderProps>(function ImagePlaceholder(
  { ratio = '16:9', width, label, className, style, ...rest },
  ref,
) {
  const small = ratio === 'small-pattern' || ratio === 'small-logo';
  const scale = ratio === 'small-pattern' ? 0.5 : 1;
  const pattern = {
    '--ip-tile': PATTERN_TILE,
    '--ip-tile-size': `${PATTERN_SIZE.width * scale}px ${PATTERN_SIZE.height * scale}px`,
  } as CSSProperties;
  return (
    <div
      ref={ref}
      role={label ? 'img' : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      data-halo="image-placeholder"
      className={cx(styles.root, className)}
      style={{ width: width ?? (small ? 64 : '100%'), aspectRatio: ASPECT[ratio], ...style }}
      {...rest}
    >
      {ratio === 'small-logo' ? (
        <svg className={styles.mark} viewBox="300 308 200 184" aria-hidden="true" focusable="false">
          <path d="M393.4 448C391.667 448.467 389.9 448.7 388.1 448.7C381.4 448.7 375.3 445.2 370.4 439.3C363.7 431.3 359.5 418.8 359.5 404.9C359.5 388 365.7 373.4 374.8 366.1C378.8 362.9 383.3 361.1 388.1 361.1C389.9 361.1 391.667 361.334 393.4 361.8C402.1 364.3 409.3 372.7 413.4 384.2H464.1C462.5 374.8 459.2 365.7 454.2 356.9C449.2 348.167 442.567 341.067 434.3 335.6C425.967 330.134 417.867 326.467 410 324.6C402.067 322.667 394.533 321.7 387.4 321.7C376.267 321.7 365.633 323.767 355.5 327.9C345.367 331.967 336.533 337.7 329 345.1C321.5 352.4 314.9 363.2 310.7 373.5C306.6 383.7 305.3 392.5 305.3 403.9C305.3 415.567 307.667 427.134 312.4 438.6C317.133 450 324.067 459.534 333.2 467.2C342.333 474.867 351.5 480.067 360.7 482.8C369.833 485.6 378.467 487 386.6 487C407 487 424 481.634 437.6 470.9C451.2 460.234 460.033 444.767 464.1 424.5H413.7C409.8 436.6 402.3 445.4 393.4 448Z" />
          <path d="M469.3 361.7H471C470.933 361.1 470.9 360.467 470.9 359.8C470.9 347.8 480.7 338.1 492.8 338.1C493.467 338.1 494.1 338.133 494.7 338.2V336.5C494.1 336.567 493.467 336.6 492.8 336.6C480.7 336.6 470.9 326.9 470.9 314.9C470.9 314.3 470.933 313.667 471 313H469.3C469.367 313.667 469.4 314.3 469.4 314.9C469.4 315.9 469.333 316.867 469.2 317.8C467.8 328.4 458.6 336.6 447.5 336.6C446.833 336.6 446.2 336.567 445.6 336.5V338.2C446.2 338.133 446.833 338.1 447.5 338.1C459 338.1 468.4 346.9 469.3 358.1C469.367 358.633 469.4 359.2 469.4 359.8C469.4 360.4 469.367 360.967 469.3 361.5V361.7Z" />
        </svg>
      ) : (
        <span className={styles.pattern} style={pattern} />
      )}
    </div>
  );
});
