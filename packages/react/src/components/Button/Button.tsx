import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Spinner } from '../Spinner';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

/** Parts you can style with `classNames` and `styles`. */
export type ButtonPart = 'root' | 'spinner' | 'icon' | 'label';

interface ButtonBaseProps extends ButtonHTMLAttributes<HTMLButtonElement>, PartsProps<ButtonPart> {
  /** Emphasis of the button. Figma: Type. */
  variant?: ButtonVariant;
  /** Height, padding, label and icon size. Figma: Size. */
  size?: ButtonSize;
  /**
   * Shows a spinner while an action runs, like saving. The button keeps its width and its name,
   * and ignores clicks until loading ends. Figma: State=Loading.
   */
  loading?: boolean;
}

interface ButtonWithLabelProps extends ButtonBaseProps {
  iconOnly?: false;
  /** The button text. Figma: Label. */
  children: ReactNode;
  /** Icon before the label. Figma: L icon. */
  iconLeft?: ReactNode;
  /** Icon after the label. Figma: R icon. */
  iconRight?: ReactNode;
}

interface ButtonIconOnlyProps extends ButtonBaseProps {
  /** Square button with a single icon and no label. Figma: Icon only. */
  iconOnly: true;
  /** The icon. */
  children: ReactNode;
  /** Icon-only buttons have no visible text, so they need a name for screen readers. */
  'aria-label': string;
  iconLeft?: never;
  iconRight?: never;
}

export type ButtonProps = ButtonWithLabelProps | ButtonIconOnlyProps;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', iconOnly = false, iconLeft, iconRight, loading = false, children, className, classNames, styles: partStyles, style, type = 'button', onClick, ...rest },
  ref,
) {
  const part = parts<ButtonPart>('button', { classNames, styles: partStyles });
  const spinnerColor = variant === 'primary' || variant === 'destructive' ? 'onBrand' : 'neutral';

  return (
    <button
      ref={ref}
      type={type}
      {...part('root', [styles.button, styles[variant], styles[size], iconOnly && styles.iconOnly, loading && styles.loading, className], style)}
      aria-busy={loading || undefined}
      aria-disabled={loading || rest['aria-disabled'] || undefined}
      onClick={loading ? (e) => e.preventDefault() : onClick}
      {...rest}
    >
      {loading && <Spinner {...part('spinner', styles.spinner)} size={size === 'xs' || size === 'sm' ? 'xs' : 'sm'} color={spinnerColor} label="" />}
      {iconOnly ? (
        <span {...part('icon', styles.icon)} aria-hidden="true">{children}</span>
      ) : (
        <>
          {iconLeft && <span {...part('icon', styles.icon)} aria-hidden="true">{iconLeft}</span>}
          <span {...part('label', styles.label)}>{children}</span>
          {iconRight && <span {...part('icon', styles.icon)} aria-hidden="true">{iconRight}</span>}
        </>
      )}
    </button>
  );
});
