import { cloneElement, forwardRef, isValidElement, useEffect, useState } from 'react';
import type { HTMLAttributes, ReactElement, ReactNode } from 'react';
import { AvatarStatus } from './AvatarStatus';
import type { AvatarSize, AvatarStatusProps, AvatarStatusType } from './AvatarStatus';
import { Award } from '../Award';
import type { AwardName, AwardProps } from '../Award';
import { USER } from './icons';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import styles from './Avatar.module.css';

export type AvatarColor = 'neutral' | 'purple' | 'blue' | 'green' | 'orange';
type StatusSlot = AvatarStatusType | ReactElement<AvatarStatusProps>;

/** Parts you can style with `classNames` and `styles`. */
export type AvatarPart = 'root' | 'circle' | 'image' | 'initials' | 'icon';

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement>, PartsProps<AvatarPart> {
  /** Photo or illustration. If it is missing or fails to load, initials or the icon show instead. Figma: Type=Image. */
  src?: string;
  /** The person's name. Read by screen readers and used to make initials. */
  name?: string;
  /** Up to two letters. Defaults to the first letters of `name`. Figma: Initials. */
  initials?: string;
  /** Replaces the default person icon when there is no image or name. Figma: Type=Icon. */
  icon?: ReactNode;
  /** XS 24, S 32, M 40, L 48, XL 64. Figma: Size. */
  size?: AvatarSize;
  /** Background for initials and icon avatars. Figma: Colour. */
  color?: AvatarColor;
  /** Badge on the bottom right: a status type, or an `AvatarStatus` for a count or logo. Figma: Bottom status. */
  status?: StatusSlot;
  /** Badge on the top right. Figma: Top status. */
  topStatus?: StatusSlot;
  /**
   * An award on the bottom right, as a name like "champion" or an `Award` element. It takes the bottom corner,
   * so a bottom `status` moves to the top when the top is free. Figma: Award, Change award.
   */
  award?: AwardName | ReactElement<AwardProps>;
}

// The same size as the status badges once the ring is added.
const AWARD_SIZE: Record<AvatarSize, number> = { xs: 10, sm: 12, md: 14, lg: 16, xl: 20 };

function renderAward(award: AvatarProps['award'], size: AvatarSize) {
  if (!award) return null;
  const px = AWARD_SIZE[size];
  const element = isValidElement(award) ? cloneElement(award, { size: award.props.size ?? px }) : <Award name={award} size={px} />;
  return <span className={styles.award}>{element}</span>;
}

function initialsOf(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const first = words[0] ?? '';
  const last = words.length > 1 ? (words[words.length - 1] ?? '') : '';
  return (last ? first.charAt(0) + last.charAt(0) : first.slice(0, 2)).toUpperCase();
}

function renderStatus(slot: StatusSlot | undefined, size: AvatarSize, position: string | undefined) {
  if (!slot) return null;
  const badge = isValidElement(slot) ? cloneElement(slot, { size: slot.props.size ?? size }) : <AvatarStatus type={slot} size={size} />;
  return <span className={[styles.holder, position].join(' ')}>{badge}</span>;
}

/** A person or team shown as a photo, initials or an icon, with optional status badges and an award. */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { src, name, initials, icon, size = 'md', color = 'neutral', status, topStatus, award, className, classNames, styles: partStyles, style, ...rest },
  ref,
) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  const letters = initials ?? (name ? initialsOf(name) : '');
  const showImage = src && !failed;
  const part = parts<AvatarPart>('avatar', { classNames, styles: partStyles });

  return (
    <span ref={ref} {...part('root', [styles.avatar, styles[size], className], style)} {...rest}>
      <span
        {...part('circle', [styles.circle, !showImage && styles[color]])}
        role={name ? 'img' : undefined}
        aria-label={name}
        aria-hidden={name ? undefined : true}
      >
        {showImage ? (
          <img {...part('image', styles.image)} src={src} alt="" onError={() => setFailed(true)} />
        ) : letters ? (
          <span {...part('initials', styles.initials)}>{letters}</span>
        ) : (
          <span {...part('icon', styles.icon)}>
            {icon ?? (
              <svg viewBox="0 0 256 256" fill="currentColor">
                <path d={USER} />
              </svg>
            )}
          </span>
        )}
      </span>
      {renderStatus(topStatus ?? (award ? status : undefined), size, styles.top)}
      {award ? renderAward(award, size) : renderStatus(status, size, styles.bottom)}
    </span>
  );
});
