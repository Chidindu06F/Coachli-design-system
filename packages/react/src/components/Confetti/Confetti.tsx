import { forwardRef, useEffect, useMemo, useState } from 'react';
import type { CSSProperties, HTMLAttributes } from 'react';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import styles from './Confetti.module.css';

/** Parts you can style with `classNames` and `styles`. */
export type ConfettiPart = 'root' | 'piece';

export interface ConfettiProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>, PartsProps<ConfettiPart> {
  /** Plays once each time this turns true (and on mount when true). Defaults to true. */
  active?: boolean;
  /** How many pieces fall. Figma: 40. */
  pieces?: number;
  /** How long the whole burst lasts, in milliseconds. */
  duration?: number;
  /** Piece colours, used in turn. Defaults to the six Coachli confetti colours. */
  colors?: string[];
  /** Called when the last piece has left. */
  onDone?: () => void;
}

interface Piece {
  left: number;
  width: number;
  height: number;
  round: boolean;
  rotate: number;
  spin: number;
  drift: number;
  delay: number;
  fall: number;
}

/** Small seeded generator, so the same pieces render on the server and in the browser. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function makePieces(count: number): Piece[] {
  const rand = seeded(count * 7919 + 17);
  return Array.from({ length: count }, (_, i) => ({
    // Spread evenly across the width, with a little jitter so columns do not show
    left: ((i + 0.5) / count) * 100 + (rand() - 0.5) * (100 / count) * 2,
    width: 5 + Math.round(rand() * 5),
    height: 8 + Math.round(rand() * 8),
    round: rand() < 0.3,
    rotate: Math.round(rand() * 360 - 180),
    spin: Math.round((rand() < 0.5 ? -1 : 1) * (180 + rand() * 360)),
    drift: Math.round(rand() * 48 - 24),
    delay: rand() * 0.35,
    fall: 0.65 + rand() * 0.35,
  }));
}

/**
 * A short burst of confetti that falls through its parent, for moments worth celebrating.
 * Put it inside a positioned parent (like a Modal body): it fills the parent, is clipped at
 * its edge and never blocks clicks.
 */
export const Confetti = forwardRef<HTMLDivElement, ConfettiProps>(function Confetti(
  { active = true, pieces = 40, duration = 2400, colors, onDone, className, classNames, styles: partStyles, style, ...rest },
  ref,
) {
  const part = parts<ConfettiPart>('confetti', { classNames, styles: partStyles });
  const list = useMemo(() => makePieces(pieces), [pieces]);
  const [playing, setPlaying] = useState(active);

  useEffect(() => {
    if (!active) {
      setPlaying(false);
      return;
    }
    setPlaying(true);
    const timer = setTimeout(() => {
      setPlaying(false);
      onDone?.();
    }, duration);
    return () => clearTimeout(timer);
    // onDone is left out so a new callback identity does not restart the burst
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, duration]);

  if (!playing) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      {...part('root', [styles.confetti, className], { '--confetti-duration': `${duration}ms`, ...style } as CSSProperties)}
      {...rest}
    >
      {list.map((p, i) => (
        <span
          key={i}
          {...part('piece', [styles.piece, p.round && styles.round], {
            left: `${p.left}%`,
            width: p.width,
            height: p.height,
            background: colors?.length ? colors[i % colors.length] : `var(--confetti-${(i % 6) + 1})`,
            '--rotate': `${p.rotate}deg`,
            '--spin': `${p.spin}deg`,
            '--drift': `${p.drift}px`,
            '--delay': p.delay,
            '--fall': p.fall,
          } as CSSProperties)}
        />
      ))}
    </div>
  );
});
