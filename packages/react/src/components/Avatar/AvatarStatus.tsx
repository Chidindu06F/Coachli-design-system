import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { PENCIL_SIMPLE, PLUS_CIRCLE_FILL, PUSH_PIN, SEAL_CHECK_FILL, X_CIRCLE_FILL } from './icons';
import styles from './Avatar.module.css';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarStatusType =
  | 'online'
  | 'offline'
  | 'busy'
  | 'away'
  | 'verified'
  | 'add'
  | 'remove'
  | 'pin'
  | 'edit'
  | 'notification'
  | 'logo';

export interface AvatarStatusProps extends HTMLAttributes<HTMLSpanElement> {
  /** What the badge shows. Figma: Type. */
  type: AvatarStatusType;
  /** Match the avatar it sits on. Set for you inside an Avatar. Figma: Size. */
  size?: AvatarSize;
  /** The number on a notification badge. Figma: Count. */
  count?: number | string;
  /** The logo on a logo badge, such as an svg or img. Figma: Logo. */
  logo?: ReactNode;
  /** What screen readers announce. Defaults to the type, such as "Online". */
  label?: string;
}

const LABELS: Record<AvatarStatusType, string> = {
  online: 'Online',
  offline: 'Offline',
  busy: 'Busy',
  away: 'Away',
  verified: 'Verified',
  add: 'Add',
  remove: 'Remove',
  pin: 'Pinned',
  edit: 'Edit',
  notification: 'Notifications',
  logo: 'Logo',
};

const DOTS: AvatarStatusType[] = ['online', 'offline', 'busy', 'away'];

// The filled circle icons fill 208 of their 256 grid, so crop to the circle.
function CircleIcon({ d, className }: { d: string; className?: string }) {
  return (
    <svg className={className} viewBox="24 24 208 208" aria-hidden="true">
      <circle className={styles.cutout} cx="128" cy="128" r="62" />
      <path d={d} />
    </svg>
  );
}

function content(type: AvatarStatusType, count: AvatarStatusProps['count'], logo: ReactNode) {
  if (DOTS.includes(type)) return <span className={styles.dot} />;
  switch (type) {
    case 'verified':
      return (
        <>
          <svg className={styles.sealRing} viewBox="0 0 256 256" aria-hidden="true"><path d={SEAL_CHECK_FILL} /></svg>
          <svg className={styles.seal} viewBox="0 0 256 256" aria-hidden="true">
            <circle className={styles.cutout} cx="128" cy="128" r="70" />
            <path d={SEAL_CHECK_FILL} />
          </svg>
        </>
      );
    case 'add':
      return <CircleIcon d={PLUS_CIRCLE_FILL} className={styles.circleIcon} />;
    case 'remove':
      return <CircleIcon d={X_CIRCLE_FILL} className={styles.circleIcon} />;
    case 'pin':
      return <svg className={styles.pinIcon} viewBox="0 0 256 256" aria-hidden="true"><path d={PUSH_PIN} /></svg>;
    case 'edit':
      return <svg className={styles.editIcon} viewBox="0 0 256 256" aria-hidden="true"><path d={PENCIL_SIMPLE} /></svg>;
    case 'notification':
      return <span aria-hidden="true">{count}</span>;
    default:
      return <span className={styles.logo} aria-hidden="true">{logo}</span>;
  }
}

/** A small badge for the corner of an Avatar: presence, verified, a count, a logo and more. */
export const AvatarStatus = forwardRef<HTMLSpanElement, AvatarStatusProps>(function AvatarStatus(
  { type, size = 'md', count, logo, label, className, ...rest },
  ref,
) {
  const name = label ?? (type === 'notification' && count !== undefined ? `${count} notifications` : LABELS[type]);
  const classes = [styles.status, styles[size], styles[`status-${type}`], className].filter(Boolean).join(' ');
  return (
    <span ref={ref} role="img" aria-label={name} data-halo="avatar-status" className={classes} {...rest}>
      {content(type, count, logo)}
    </span>
  );
});
