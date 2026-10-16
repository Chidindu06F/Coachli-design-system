import type { CSSProperties, ReactNode } from 'react';
import { tokens, type Token } from '@chidindu06f/coachli-tokens';

export { tokens };
export type { Token };

export const byCollection = (collection: string) => tokens.filter((t) => t.collection === collection);

export function groupBy<T>(items: T[], key: (item: T) => string) {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const k = key(item);
    groups.set(k, [...(groups.get(k) ?? []), item]);
  }
  return groups;
}

const s = {
  page: { display: 'grid', gap: 40, maxWidth: 1080, fontFamily: 'var(--halo-font-family-body)' },
  h1: { margin: 0, fontSize: 'var(--halo-font-size-4xl)', lineHeight: 'var(--halo-line-height-4xl)', fontWeight: 'var(--halo-font-weight-bold)' },
  h2: { margin: '0 0 12px', fontSize: 'var(--halo-font-size-xl)', lineHeight: 'var(--halo-line-height-xl)', fontWeight: 'var(--halo-font-weight-semibold)', textTransform: 'capitalize' },
  lead: { margin: '8px 0 0', color: 'var(--halo-text-secondary)', fontSize: 'var(--halo-font-size-md)', lineHeight: 'var(--halo-line-height-md)', maxWidth: 640 },
  code: { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace', fontSize: 12, color: 'var(--halo-text-contrast)' },
  muted: { color: 'var(--halo-text-secondary)', fontSize: 'var(--halo-font-size-sm)', lineHeight: 'var(--halo-line-height-sm)' },
} satisfies Record<string, CSSProperties>;

export const styles = s;

export function Page({ title, lead, children }: { title: string; lead: ReactNode; children: ReactNode }) {
  return (
    <div style={s.page}>
      <header>
        <h1 style={s.h1}>{title}</h1>
        <p style={s.lead}>{lead}</p>
      </header>
      {children}
    </div>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 style={s.h2}>{title}</h2>
      {children}
    </section>
  );
}

export const Code = ({ children }: { children: ReactNode }) => <code style={s.code}>{children}</code>;
