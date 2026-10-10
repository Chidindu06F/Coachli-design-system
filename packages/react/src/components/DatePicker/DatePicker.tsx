import { forwardRef, useEffect, useId, useRef, useState } from 'react';
import { cx } from '../../internal/cx';
import { mergeRefs, Portal, useDismiss, useFloating } from '../../internal/floating';
import { Icon } from '../../internal/Icon';
import { useControllable } from '../../internal/useControllable';
import { Button } from '../Button';
import { Field } from '../Field';
import type { FieldProps } from '../Field';
import inputStyles from '../Input/Input.module.css';
import selectStyles from '../Select/Select.module.css';
import { Calendar } from './Calendar';
import type { CalendarPreset, DateRange } from './Calendar';
import styles from './DatePicker.module.css';
import { formatDate } from './dates';

interface PickerBase {
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  invalid?: boolean;
  /** Green border when the value checks out. Figma: State=Success. */
  valid?: boolean;
  disabled?: boolean;
  min?: Date;
  max?: Date;
  isDateDisabled?: (date: Date) => boolean;
  weekStartsOn?: 0 | 1;
  locale?: string;
  /** How the chosen date shows in the box. */
  format?: (date: Date) => string;
  id?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
  required?: boolean;
  className?: string;
}

function usePicker() {
  const [open, setOpen] = useState(false);
  const anchor = useRef<HTMLButtonElement | null>(null);
  const { floating, style } = useFloating(anchor, open, { align: 'start', gap: 4 });
  useDismiss(open, () => setOpen(false), [anchor, floating]);
  // Move focus into the grid when the calendar opens.
  useEffect(() => {
    if (open) floating.current?.querySelector<HTMLElement>('button[tabindex="0"]')?.focus();
  }, [open, floating]);
  const close = () => {
    setOpen(false);
    anchor.current?.focus();
  };
  return { open, setOpen, anchor, floating, style, close };
}

type TriggerProps = PickerBase & {
  open: boolean;
  text?: string;
  /** Range boxes show two slots with a dash between: start and end, each with its own placeholder. */
  range?: { start?: string; end?: string; startPlaceholder: string; endPlaceholder: string };
  onToggle: () => void;
  dialogId: string;
};

const Trigger = forwardRef<HTMLButtonElement, TriggerProps>(function Trigger(
  {
    open,
    text,
    range,
    placeholder,
    size = 'md',
    invalid,
    valid,
    disabled,
    className,
    onToggle,
    dialogId,
    ...aria
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      id={aria.id}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-controls={open ? dialogId : undefined}
      aria-label={aria['aria-label']}
      aria-describedby={aria['aria-describedby']}
      aria-invalid={invalid || aria['aria-invalid'] || undefined}
      aria-required={aria.required || undefined}
      disabled={disabled}
      className={cx(inputStyles.box, inputStyles[size], selectStyles.trigger, (invalid || aria['aria-invalid']) && inputStyles.invalid, valid && !invalid && !aria['aria-invalid'] && !disabled && inputStyles.valid, disabled && inputStyles.disabled, className)}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === 'ArrowDown' && !open) {
          e.preventDefault();
          onToggle();
        }
      }}
    >
      <Icon name="CalendarBlank" className={cx(inputStyles.icon, selectStyles.caret)} />
      {range ? (
        <span className={styles.rangeValue}>
          <span className={cx(styles.rangePart, !range.start && selectStyles.placeholder)}>{range.start ?? range.startPlaceholder}</span>
          <span className={styles.rangeDash} aria-hidden="true">–</span>
          <span className={cx(styles.rangePart, !range.end && selectStyles.placeholder)}>{range.end ?? range.endPlaceholder}</span>
        </span>
      ) : (
        <span className={cx(selectStyles.value, !text && selectStyles.placeholder)}>{text ?? placeholder}</span>
      )}
    </button>
  );
});

/* ---------- Single date ---------- */

export interface DatePickerProps extends PickerBase {
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (date: Date | null) => void;
}

/** A box that opens a Calendar to pick one day. */
export const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(function DatePicker(
  { value, defaultValue = null, onValueChange, placeholder = 'Pick a date', locale, format, min, max, isDateDisabled, weekStartsOn, ...rest },
  ref,
) {
  const dialogId = useId();
  const [date, setDate] = useControllable<Date | null>(value, defaultValue, onValueChange);
  const p = usePicker();
  const show = format ?? ((d: Date) => formatDate(d, locale));
  return (
    <>
      <Trigger ref={mergeRefs(ref, p.anchor)} open={p.open} text={date ? show(date) : undefined} placeholder={placeholder} dialogId={dialogId} onToggle={() => p.setOpen(!p.open)} {...rest} />
      {p.open && (
        <Portal>
          <div ref={p.floating} id={dialogId} role="dialog" aria-label="Choose a date" className={styles.popover} style={p.style}>
            <Calendar
              value={date}
              onChange={(d) => {
                setDate(d);
                p.close();
              }}
              min={min}
              max={max}
              isDateDisabled={isDateDisabled}
              weekStartsOn={weekStartsOn}
              locale={locale}
            />
          </div>
        </Portal>
      )}
    </>
  );
});

/* ---------- Range ---------- */

export interface DateRangePickerProps extends Omit<PickerBase, 'placeholder'> {
  /** Shown in the first slot before a range is picked. Figma: Start text. */
  startPlaceholder?: string;
  /** Shown in the second slot before a range is picked. Figma: End text. */
  endPlaceholder?: string;
  value?: DateRange | null;
  defaultValue?: DateRange | null;
  onValueChange?: (range: DateRange | null) => void;
  /** Quick picks, like "Last 7 days". Figma: Presets. */
  presets?: CalendarPreset[];
}

/** A box that opens a two-month Calendar to pick a start and end day, then Apply. */
export const DateRangePicker = forwardRef<HTMLButtonElement, DateRangePickerProps>(function DateRangePicker(
  { value, defaultValue = null, onValueChange, startPlaceholder = 'Start date', endPlaceholder = 'End date', locale, format, presets, min, max, isDateDisabled, weekStartsOn, ...rest },
  ref,
) {
  const dialogId = useId();
  const [range, setRange] = useControllable<DateRange | null>(value, defaultValue, onValueChange);
  const [draft, setDraft] = useState<DateRange | null>(range);
  const p = usePicker();
  const show = format ?? ((d: Date) => formatDate(d, locale));
  const text = (r: DateRange | null) => (r ? `${show(r[0])} – ${show(r[1])}` : undefined);
  return (
    <>
      <Trigger
        ref={mergeRefs(ref, p.anchor)}
        open={p.open}
        range={{ start: range ? show(range[0]) : undefined, end: range ? show(range[1]) : undefined, startPlaceholder, endPlaceholder }}
        dialogId={dialogId}
        onToggle={() => {
          setDraft(range);
          p.setOpen(!p.open);
        }}
        {...rest}
      />
      {p.open && (
        <Portal>
          <div ref={p.floating} id={dialogId} role="dialog" aria-label="Choose dates" className={styles.popover} style={p.style}>
            <Calendar
              mode="range"
              value={draft}
              onChange={setDraft}
              presets={presets}
              min={min}
              max={max}
              isDateDisabled={isDateDisabled}
              weekStartsOn={weekStartsOn}
              locale={locale}
              footer={
                <>
                  <span className={styles.rangeText}>{text(draft) ?? 'Pick a start and end day'}</span>
                  <div className={styles.footerActions}>
                    <Button variant="ghost" size="sm" onClick={p.close}>Cancel</Button>
                    <Button
                      size="sm"
                      disabled={!draft}
                      onClick={() => {
                        setRange(draft);
                        p.close();
                      }}
                    >
                      Apply
                    </Button>
                  </div>
                </>
              }
            />
          </div>
        </Portal>
      )}
    </>
  );
});

/* ---------- Fields ---------- */

type FieldBits = Pick<FieldProps, 'label' | 'hint' | 'error' | 'success' | 'optional' | 'info'> & { fieldClassName?: string };

export type DatePickerFieldProps = Omit<DatePickerProps, 'aria-describedby' | 'aria-invalid'> & FieldBits;
/** A DatePicker with a label and hint. */
export const DatePickerField = forwardRef<HTMLButtonElement, DatePickerFieldProps>(function DatePickerField(
  { label, hint, error, success, optional, info, required, id, fieldClassName, valid, ...rest },
  ref,
) {
  return (
    <Field label={label} hint={hint} error={error} success={success} required={required} optional={optional} info={info} controlId={id} className={fieldClassName}>
      {(c) => <DatePicker ref={ref} {...rest} {...c} valid={valid || (success != null && error == null)} />}
    </Field>
  );
});

export type DateRangePickerFieldProps = Omit<DateRangePickerProps, 'aria-describedby' | 'aria-invalid'> & FieldBits;
/** A DateRangePicker with a label and hint. */
export const DateRangePickerField = forwardRef<HTMLButtonElement, DateRangePickerFieldProps>(function DateRangePickerField(
  { label, hint, error, success, optional, info, required, id, fieldClassName, valid, ...rest },
  ref,
) {
  return (
    <Field label={label} hint={hint} error={error} success={success} required={required} optional={optional} info={info} controlId={id} className={fieldClassName}>
      {(c) => <DateRangePicker ref={ref} {...rest} {...c} valid={valid || (success != null && error == null)} />}
    </Field>
  );
});
