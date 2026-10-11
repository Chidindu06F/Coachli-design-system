import { cx } from './cx';
import { Icon } from './Icon';
import styles from './StatusIcon.module.css';

/** The red warning (any field) or green check (Input only) at the end of a field's box. Shows nothing when disabled or when there is no state. */
export function StatusIcon({ invalid, valid, disabled, className }: { invalid?: boolean; valid?: boolean; disabled?: boolean; className?: string }) {
  if (disabled || (!invalid && !valid)) return null;
  // The error message under the field already explains an error, so its icon stays hidden. A check has no message, so it is announced.
  return invalid ? (
    <span className={cx(styles.status, styles.error, className)} data-part="status">
      <Icon name="WarningCircle" />
    </span>
  ) : (
    <span className={cx(styles.status, styles.valid, className)} data-part="status" role="img" aria-label="Valid">
      <Icon name="CheckCircle" />
    </span>
  );
}
