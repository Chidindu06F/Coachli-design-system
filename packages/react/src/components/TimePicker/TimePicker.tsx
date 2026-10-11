import { forwardRef, useMemo } from 'react';
import { Icon } from '../../internal/Icon';
import { Field } from '../Field';
import type { FieldProps } from '../Field';
import { Select } from '../Select';
import type { SelectOption, SelectProps } from '../Select';

export interface TimePickerProps extends Omit<SelectProps, 'options' | 'icon'> {
  /** The time as "HH:mm", 24-hour, like a native time input. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Minutes between options. Default 30. */
  step?: number;
  /** How times read in the list and the box. The value is always "HH:mm". */
  hourCycle?: 12 | 24;
  /** Earliest and latest times offered, as "HH:mm". */
  min?: string;
  max?: string;
}

const toMinutes = (t: string) => {
  const [h = 0, m = 0] = t.split(':').map(Number);
  return h * 60 + m;
};
const pad = (n: number) => String(n).padStart(2, '0');

/** Formats minutes after midnight for the list. */
export function formatTime(minutes: number, hourCycle: 12 | 24 = 12) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (hourCycle === 24) return `${pad(h)}:${pad(m)}`;
  return `${h % 12 || 12}:${pad(m)} ${h < 12 ? 'AM' : 'PM'}`;
}

/** Times of day at a fixed step, in the list of a Select. Typing "9" jumps to 9 o'clock. Figma: Time picker. */
export const TimePicker = forwardRef<HTMLButtonElement, TimePickerProps>(function TimePicker(
  { step = 30, hourCycle = 12, min = '00:00', max = '23:59', placeholder = 'Pick a time', ...rest },
  ref,
) {
  const options = useMemo<SelectOption[]>(() => {
    const list: SelectOption[] = [];
    for (let t = toMinutes(min); t <= toMinutes(max); t += Math.max(1, step)) {
      list.push({ value: `${pad(Math.floor(t / 60))}:${pad(t % 60)}`, label: formatTime(t, hourCycle) });
    }
    return list;
  }, [step, hourCycle, min, max]);

  return <Select ref={ref} {...rest} options={options} placeholder={placeholder} icon={<Icon name="Clock" />} />;
});

export interface TimePickerFieldProps
  extends Omit<TimePickerProps, 'aria-describedby' | 'aria-invalid'>,
    Pick<FieldProps, 'label' | 'hint' | 'error' | 'optional' | 'info'> {
  fieldClassName?: string;
}

/** A Time picker with a label and hint. Figma: Time field. */
export const TimePickerField = forwardRef<HTMLButtonElement, TimePickerFieldProps>(function TimePickerField(
  { label, hint, error, optional, info, required, id, fieldClassName, ...rest },
  ref,
) {
  return (
    <Field label={label} hint={hint} error={error} required={required} optional={optional} info={info} controlId={id} className={fieldClassName}>
      {(c) => <TimePicker ref={ref} {...rest} {...c} />}
    </Field>
  );
});
