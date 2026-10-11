import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ComponentType, ReactNode, SVGProps } from 'react';
import { AppleLogo, DropboxLogo, GitHubLogo, GoogleLogo, LinkedInLogo, XLogo } from './logos';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import styles from './SocialButton.module.css';

export type SocialProvider = 'apple' | 'google' | 'x' | 'linkedin' | 'dropbox' | 'github';
export type SocialButtonVariant = 'filled' | 'outline';

const providers: Record<SocialProvider, { name: string; Logo: ComponentType<SVGProps<SVGSVGElement> & { mono?: boolean }> }> = {
  apple: { name: 'Apple', Logo: AppleLogo },
  google: { name: 'Google', Logo: GoogleLogo },
  x: { name: 'X', Logo: XLogo },
  linkedin: { name: 'LinkedIn', Logo: LinkedInLogo },
  dropbox: { name: 'Dropbox', Logo: DropboxLogo },
  github: { name: 'GitHub', Logo: GitHubLogo },
};

/** Parts you can style with `classNames` and `styles`. */
export type SocialButtonPart = 'root' | 'logo' | 'label';

export interface SocialButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, PartsProps<SocialButtonPart> {
  /** Sets the logo and brand colour. Figma: Brand. */
  provider: SocialProvider;
  /** Brand colour, or the page colour with a border. Figma: Style. */
  variant?: SocialButtonVariant;
  /** Only the logo, in a 48px circle. Figma: Icon only. */
  iconOnly?: boolean;
  /** Stretch to the width of its container, for stacked sign-in buttons. */
  fullWidth?: boolean;
  /** The label. Defaults to "Continue with <provider>". Figma: Label. */
  children?: ReactNode;
}

export const SocialButton = forwardRef<HTMLButtonElement, SocialButtonProps>(function SocialButton(
  { provider, variant = 'filled', iconOnly = false, fullWidth = false, children, className, classNames, styles: partStyles, style, type = 'button', ...rest },
  ref,
) {
  const { name, Logo } = providers[provider];
  const label = children ?? `Continue with ${name}`;
  // Filled buttons show the logo in the label colour (white, or black for Apple in dark mode).
  // Outline buttons keep each logo's own colours.
  const mono = variant === 'filled';
  const part = parts<SocialButtonPart>('social-button', { classNames, styles: partStyles });

  return (
    <button
      ref={ref}
      type={type}
      {...part('root', [styles.button, styles[variant], styles[provider], iconOnly && styles.iconOnly, fullWidth && styles.fullWidth, className], style)}
      {...rest}
      // Icon-only buttons still need a name, so they fall back to "Continue with <provider>".
      aria-label={rest['aria-label'] ?? (iconOnly ? `Continue with ${name}` : undefined)}
    >
      <span {...part('logo', styles.logo)}><Logo mono={mono} /></span>
      {!iconOnly && <span {...part('label', styles.label)}>{label}</span>}
    </button>
  );
});
