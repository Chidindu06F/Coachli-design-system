import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { Portal, useFloating } from '../../internal/floating';
import type { Align, Side } from '../../internal/floating';
import { useControllable } from '../../internal/useControllable';
import { Button } from '../Button';
import popoverStyles from '../Popover/Popover.module.css';
import styles from './Tour.module.css';

export interface TourStep {
  /**
   * What the step points at: a CSS selector like "#search", an element, or a function that returns one.
   * Leave it out for a step in the middle of the screen, like a welcome or a wrap-up.
   */
  target?: string | HTMLElement | null | (() => HTMLElement | null);
  /** Figma: Title. */
  title: ReactNode;
  /** Figma: Description. */
  description?: ReactNode;
  /** An image or illustration above the title. Figma: Media. */
  media?: ReactNode;
  /** Which side of the target the card opens on. Flips when there is no room. Figma: Placement. */
  side?: Side;
  align?: Align;
}

export interface TourLabels {
  next: string;
  back: string;
  skip: string;
  done: string;
  /** The step counter, like "2 of 5". */
  progress: (step: number, total: number) => string;
}

const LABELS: TourLabels = { next: 'Next', back: 'Back', skip: 'Skip', done: 'Done', progress: (s, t) => `${s} of ${t}` };

export interface TourProps {
  steps: TourStep[];
  open?: boolean;
  defaultOpen?: boolean;
  /** Called with false on Skip, Done and Escape. */
  onOpenChange?: (open: boolean) => void;
  /** The current step, from 0. Leave it out and the tour keeps its own, starting from the first step each time it opens. */
  step?: number;
  onStepChange?: (step: number) => void;
  /** Called on Done. Save it so the tour does not show again. */
  onFinish?: () => void;
  /** Called on Skip or Escape, with the step people left on. */
  onSkip?: (step: number) => void;
  /** Dims the rest of the page and leaves a hole around the target. Figma: Spotlight. */
  spotlight?: boolean;
  /** "2 of 5", or dots. Figma: Progress. */
  progress?: 'count' | 'dots';
  /** Button and counter text, for other languages. */
  labels?: Partial<TourLabels>;
  className?: string;
}

function resolve(target: TourStep['target']): HTMLElement | null {
  if (!target || typeof document === 'undefined') return null;
  if (typeof target === 'string') return document.querySelector<HTMLElement>(target);
  if (typeof target === 'function') return target();
  return target;
}

/** The target's place on screen, kept up to date on scroll and resize. */
function useRect(el: HTMLElement | null) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  useLayoutEffect(() => {
    if (!el) {
      setRect(null);
      return;
    }
    const read = () => setRect(el.getBoundingClientRect());
    read();
    window.addEventListener('scroll', read, true);
    window.addEventListener('resize', read);
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(read);
    observer?.observe(el);
    return () => {
      observer?.disconnect();
      window.removeEventListener('scroll', read, true);
      window.removeEventListener('resize', read);
    };
  }, [el]);
  return rect;
}

/** A dimmed page with a rounded hole. The hole lets clicks through to the target. */
function holePath(r: DOMRect | null) {
  const outer = 'M-10000,-10000H20000V20000H-10000Z';
  if (!r) return outer;
  const pad = 6;
  const x = r.left - pad;
  const y = r.top - pad;
  const w = r.width + pad * 2;
  const h = r.height + pad * 2;
  const c = Math.min(8, w / 2, h / 2);
  return `${outer}M${x + c},${y}H${x + w - c}A${c},${c} 0 0 1 ${x + w},${y + c}V${y + h - c}A${c},${c} 0 0 1 ${x + w - c},${y + h}H${x + c}A${c},${c} 0 0 1 ${x},${y + h - c}V${y + c}A${c},${c} 0 0 1 ${x + c},${y}Z`;
}

/**
 * Walks new people through a screen, one step at a time. Each step points at part of the page
 * with Back, Next and Skip, and the rest of the page is dimmed. Built on Popover's placement. Figma: Tour step.
 */
export function Tour({
  steps,
  open,
  defaultOpen = false,
  onOpenChange,
  step,
  onStepChange,
  onFinish,
  onSkip,
  spotlight = true,
  progress = 'count',
  labels,
  className,
}: TourProps) {
  const id = useId();
  const text = { ...LABELS, ...labels };
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const [rawIndex, setIndex] = useControllable(step, 0, onStepChange);
  const index = Math.max(0, Math.min(rawIndex, steps.length - 1));
  const current = steps[index];
  const last = index === steps.length - 1;

  // Find this step's target, and scroll it into view.
  const anchor = useRef<HTMLElement | null>(null);
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const stepsRef = useRef(steps);
  stepsRef.current = steps;
  useLayoutEffect(() => {
    const el = isOpen ? resolve(stepsRef.current[index]?.target) : null;
    anchor.current = el;
    setTarget(el);
    if (el) {
      const reduce = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
    }
  }, [isOpen, index]);

  const { floating, style, side: placed, update } = useFloating(anchor, isOpen && !!target, {
    side: current?.side ?? 'bottom',
    align: current?.align ?? 'center',
    gap: 10,
  });
  useLayoutEffect(() => {
    if (target) update();
  }, [target, update]);
  const rect = useRect(target);

  // Start from the first step each time an uncontrolled tour opens.
  const wasOpen = useRef(isOpen);
  useEffect(() => {
    if (isOpen && !wasOpen.current && step === undefined) setIndex(0);
    wasOpen.current = isOpen;
  }, [isOpen, step, setIndex]);

  // Focus the card on each step so screen readers read it, and give focus back when the tour ends.
  const card = useRef<HTMLDivElement | null>(null);
  const returnTo = useRef<Element | null>(null);
  useEffect(() => {
    if (!isOpen) return;
    returnTo.current ??= document.activeElement;
    card.current?.focus({ preventScroll: true });
  }, [isOpen, index]);
  useEffect(() => {
    if (isOpen || !returnTo.current) return;
    (returnTo.current as HTMLElement).focus?.();
    returnTo.current = null;
  }, [isOpen]);

  const skip = () => {
    onSkip?.(index);
    setOpen(false);
  };
  const next = () => {
    if (last) {
      onFinish?.();
      setOpen(false);
    } else setIndex(index + 1);
  };
  const back = () => index > 0 && setIndex(index - 1);

  // Escape skips, wherever focus is.
  const skipRef = useRef(skip);
  skipRef.current = skip;
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') skipRef.current();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('input, textarea, select, [contenteditable="true"]')) return;
    if (e.key === 'ArrowRight') next();
    else if (e.key === 'ArrowLeft') back();
    else return;
    e.preventDefault();
  };

  if (!isOpen || !current) return null;
  const centred = !target;
  const counter = text.progress(index + 1, steps.length);

  // When the card is pushed back on screen, slide the arrow so it still points at the target.
  let arrowShift: string | undefined;
  const el = card.current;
  if (!centred && rect && el && typeof style.top === 'number' && typeof style.left === 'number') {
    const vertical = placed === 'left' || placed === 'right';
    const limit = (vertical ? el.offsetHeight : el.offsetWidth) / 2 - 20;
    const shift = vertical
      ? rect.top + rect.height / 2 - (style.top - window.scrollY + el.offsetHeight / 2)
      : rect.left + rect.width / 2 - (style.left - window.scrollX + el.offsetWidth / 2);
    const px = Math.round(Math.max(-limit, Math.min(limit, shift)));
    if (px !== 0) arrowShift = vertical ? `0 ${px}px` : `${px}px 0`;
  }

  return (
    <Portal>
      {spotlight && (
        <svg className={styles.spotlight} aria-hidden="true">
          <path d={holePath(centred ? null : rect)} fillRule="evenodd" />
        </svg>
      )}
      <div
        ref={(node) => {
          card.current = node;
          if (!centred) floating.current = node;
        }}
        role="dialog"
        aria-labelledby={`${id}-title`}
        aria-describedby={current.description ? `${id}-desc` : undefined}
        tabIndex={-1}
        className={cx(styles.tour, !centred && popoverStyles.withArrow, centred && styles.centred, className)}
        data-side={placed}
        style={centred ? undefined : style}
        onKeyDown={onKeyDown}
      >
        {!centred && <span className={popoverStyles.arrow} style={arrowShift ? { translate: arrowShift } : undefined} aria-hidden="true" />}
        <div className={cx(popoverStyles.panel, styles.panel)}>
          {current.media && <div className={styles.media}>{current.media}</div>}
          <div className={styles.text}>
            <div id={`${id}-title`} className={popoverStyles.title}>
              {current.title}
            </div>
            {current.description && (
              <div id={`${id}-desc`} className={styles.description}>
                {current.description}
              </div>
            )}
          </div>
          <div className={styles.footer}>
            {progress === 'dots' ? (
              <span className={styles.dots}>
                {steps.map((_, i) => (
                  <span key={i} className={cx(styles.dot, i === index && styles.dotActive)} aria-hidden="true" />
                ))}
                <span className={styles.srOnly}>{counter}</span>
              </span>
            ) : (
              <span className={styles.count}>{counter}</span>
            )}
            <span className={styles.buttons}>
              {!last && (
                <Button variant="ghost" size="sm" onClick={skip}>
                  {text.skip}
                </Button>
              )}
              {index > 0 && (
                <Button variant="secondary" size="sm" onClick={back}>
                  {text.back}
                </Button>
              )}
              <Button size="sm" onClick={next}>
                {last ? text.done : text.next}
              </Button>
            </span>
          </div>
        </div>
      </div>
    </Portal>
  );
}
