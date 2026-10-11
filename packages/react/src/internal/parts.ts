import type { CSSProperties } from 'react';
import { cx } from './cx';

/**
 * Lets people style the parts inside a component without reaching for Halo's internal class names.
 * Every part also gets a stable `data-part` attribute, and the outer element gets `data-halo`
 * with the component's name, so parts can be styled from your own CSS too:
 * `[data-halo='modal'] [data-part='header'] { … }`.
 */
export interface PartsProps<P extends string> {
  /** Extra class names for the parts inside the component, by part name, like `{ header: 'my-header' }`. */
  classNames?: Partial<Record<P, string>>;
  /** Inline styles for the parts inside the component, by part name, like `{ footer: { gap: 4 } }`. */
  styles?: Partial<Record<P, CSSProperties>>;
}

type Falsy = false | null | undefined;

/**
 * Returns a function that gives an element its part name, its classes and its styles.
 * `root` is the outer element: it also gets `data-halo` with the component's name.
 *
 * ```tsx
 * const part = parts('modal', { classNames, styles: partStyles });
 * <div {...part('root', styles.modal, className)} />
 * ```
 */
export function parts<P extends string>(component: string, { classNames, styles }: PartsProps<P>) {
  return (part: P, className?: string | Falsy | (string | Falsy)[], style?: CSSProperties) => {
    const own = styles?.[part];
    const classes = Array.isArray(className) ? className : [className];
    return {
      'data-part': part,
      ...(part === 'root' ? { 'data-halo': component } : {}),
      className: cx(...classes, classNames?.[part]) || undefined,
      style: style || own ? { ...style, ...own } : undefined,
    };
  };
}
