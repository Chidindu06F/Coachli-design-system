import { ICONS } from './iconPaths';
import type { IconName } from './iconPaths';
import type { SVGProps } from 'react';

/** Internal icon used inside components. Decorative, so hidden from screen readers. */
export function Icon({ name, className, ...rest }: { name: IconName; className?: string } & Omit<SVGProps<SVGSVGElement>, 'name'>) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" focusable="false" {...rest}>
      {ICONS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
