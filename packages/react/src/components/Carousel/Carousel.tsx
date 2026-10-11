import { Children, forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { Icon } from '../../internal/Icon';
import { CompactButton } from '../CompactButton';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import styles from './Carousel.module.css';

/** Parts you can style with `classNames` and `styles`. */
export type CarouselPart = 'root' | 'viewport' | 'track' | 'slide' | 'previous' | 'next' | 'dots' | 'dot';

export interface CarouselProps extends Omit<HTMLAttributes<HTMLElement>, 'children'>, PartsProps<CarouselPart> {
  /** Names the carousel for screen readers, like "Featured courses". */
  'aria-label': string;
  /** CarouselSlide elements. */
  children: ReactNode;
  /** Slides visible at once. Default 1. */
  slidesPerView?: number;
  /** Previous and next buttons on the sides. Figma: Arrows. */
  showArrows?: boolean;
  /** A dot for each position under the slides. Figma: Dots. */
  showDots?: boolean;
  /** Called with the index of the first visible slide. */
  onIndexChange?: (index: number) => void;
}

/**
 * A row of slides people swipe, scroll or step through. It never moves on its own.
 * Figma: Carousel.
 */
export const Carousel = forwardRef<HTMLElement, CarouselProps>(function Carousel(
  { children, slidesPerView = 1, showArrows = true, showDots = true, onIndexChange, className, classNames, styles: partStyles, style, ...rest },
  ref,
) {
  const part = parts<CarouselPart>('carousel', { classNames, styles: partStyles });
  const track = useRef<HTMLDivElement>(null);
  const slides = Children.toArray(children);
  const positions = Math.max(1, slides.length - slidesPerView + 1);
  const [index, setIndex] = useState(0);

  const slideWidth = () => {
    const el = track.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return 0;
    return first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0');
  };

  const go = useCallback((i: number) => {
    const el = track.current;
    if (!el) return;
    const to = Math.max(0, Math.min(positions - 1, i));
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    el.scrollTo({ left: to * slideWidth(), behavior: reduce ? 'auto' : 'smooth' });
  }, [positions]);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const w = slideWidth();
      if (!w) return;
      const i = Math.min(positions - 1, Math.round(el.scrollLeft / w));
      setIndex((prev) => (prev === i ? prev : i));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [positions]);

  useEffect(() => onIndexChange?.(index), [index, onIndexChange]);

  return (
    <section
      ref={ref}
      aria-roledescription="carousel"
      {...rest}
      {...part('root', [styles.carousel, className], { ...style, '--per-view': slidesPerView } as CSSProperties)}
    >
      <div {...part('viewport', styles.viewport)}>
        <div
          ref={track}
          {...part('track', styles.track)}
          tabIndex={0}
          aria-live="polite"
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
            if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
          }}
        >
          {slides.map((s, i) => (
            <div
              key={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slides.length}`}
              {...part('slide', styles.slide)}
            >
              {s}
            </div>
          ))}
        </div>
        {showArrows && positions > 1 && (
          <>
            <CompactButton round variant="stroke" {...part('previous', [styles.arrow, styles.prev])} aria-label="Previous slide" disabled={index === 0} onClick={() => go(index - 1)}>
              <Icon name="CaretLeft" />
            </CompactButton>
            <CompactButton round variant="stroke" {...part('next', [styles.arrow, styles.next])} aria-label="Next slide" disabled={index >= positions - 1} onClick={() => go(index + 1)}>
              <Icon name="CaretRight" />
            </CompactButton>
          </>
        )}
      </div>
      {showDots && positions > 1 && (
        <div {...part('dots', styles.dots)}>
          {Array.from({ length: positions }, (_, i) => (
            <button
              key={i}
              type="button"
              {...part('dot', styles.dot)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index || undefined}
              onClick={() => go(i)}
            />
          ))}
        </div>
      )}
    </section>
  );
});

export interface CarouselSlideProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/** One slide. Holds any content: an image, a Card, a promo. */
export function CarouselSlide({ className, ...rest }: CarouselSlideProps) {
  return <div className={cx(styles.content, className)} {...rest} />;
}
