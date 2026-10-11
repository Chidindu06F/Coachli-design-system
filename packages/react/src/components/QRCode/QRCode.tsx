import { forwardRef, useMemo } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { Button } from '../Button';
import { Spinner } from '../Spinner';
import { encodeQR } from './qr';
import type { QRErrorLevel } from './qr';
import styles from './QRCode.module.css';

export type { QRErrorLevel };

export interface QRCodeProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The text or link to encode. Up to about 2,900 characters at level L. */
  value: string;
  /** Width and height in px, including the light border. Figma: Size. */
  size?: number;
  /**
   * How much of the code can be covered or damaged and still scan: L 7%, M 15%, Q 25%, H 30%.
   * Higher levels make denser codes. Defaults to M, or H when there is a logo.
   */
  level?: QRErrorLevel;
  /** The light border around the code, in modules. Scanners need 4; go lower only on a plain light background. */
  margin?: number;
  /** A small logo or icon in the middle, like an app icon. Keep it under a fifth of the width. Figma: Logo. */
  logo?: ReactNode;
  /** Covers the code while it is being made, or when it has run out (for sign-in codes that expire). Figma: State. */
  status?: 'active' | 'loading' | 'expired';
  /** Shows a Refresh button on an expired code. */
  onRefresh?: () => void;
  /** What the code is for, read by screen readers, like "Scan to sign in on your phone". */
  label: string;
}

/** A scannable QR code drawn as SVG, with no dependencies. It always stays dark on light, in dark mode too, so every phone can read it. Figma: QR code. */
export const QRCode = forwardRef<HTMLDivElement, QRCodeProps>(function QRCode(
  { value, size = 160, level, margin = 4, logo, status = 'active', onRefresh, label, className, style, ...rest },
  ref,
) {
  const ecl = level ?? (logo ? 'H' : 'M');
  const path = useMemo(() => {
    const modules = encodeQR(value, ecl);
    let d = '';
    modules.forEach((row, y) => {
      // One rectangle per run of dark modules keeps the path short.
      for (let x = 0; x < row.length; x++) {
        if (!row[x]) continue;
        let end = x;
        while (end + 1 < row.length && row[end + 1]) end++;
        d += `M${x + margin},${y + margin}h${end - x + 1}v1h${-(end - x + 1)}z`;
        x = end;
      }
    });
    return { d, count: modules.length + margin * 2 };
  }, [value, ecl, margin]);

  return (
    <div
      ref={ref}
      className={cx(styles.qr, status !== 'active' && styles.covered, className)}
      style={{ width: size, height: size, ...style }}
      role="img"
      aria-label={status === 'expired' ? `${label}. This code has expired.` : label}
      aria-busy={status === 'loading' || undefined}
      {...rest}
    >
      <svg className={styles.code} viewBox={`0 0 ${path.count} ${path.count}`} width={size} height={size} shapeRendering="crispEdges" aria-hidden="true">
        <rect width={path.count} height={path.count} className={styles.light} />
        <path d={path.d} className={styles.dark} />
      </svg>
      {logo && status === 'active' && (
        <span className={styles.logo} style={{ width: size * 0.22, height: size * 0.22 }} aria-hidden="true">
          {logo}
        </span>
      )}
      {status === 'loading' && (
        <span className={styles.overlay}>
          <Spinner size="md" label="" />
        </span>
      )}
      {status === 'expired' && (
        <span className={styles.overlay}>
          <span className={styles.message}>Code expired</span>
          {onRefresh && (
            <Button size={size < 140 ? 'xs' : 'sm'} variant="secondary" onClick={onRefresh}>
              Refresh
            </Button>
          )}
        </span>
      )}
    </div>
  );
});
