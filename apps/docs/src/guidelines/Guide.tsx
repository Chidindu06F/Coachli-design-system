import { Markdown } from '@storybook/addon-docs/blocks';
import type { AnchorHTMLAttributes, MouseEvent } from 'react';

/** The guideline files live in /guidelines at the repository root, so GitHub, the AI skills and Storybook read the same text. */
const pages: Record<string, string> = {
  'README': 'guidelines-overview',
  'using-the-design-system': 'guidelines-using-the-design-system',
  'choosing-components': 'guidelines-choosing-components',
  'patterns': 'guidelines-patterns',
  'copy': 'guidelines-writing-copy',
  'formats': 'guidelines-formats',
  'images': 'guidelines-images',
  'designing-screens': 'guidelines-designing-screens',
  'design-gaps': 'guidelines-design-gaps',
  'ai-setup': 'guidelines-ai-setup',
};

const repo = 'https://github.com/Chidindu06F/Coachli-design-system/blob/main/';

function Link({ href = '', children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const page = href.match(/^([a-z-]+|README)\.md$/i)?.[1];
  if (page && pages[page]) {
    const go = (e: MouseEvent) => {
      e.preventDefault();
      const top = window.top ?? window;
      const url = new URL(top.location.href);
      url.search = `?path=/docs/${pages[page]}--docs`;
      top.location.href = url.toString();
    };
    return <a href={`?path=/docs/${pages[page]}--docs`} onClick={go} {...rest}>{children}</a>;
  }
  // Links to repository files (../skills/README.md) open on GitHub.
  const resolved = /^(\.\.\/|[A-Z_]+\.md)/.test(href) ? repo + href.replace(/^\.\.\//, '') : href;
  return <a href={resolved} target="_blank" rel="noreferrer" {...rest}>{children}</a>;
}

export function Guide({ source }: { source: string }) {
  return <Markdown options={{ overrides: { a: { component: Link } } }}>{source}</Markdown>;
}
