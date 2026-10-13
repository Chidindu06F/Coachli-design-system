import { forwardRef, useCallback, useMemo, useRef, useState } from 'react';
import type { FormEvent, FormHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { mergeRefs } from '../../internal/floating';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import { FormContext } from './context';
import type { FormContextValue, FormFieldInfo } from './context';
import styles from './Form.module.css';

/** What a Form collects: one string per field, or a list when several fields share a name. */
export type FormValues = Record<string, string | string[]>;
export type FormErrors = Record<string, ReactNode | undefined>;

/** Parts you can style with `classNames` and `styles` on Form. */
export type FormPart = 'root';

export interface FormProps extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'>, PartsProps<FormPart> {
  /** Called with the values when every check passes. Return a promise to keep `aria-busy` on while it runs. */
  onSubmit?: (values: FormValues, event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  /** Your own checks. Return an error message for each field name that has a problem. */
  validate?: (values: FormValues) => FormErrors | undefined;
  /** Errors from elsewhere, like the server. Shown next to the matching fields. */
  errors?: FormErrors;
  /** The message for an empty required field. Defaults to "{Label} is required." */
  requiredMessage?: (label: string) => ReactNode;
  /** Labels above fields, or beside them. Figma: Layout. */
  layout?: 'vertical' | 'horizontal';
  /** Width of the label column in the horizontal layout. Default 200px. */
  labelWidth?: number | string;
}

function collect(form: HTMLFormElement): FormValues {
  const values: FormValues = {};
  for (const [key, raw] of new FormData(form).entries()) {
    const value = typeof raw === 'string' ? raw : raw.name;
    const now = values[key];
    values[key] = now === undefined ? value : Array.isArray(now) ? [...now, value] : [now, value];
  }
  return values;
}

const isEmpty = (v: string | string[] | undefined) => v === undefined || (Array.isArray(v) ? v.length === 0 || v.every((x) => !x.trim()) : !v.trim());

/**
 * A form that checks itself. Fields inside it that have a `name` get their error from the form, and
 * `required` fields are checked for you. Errors show after the first submit and update as people fix them.
 */
export const Form = forwardRef<HTMLFormElement, FormProps>(function Form(
  { onSubmit, validate, errors: outside, requiredMessage, layout = 'vertical', labelWidth, className, classNames, styles: partStyles, children, ...rest },
  ref,
) {
  const part = parts<FormPart>('form', { classNames, styles: partStyles });
  const form = useRef<HTMLFormElement | null>(null);
  const fields = useRef(new Map<string, FormFieldInfo>());
  const [found, setFound] = useState<FormErrors>({});
  const [tried, setTried] = useState(false);
  const [busy, setBusy] = useState(false);

  const register = useCallback((name: string, info: FormFieldInfo) => {
    fields.current.set(name, info);
    return () => {
      if (fields.current.get(name) === info) fields.current.delete(name);
    };
  }, []);

  const check = useCallback(
    (values: FormValues) => {
      const next: FormErrors = {};
      for (const [name, info] of fields.current) {
        if (info.required && isEmpty(values[name])) next[name] = requiredMessage ? requiredMessage(info.label) : `${info.label} is required.`;
      }
      const own = validate?.(values) ?? {};
      for (const [name, message] of Object.entries(own)) if (message != null && message !== false) next[name] = message;
      return next;
    },
    [validate, requiredMessage],
  );

  // After the first submit, check again as people type, pick and leave fields
  const recheck = () => {
    if (!tried) return;
    // A tick later, so custom controls have written their hidden inputs
    setTimeout(() => form.current && setFound(check(collect(form.current))), 0);
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const el = e.currentTarget;
    const values = collect(el);
    const next = check(values);
    setTried(true);
    setFound(next);
    const bad = Object.keys(next);
    if (bad.length) {
      // Focus the first field with a problem, in page order
      const targets = bad
        .map((name) => document.getElementById(fields.current.get(name)?.id ?? '') ?? el.querySelector<HTMLElement>(`[name="${CSS.escape(name)}"]:not([type="hidden"])`))
        .filter((t): t is HTMLElement => !!t)
        .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
      targets[0]?.focus();
      return;
    }
    const result = onSubmit?.(values, e);
    if (result instanceof Promise) {
      setBusy(true);
      try {
        await result;
      } finally {
        setBusy(false);
      }
    }
  };

  const errors = useMemo(() => ({ ...outside, ...found }) as Record<string, ReactNode>, [outside, found]);
  const value = useMemo<FormContextValue>(() => ({ errors, register }), [errors, register]);
  const width = labelWidth === undefined ? undefined : typeof labelWidth === 'number' ? `${labelWidth}px` : labelWidth;

  return (
    <FormContext.Provider value={value}>
      <form
        ref={mergeRefs(ref, form)}
        noValidate
        aria-busy={busy || undefined}
        data-layout={layout}
        {...rest}
        {...part('root', [styles.form, layout === 'horizontal' && styles.horizontal, className], width ? { ['--label-width' as string]: width, ...rest.style } : rest.style)}
        onSubmit={submit}
        onInput={(e) => {
          rest.onInput?.(e);
          recheck();
        }}
        onChange={(e) => {
          rest.onChange?.(e);
          recheck();
        }}
        onBlur={(e) => {
          rest.onBlur?.(e);
          recheck();
        }}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
});

/* ---------- Layout ---------- */

export interface FormSectionProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Figma: Title. */
  title?: ReactNode;
  /** Figma: Description. */
  description?: ReactNode;
}

/** A titled group of fields, like Personal details. */
export function FormSection({ title, description, className, children, ...rest }: FormSectionProps) {
  return (
    <section data-halo="form-section" className={[styles.section, className].filter(Boolean).join(' ')} {...rest}>
      {(title || description) && (
        <div className={styles.sectionHead}>
          {title && <h3 className={styles.sectionTitle}>{title}</h3>}
          {description && <p className={styles.sectionDescription}>{description}</p>}
        </div>
      )}
      <div className={styles.sectionBody}>{children}</div>
    </section>
  );
}

export interface FormRowProps extends HTMLAttributes<HTMLDivElement> {
  /** Fields side by side. They stack on screens under 600px. Default 2. */
  columns?: 2 | 3 | 4;
}

/** Puts fields side by side, like first and last name. */
export function FormRow({ columns = 2, className, style, ...rest }: FormRowProps) {
  return <div data-halo="form-row" className={[styles.row, className].filter(Boolean).join(' ')} style={{ ['--columns' as string]: columns, ...style }} {...rest} />;
}

export interface FormActionsProps extends HTMLAttributes<HTMLDivElement> {
  /** Where the buttons sit. Put the main button last. Default end. */
  align?: 'start' | 'end' | 'between';
  /** A line above the buttons. */
  divider?: boolean;
}

/** The buttons at the end of a form, like Cancel and Save. */
export function FormActions({ align = 'end', divider = false, className, ...rest }: FormActionsProps) {
  return <div data-halo="form-actions" className={[styles.actions, styles[align], divider && styles.divider, className].filter(Boolean).join(' ')} {...rest} />;
}
