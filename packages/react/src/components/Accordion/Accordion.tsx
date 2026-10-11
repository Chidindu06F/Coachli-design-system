import { createContext, forwardRef, useCallback, useContext, useId, useMemo, useState } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import styles from './Accordion.module.css';

type AccordionType = 'single' | 'multiple';

interface AccordionContextValue {
  isOpen: (value: string) => boolean;
  toggle: (value: string) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

/** Parts you can style with `classNames` and `styles` on Accordion. Every AccordionItem picks them up. */
export type AccordionPart = 'root' | 'item' | 'heading' | 'header' | 'title' | 'icon' | 'panel' | 'body';
const PartCtx = createContext(parts<AccordionPart>('accordion', {}));

export interface AccordionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'>, PartsProps<AccordionPart> {
  /** single: opening one item closes the others. multiple: any number can be open. */
  type?: AccordionType;
  /** Items open on first render (their `value`s). */
  defaultValue?: string[];
  /** Controlled open items. Pair with onValueChange. */
  value?: string[];
  onValueChange?: (value: string[]) => void;
  children: ReactNode;
}

/** A stack of AccordionItems. Manages which ones are open. */
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion(
  { type = 'multiple', defaultValue = [], value, onValueChange, className, classNames, styles: partStyles, children, ...rest },
  ref,
) {
  const part = useMemo(() => parts<AccordionPart>('accordion', { classNames, styles: partStyles }), [classNames, partStyles]);
  const [internal, setInternal] = useState<string[]>(defaultValue);
  const open = value ?? internal;
  const setOpen = useCallback(
    (next: string[]) => {
      if (value === undefined) setInternal(next);
      onValueChange?.(next);
    },
    [value, onValueChange],
  );
  const ctx = useMemo<AccordionContextValue>(
    () => ({
      isOpen: (v) => open.includes(v),
      toggle: (v) => {
        if (open.includes(v)) setOpen(open.filter((x) => x !== v));
        else setOpen(type === 'single' ? [v] : [...open, v]);
      },
    }),
    [open, setOpen, type],
  );

  return (
    <AccordionContext.Provider value={ctx}>
      <PartCtx.Provider value={part}>
        <div ref={ref} {...rest} {...part('root', className, rest.style)}>
          {children}
        </div>
      </PartCtx.Provider>
    </AccordionContext.Provider>
  );
});

export interface AccordionItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** The section title. Figma: Title. */
  title: ReactNode;
  /** The content slot. Figma: Content. Put anything inside. */
  children: ReactNode;
  /** Identifies the item inside an Accordion. Defaults to an auto id. */
  value?: string;
  /** Open on first render when used on its own (outside an Accordion). Figma: State. */
  defaultOpen?: boolean;
  /** Line under the item. Turn off for the last item inside a card. Figma: Divider. */
  divider?: boolean;
  disabled?: boolean;
  /** Heading level for the title, to fit the page outline. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}

/** One expandable row: a header button and a content slot. */
export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(function AccordionItem(
  { title, children, value, defaultOpen = false, divider = true, disabled = false, headingLevel = 3, className, ...rest },
  ref,
) {
  const autoId = useId();
  const itemValue = value ?? autoId;
  const ctx = useContext(AccordionContext);
  const part = useContext(PartCtx);
  const [localOpen, setLocalOpen] = useState(defaultOpen);
  const open = !disabled && (ctx ? ctx.isOpen(itemValue) : localOpen);
  const toggle = () => (ctx ? ctx.toggle(itemValue) : setLocalOpen((o) => !o));

  const Heading = `h${headingLevel}` as const;
  const headerId = `${autoId}-header`;
  const panelId = `${autoId}-panel`;

  return (
    <div ref={ref} {...rest} {...part('item', [styles.item, open && styles.open, divider && styles.divider, disabled && styles.disabled, className], rest.style)}>
      <Heading {...part('heading', styles.heading)}>
        <button
          type="button"
          id={headerId}
          {...part('header', styles.header)}
          aria-expanded={open}
          aria-controls={panelId}
          disabled={disabled}
          onClick={toggle}
        >
          <span {...part('title', styles.title)}>{title}</span>
          {/* Looks like a Ghost Compact button, but it's part of the header button. */}
          <span {...part('icon', styles.iconBox)} aria-hidden="true">
            <svg viewBox="0 0 256 256" width="20" height="20" fill="currentColor">
              {open ? (
                <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128Z" />
              ) : (
                <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
              )}
            </svg>
          </span>
        </button>
      </Heading>
      <div id={panelId} role="region" aria-labelledby={headerId} {...part('panel', styles.panel)} inert={!open} aria-hidden={!open}>
        <div className={styles.panelInner}>
          <div {...part('body', styles.panelBody)}>{children}</div>
        </div>
      </div>
    </div>
  );
});
