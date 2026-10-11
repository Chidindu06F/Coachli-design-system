import { Children, cloneElement, forwardRef, isValidElement } from 'react';
import type { HTMLAttributes, ReactElement, ReactNode } from 'react';
import type { AvatarProps } from './Avatar';
import type { AvatarSize } from './AvatarStatus';
import styles from './Avatar.module.css';

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Sets the size of every avatar in the group. Figma: Size. */
  size?: AvatarSize;
  /** How many avatars to show before the rest collapse into a "+N" circle. Figma: Count. */
  max?: number;
  /** The total number of people, when it is more than the avatars you pass in. */
  total?: number;
  /** `Avatar` elements. */
  children: ReactNode;
}

/** Overlapping avatars for a team or the people on a document, with a "+N" for the rest. */
export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(function AvatarGroup(
  { size = 'md', max = 4, total, className, children, 'aria-label': ariaLabel, ...rest },
  ref,
) {
  const avatars = Children.toArray(children).filter(isValidElement) as ReactElement<AvatarProps>[];
  const shown = avatars.slice(0, max);
  const extra = (total ?? avatars.length) - shown.length;
  const classes = [styles.group, styles[size], className].filter(Boolean).join(' ');


  return (
    <div ref={ref} role="group" data-halo="avatar-group" aria-label={ariaLabel ?? `${total ?? avatars.length} people`} className={classes} {...rest}>
      {shown.map((a) => cloneElement(a, { size, className: [styles.member, a.props.className].filter(Boolean).join(' ') }))}
      {extra > 0 && (
        <span data-part="more" className={`${styles.avatar} ${styles.member}`} role="img" aria-label={`${extra} more`}>
          <span className={`${styles.circle} ${styles.neutral}`}>
            <span className={styles.initials} aria-hidden="true">+{extra}</span>
          </span>
        </span>
      )}
    </div>
  );
});
