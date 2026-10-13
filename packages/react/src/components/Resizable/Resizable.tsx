import { Children, cloneElement, createContext, isValidElement, useCallback, useContext, useId, useMemo, useRef, useState } from 'react';
import type { CSSProperties, HTMLAttributes, KeyboardEvent, PointerEvent, ReactElement, ReactNode } from 'react';
import { Icon } from '../../internal/Icon';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import styles from './Resizable.module.css';

/** Parts you can style with `classNames` and `styles` on ResizablePanelGroup. Every panel and handle picks them up. */
export type ResizablePart = 'root' | 'panel' | 'handle' | 'grip';

type Direction = 'horizontal' | 'vertical';

interface GroupCtx {
  direction: Direction;
  sizes: number[];
  ids: string[];
  part: ReturnType<typeof parts<ResizablePart>>;
  startDrag: (handle: number, e: PointerEvent<HTMLDivElement>) => void;
  nudge: (handle: number, by: number | 'min' | 'max') => void;
  limits: { min: number; max: number }[];
}

const Ctx = createContext<GroupCtx | null>(null);
const useGroup = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('ResizablePanel and ResizableHandle need a ResizablePanelGroup around them.');
  return ctx;
};

export interface ResizablePanelGroupProps extends HTMLAttributes<HTMLDivElement>, PartsProps<ResizablePart> {
  /** Side by side, or stacked. Figma: Direction. */
  direction?: Direction;
  /** Called with each panel's size, in percent, after it changes. Save it to restore the layout later. */
  onLayout?: (sizes: number[]) => void;
  children: ReactNode;
}

export interface ResizablePanelProps extends HTMLAttributes<HTMLDivElement> {
  /** Starting size, in percent of the group. Panels without one share what's left. */
  defaultSize?: number;
  /** Smallest size, in percent. Default 10. */
  minSize?: number;
  /** Largest size, in percent. Default 90. */
  maxSize?: number;
  /** Set by the group. */
  index?: number;
}

export interface ResizableHandleProps extends HTMLAttributes<HTMLDivElement> {
  /** Shows a grip in the middle, so the handle is easy to find. Figma: Grip. */
  withHandle?: boolean;
  /** Screen reader name, like "Resize sidebar". */
  'aria-label'?: string;
  /** Set by the group. */
  index?: number;
}

const round = (n: number) => Math.round(n * 10) / 10;

/** Panels with handles between them that people drag, or move with arrow keys, to resize. */
export function ResizablePanelGroup({ direction = 'horizontal', onLayout, className, classNames, styles: partStyles, children, ...rest }: ResizablePanelGroupProps) {
  const part = parts<ResizablePart>('resizable', { classNames, styles: partStyles });
  const base = useId();
  const box = useRef<HTMLDivElement>(null);

  // Number the panels and handles in order, so each handle knows the panels on either side
  const items = Children.toArray(children).filter(isValidElement) as ReactElement<ResizablePanelProps & ResizableHandleProps>[];
  const panels = items.filter((c) => c.type === ResizablePanel);
  const limits = panels.map((p) => ({ min: p.props.minSize ?? 10, max: p.props.maxSize ?? 90 }));
  const ids = panels.map((_, i) => `${base}-panel-${i}`);

  const [sizes, setSizes] = useState<number[]>(() => {
    const given = panels.map((p) => p.props.defaultSize);
    const used = given.reduce<number>((a, s) => a + (s ?? 0), 0);
    const free = given.filter((s) => s === undefined).length;
    return given.map((s) => s ?? (free ? (100 - used) / free : 0));
  });

  const latest = useRef(sizes);
  latest.current = sizes;

  // Move the edge between panel `h` and `h + 1`, keeping both inside their limits
  const move = useCallback(
    (h: number, from: number[], delta: number) => {
      const a = from[h]!;
      const b = from[h + 1]!;
      const lo = Math.max(limits[h]!.min, a + b - limits[h + 1]!.max);
      const hi = Math.min(limits[h]!.max, a + b - limits[h + 1]!.min);
      const nextA = Math.min(hi, Math.max(lo, a + delta));
      const next = [...from];
      next[h] = round(nextA);
      next[h + 1] = round(a + b - nextA);
      return next;
    },
    [limits],
  );

  const startDrag = useCallback(
    (h: number, e: PointerEvent<HTMLDivElement>) => {
      const el = box.current;
      if (!el) return;
      e.preventDefault();
      const handle = e.currentTarget;
      try {
        handle.setPointerCapture(e.pointerId);
      } catch {
        // Some pointers, like synthetic ones in tests, can't be captured; dragging still works while over the handle
      }
      const total = direction === 'horizontal' ? el.getBoundingClientRect().width : el.getBoundingClientRect().height;
      const start = direction === 'horizontal' ? e.clientX : e.clientY;
      const from = latest.current;
      const onMove = (ev: globalThis.PointerEvent) => {
        const now = direction === 'horizontal' ? ev.clientX : ev.clientY;
        setSizes(move(h, from, ((now - start) / total) * 100));
      };
      const onUp = () => {
        handle.removeEventListener('pointermove', onMove);
        handle.removeEventListener('pointerup', onUp);
        handle.removeEventListener('pointercancel', onUp);
        onLayout?.(latest.current);
      };
      handle.addEventListener('pointermove', onMove);
      handle.addEventListener('pointerup', onUp);
      handle.addEventListener('pointercancel', onUp);
    },
    [direction, move, onLayout],
  );

  const nudge = useCallback(
    (h: number, by: number | 'min' | 'max') => {
      const from = latest.current;
      const delta = by === 'min' ? -100 : by === 'max' ? 100 : by;
      const next = move(h, from, delta);
      setSizes(next);
      onLayout?.(next);
    },
    [move, onLayout],
  );

  let p = 0;
  let h = 0;
  const numbered = items.map((child) => {
    if (child.type === ResizablePanel) return cloneElement(child, { index: p++ });
    if (child.type === ResizableHandle) return cloneElement(child, { index: h++ });
    return child;
  });

  const value = useMemo(() => ({ direction, sizes, ids, part, startDrag, nudge, limits }), [direction, sizes, ids, part, startDrag, nudge, limits]);

  return (
    <Ctx.Provider value={value}>
      <div ref={box} data-direction={direction} {...rest} {...part('root', [styles.group, styles[direction], className], rest.style)}>
        {numbered}
      </div>
    </Ctx.Provider>
  );
}

/** One area in a ResizablePanelGroup. */
export function ResizablePanel({ defaultSize: _d, minSize: _min, maxSize: _max, index = 0, className, style, children, ...rest }: ResizablePanelProps) {
  const { sizes, ids, part } = useGroup();
  const size: CSSProperties = { flexBasis: `${sizes[index] ?? 0}%` };
  return (
    <div id={ids[index]} {...rest} {...part('panel', [styles.panel, className], { ...size, ...style })}>
      {children}
    </div>
  );
}

/** The line between two panels. Drag it, or focus it and use the arrow keys, Home and End. */
export function ResizableHandle({ withHandle = false, index = 0, className, 'aria-label': label, ...rest }: ResizableHandleProps) {
  const { direction, sizes, ids, part, startDrag, nudge, limits } = useGroup();
  const step = 5;
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    rest.onKeyDown?.(e);
    const back = direction === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
    const fwd = direction === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
    const by = e.key === back ? -step : e.key === fwd ? step : e.key === 'Home' ? 'min' : e.key === 'End' ? 'max' : null;
    if (by === null) return;
    e.preventDefault();
    nudge(index, by);
  };
  return (
    <div
      role="separator"
      tabIndex={0}
      aria-orientation={direction === 'horizontal' ? 'vertical' : 'horizontal'}
      aria-controls={ids[index]}
      aria-valuenow={Math.round(sizes[index] ?? 0)}
      aria-valuemin={limits[index]?.min}
      aria-valuemax={limits[index]?.max}
      aria-label={label ?? 'Resize'}
      {...rest}
      {...part('handle', [styles.handle, className], rest.style)}
      onPointerDown={(e) => {
        rest.onPointerDown?.(e);
        if (!e.defaultPrevented) startDrag(index, e);
      }}
      onKeyDown={onKeyDown}
    >
      {withHandle && (
        <span {...part('grip', styles.grip)} aria-hidden="true">
          <Icon name={direction === 'horizontal' ? 'DotsSixVertical' : 'DotsSix'} />
        </span>
      )}
    </div>
  );
}
