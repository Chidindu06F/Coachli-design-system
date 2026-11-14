/*
 * Helpers for the rich text editor: link checks and a small cleaner for pasted HTML.
 * Pasted content keeps only the formatting the toolbar can make, so text copied from
 * websites, Word or Google Docs never brings its own fonts, colours or sizes.
 */

const SAFE_LINK = /^(https?:\/\/|mailto:)/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Something that looks like a web address without its scheme: "coachli.co" or "www.coachli.co/johndoe".
const BARE_DOMAIN = /^([a-z0-9-]+\.)+[a-z]{2,}(:\d+)?([/?#]\S*)?$/i;

/**
 * Turns what someone typed into a safe link, or returns null if it isn't one.
 * Adds https:// when it's missing and mailto: for email addresses. Never allows
 * javascript:, data: or other schemes.
 */
export function normalizeLink(input: string): string | null {
  const value = input.trim();
  if (!value || /\s/.test(value)) return null;
  if (SAFE_LINK.test(value)) {
    if (/^mailto:/i.test(value)) return EMAIL.test(value.slice(7)) ? value : null;
    try {
      const url = new URL(value);
      return url.hostname.includes('.') || url.hostname === 'localhost' ? value : null;
    } catch {
      return null;
    }
  }
  if (EMAIL.test(value)) return `mailto:${value}`;
  if (BARE_DOMAIN.test(value)) return `https://${value}`;
  return null;
}

/** An image address is only accepted over http or https. */
export function normalizeImageLink(input: string): string | null {
  const value = input.trim();
  if (!/^https?:\/\//i.test(value)) return null;
  try {
    new URL(value);
    return value;
  } catch {
    return null;
  }
}

export function escapeHTML(text: string) {
  return text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);
}

// Tags the editor can make, and what other tags become.
const KEEP = new Set(['p', 'h2', 'h3', 'strong', 'em', 'u', 's', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'a', 'br', 'img']);
const RENAME: Record<string, string> = { b: 'strong', i: 'em', strike: 's', del: 's', h1: 'h2', h4: 'h3', h5: 'h3', h6: 'h3', div: 'p' };
// Removed with everything inside them.
const DROP = new Set(['script', 'style', 'meta', 'link', 'title', 'head', 'iframe', 'object', 'embed', 'svg', 'math', 'template', 'noscript', 'form', 'input', 'button', 'select', 'textarea']);

/**
 * Cleans pasted HTML down to the editor's own formatting. Every attribute is removed
 * except a safe href on links and an http(s) src on images. Unknown tags such as span
 * or font are unwrapped, so their text stays.
 */
export function sanitizePastedHTML(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const out = document.createElement('div');
  const walk = (from: Node, to: Node) => {
    from.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        to.appendChild(document.createTextNode(node.textContent ?? ''));
        return;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      const el = node as Element;
      const raw = el.tagName.toLowerCase();
      if (DROP.has(raw)) return;
      // Word and Google Docs mark bold and italic with inline styles on spans.
      const style = (el.getAttribute('style') ?? '').toLowerCase();
      // A div holding other blocks is only a wrapper: keep its children, not the div.
      if (raw === 'div' && el.querySelector('p, div, h1, h2, h3, h4, h5, h6, ul, ol, blockquote, pre, table')) {
        walk(el, to);
        return;
      }
      let tag = RENAME[raw] ?? raw;
      if (raw === 'span' && /font-weight:\s*(bold|[6-9]00)/.test(style)) tag = 'strong';
      else if (raw === 'span' && /font-style:\s*italic/.test(style)) tag = 'em';
      if (!KEEP.has(tag)) {
        walk(el, to);
        return;
      }
      if (tag === 'img') {
        const src = normalizeImageLink(el.getAttribute('src') ?? '');
        if (src) {
          const img = document.createElement('img');
          img.setAttribute('src', src);
          const alt = el.getAttribute('alt');
          if (alt) img.setAttribute('alt', alt);
          to.appendChild(img);
        }
        return;
      }
      const copy = document.createElement(tag);
      if (tag === 'a') {
        const href = normalizeLink(el.getAttribute('href') ?? '');
        if (!href) {
          walk(el, to);
          return;
        }
        copy.setAttribute('href', href);
      }
      walk(el, copy);
      // Skip empty wrappers that pasted content often leaves behind.
      if (tag !== 'br' && !copy.textContent?.trim() && !copy.querySelector('img, br')) return;
      to.appendChild(copy);
    });
  };
  walk(doc.body, out);
  return out.innerHTML;
}
