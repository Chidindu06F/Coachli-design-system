import { forwardRef, useId, useRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { Icon } from '../../internal/Icon';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import styles from './ImageUpload.module.css';

function accepts(file: File, accept?: string) {
  if (!accept) return true;
  return accept.split(',').some((rule) => {
    const r = rule.trim().toLowerCase();
    if (r.startsWith('.')) return file.name.toLowerCase().endsWith(r);
    if (r.endsWith('/*')) return file.type.startsWith(r.slice(0, -1));
    return file.type === r;
  });
}

/** Parts you can style with `classNames` and `styles`. */
export type ImageUploadPart = 'root' | 'image' | 'content' | 'title' | 'hint' | 'actions' | 'upload' | 'remove';

export interface ImageUploadProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'onChange'>, PartsProps<ImageUploadPart> {
  /** The current image. When set, the buttons become Change and Remove. Figma: State=Uploaded. */
  src?: string;
  /** Called with the chosen image when it passes `accept` and `maxSize`. */
  onFile: (file: File) => void;
  /** Called when a file is turned away and why. */
  onReject?: (file: File, reason: 'type' | 'size') => void;
  /** Shows the red bin button when there is an image. */
  onRemove?: () => void;
  /** Person shows a user icon when empty; business shows a building. Figma: Kind. */
  kind?: 'person' | 'business';
  /** Default has a title and hint beside the image; compact is the image and buttons only. Figma: Layout. */
  layout?: 'default' | 'compact';
  /** Figma: Title. */
  title?: ReactNode;
  /** Say the size and file types. Figma: Hint. */
  hint?: ReactNode;
  /** File types, like "image/png,image/jpeg". */
  accept?: string;
  /** Largest file size in bytes. */
  maxSize?: number;
  disabled?: boolean;
  /** Name of the image for screen readers, like "Profile photo". */
  label?: string;
}

/** A round image with Upload, or Change and a red Remove once there is one. For profile photos and business logos. */
export const ImageUpload = forwardRef<HTMLDivElement, ImageUploadProps>(function ImageUpload(
  {
    src,
    onFile,
    onReject,
    onRemove,
    kind = 'person',
    layout = 'default',
    title = 'Upload image',
    hint = 'Min 400×400px, PNG or JPEG',
    accept = 'image/png,image/jpeg',
    maxSize,
    disabled,
    label = kind === 'business' ? 'Logo' : 'Profile photo',
    className,
    classNames,
    styles: partStyles,
    ...rest
  },
  ref,
) {
  const part = parts<ImageUploadPart>('image-upload', { classNames, styles: partStyles });
  const input = useRef<HTMLInputElement | null>(null);
  const hintId = useId();
  const compact = layout === 'compact';

  const take = (list: FileList | null) => {
    const file = list?.[0];
    if (!file || disabled) return;
    if (!accepts(file, accept)) onReject?.(file, 'type');
    else if (maxSize !== undefined && file.size > maxSize) onReject?.(file, 'size');
    else onFile(file);
  };

  const actions = (
    <div {...part('actions', [styles.actions, !compact && styles.actionsSpaced])}>
      <Button
        {...part('upload')}
        variant="secondary"
        size="sm"
        disabled={disabled}
        aria-describedby={!compact && hint ? hintId : undefined}
        aria-label={src ? `Change ${label.toLowerCase()}` : `Upload ${label.toLowerCase()}`}
        onClick={() => input.current?.click()}
      >
        {src ? 'Change' : 'Upload'}
      </Button>
      {src && onRemove && (
        <Button {...part('remove', styles.remove)} variant="ghost" size="sm" iconOnly aria-label={`Remove ${label.toLowerCase()}`} disabled={disabled} onClick={onRemove}>
          <Icon name="Trash" />
        </Button>
      )}
    </div>
  );

  return (
    <div ref={ref} {...rest} {...part('root', [styles.root, compact && styles.compact, className], rest.style)}>
      <Avatar
        {...part('image')}
        size={compact ? 'lg' : 'xl'}
        src={src}
        icon={kind === 'business' ? <Icon name="Buildings" /> : undefined}
        aria-label={src ? label : undefined}
      />
      {compact ? (
        actions
      ) : (
        <div {...part('content', styles.content)}>
          <div {...part('title', styles.title)}>{title}</div>
          {hint && (
            <div id={hintId} {...part('hint', styles.hint)}>
              {hint}
            </div>
          )}
          {actions}
        </div>
      )}
      <input
        ref={input}
        type="file"
        hidden
        accept={accept}
        disabled={disabled}
        onChange={(e) => {
          take(e.target.files);
          e.target.value = '';
        }}
      />
    </div>
  );
});
