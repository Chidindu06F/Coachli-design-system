import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import type { ClipboardEvent, DragEvent, KeyboardEvent, MouseEvent, ReactNode } from 'react';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import { Icon } from '../../internal/Icon';
import { StatusIcon } from '../../internal/StatusIcon';
import type { IconName } from '../../internal/iconPaths';
import { Button } from '../Button';
import { CompactButton } from '../CompactButton';
import { Field } from '../Field';
import type { FieldProps, FieldWrapperProps } from '../Field';
import { FileUpload, formatBytes } from '../FileUpload';
import { InputField } from '../Input';
import { LinkButton } from '../LinkButton';
import { Menu } from '../Menu';
import { Popover } from '../Popover';
import { Tab, TabList, TabPanel, Tabs } from '../Tabs';
import { escapeHTML, normalizeImageLink, normalizeLink, sanitizePastedHTML } from './sanitize';
import styles from './RichTextEditor.module.css';

const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];

export interface RichTextEditorHandle {
  /** The editor's content as HTML. */
  getHTML: () => string;
  /** Plain text, for counting or previews. */
  getText: () => string;
  focus: () => void;
}

/** Parts you can style with `classNames` and `styles`. */
export type RichTextEditorPart = 'root' | 'toolbar' | 'group' | 'divider' | 'body' | 'placeholder' | 'content';

export interface RichTextEditorProps extends PartsProps<RichTextEditorPart> {
  /** Starting content as HTML. The editor keeps its own state after that. */
  defaultValue?: string;
  /** Called with the new HTML after each change. */
  onChange?: (html: string) => void;
  placeholder?: string;
  invalid?: boolean;
  disabled?: boolean;
  /** Small for phones and narrow panels: tighter padding, and the toolbar scrolls sideways in one row. Text and buttons keep their size so they stay easy to read and tap. Figma: Size. */
  size?: 'sm' | 'md';
  /** Toolbar groups to show. Figma: Text style, Format, Blocks, Insert, History. */
  tools?: Partial<Record<'textStyle' | 'format' | 'blocks' | 'insert' | 'history', boolean>>;
  /** Minimum height of the writing area in px. */
  minHeight?: number;
  /**
   * Uploads an image and resolves with its public URL. When set, the image popover gets an Upload tab,
   * and images pasted or dropped into the editor are uploaded too. Without it, images can only be added by link.
   */
  onImageUpload?: (file: File) => Promise<string>;
  /** Largest image accepted for upload, in bytes. Default 10 MB. */
  maxImageSize?: number;
  /** Called when a pasted or dropped image is rejected or its upload fails. The image is removed from the editor. */
  onImageUploadError?: (file: File, error: unknown) => void;
  id?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
  className?: string;
}

type Command = { cmd: string; arg?: string; icon: IconName; label: string; shortcut?: string; state?: string };

const FORMAT: Command[] = [
  { cmd: 'bold', icon: 'TextB', label: 'Bold', shortcut: 'Ctrl+B' },
  { cmd: 'italic', icon: 'TextItalic', label: 'Italic', shortcut: 'Ctrl+I' },
  { cmd: 'underline', icon: 'TextUnderline', label: 'Underline', shortcut: 'Ctrl+U' },
  { cmd: 'strikeThrough', icon: 'TextStrikethrough', label: 'Strikethrough' },
];
const BLOCKS: Command[] = [
  { cmd: 'insertUnorderedList', icon: 'ListBullets', label: 'Bulleted list' },
  { cmd: 'insertOrderedList', icon: 'ListNumbers', label: 'Numbered list' },
  { cmd: 'formatBlock', arg: 'blockquote', icon: 'Quotes', label: 'Quote', state: 'blockquote' },
  { cmd: 'formatBlock', arg: 'pre', icon: 'Code', label: 'Code block', state: 'pre' },
];
const TEXT_STYLES = [
  { tag: 'p', label: 'Normal text' },
  { tag: 'h2', label: 'Heading 1' },
  { tag: 'h3', label: 'Heading 2' },
];

/**
 * A writing area with a formatting toolbar. Content is HTML; sanitise it on the server before showing it to others.
 * Built on the browser's editing support, so it needs no extra packages. For collaborative or schema-based
 * editing, use a dedicated editor library styled with Halo tokens.
 *
 * Links: highlight text and add a link, or add one with its own text. Addresses without https:// get it added,
 * email addresses become mailto: links, and anything else is refused. With the caret in a link, the link button
 * edits or removes it. Pasted content keeps only the formatting the toolbar can make.
 */
export const RichTextEditor = forwardRef<RichTextEditorHandle, RichTextEditorProps>(function RichTextEditor(
  { defaultValue = '', onChange, placeholder = 'Start writing…', invalid, disabled, size = 'md', tools = {}, minHeight = size === 'sm' ? 120 : 160, onImageUpload, maxImageSize = 10 * 1024 * 1024, onImageUploadError, id, className, classNames, styles: partStyles, ...aria },
  ref,
) {
  const area = useRef<HTMLDivElement | null>(null);
  const saved = useRef<Range | null>(null);
  const [active, setActive] = useState<Record<string, boolean>>({});
  const [block, setBlock] = useState('p');
  const [empty, setEmpty] = useState(!defaultValue);
  const show = { textStyle: true, format: true, blocks: true, insert: true, history: true, ...tools };

  // The HTML without images that are still uploading.
  const htmlOf = (el: HTMLElement) => {
    if (!el.querySelector('img[data-uploading]')) return el.innerHTML;
    const copy = el.cloneNode(true) as HTMLElement;
    copy.querySelectorAll('img[data-uploading]').forEach((img) => img.remove());
    return copy.innerHTML;
  };

  useImperativeHandle(ref, () => ({
    getHTML: () => (area.current ? htmlOf(area.current) : ''),
    getText: () => area.current?.innerText ?? '',
    focus: () => area.current?.focus(),
  }));

  // Only the first value is used: the editor owns its content afterwards.
  const initial = useRef(defaultValue);
  useEffect(() => {
    if (area.current) area.current.innerHTML = initial.current;
  }, []);

  const refresh = useCallback(() => {
    const sel = document.getSelection();
    if (!sel || !area.current || !sel.rangeCount || !area.current.contains(sel.anchorNode)) return;
    saved.current = sel.getRangeAt(0).cloneRange();
    const next: Record<string, boolean> = {};
    for (const c of FORMAT) next[c.cmd] = document.queryCommandState(c.cmd);
    next.insertUnorderedList = document.queryCommandState('insertUnorderedList');
    next.insertOrderedList = document.queryCommandState('insertOrderedList');
    const tag = String(document.queryCommandValue('formatBlock') || 'p').toLowerCase();
    next.blockquote = tag === 'blockquote';
    next.pre = tag === 'pre';
    next.link = !!linkAt(saved.current);
    // Links are drawn underlined, which the browser reports as underline; don't light the button for that.
    if (next.link) next.underline = false;
    setActive(next);
    setBlock(TEXT_STYLES.some((t) => t.tag === tag) ? tag : 'p');
  }, []);

  useEffect(() => {
    document.addEventListener('selectionchange', refresh);
    return () => document.removeEventListener('selectionchange', refresh);
  }, [refresh]);

  const changed = () => {
    const el = area.current;
    if (!el) return;
    setEmpty(!el.innerText.trim() && !el.querySelector('img'));
    onChange?.(htmlOf(el));
  };

  // The link the range starts in, if any.
  function linkAt(range: Range | null): HTMLAnchorElement | null {
    if (!range || !area.current) return null;
    let node: Node | null = range.startContainer;
    while (node && node !== area.current) {
      if (node instanceof HTMLAnchorElement) return node;
      node = node.parentNode;
    }
    return null;
  }

  // Puts the caret back where it was before a toolbar control took focus.
  const restore = () => {
    const el = area.current;
    if (!el) return null;
    el.focus();
    const sel = document.getSelection();
    if (saved.current && sel) {
      sel.removeAllRanges();
      sel.addRange(saved.current);
    }
    return sel;
  };

  // True when highlighted text is, or contains, a link.
  const highlightsLink = () => {
    const r = saved.current;
    if (!r || r.collapsed) return false;
    return !!linkAt(r) || !!r.cloneContents().querySelector('a');
  };

  const linkInfo = () => {
    const a = linkAt(saved.current);
    return { text: a ? a.textContent ?? '' : saved.current?.toString() ?? '', url: a?.getAttribute('href') ?? '', editing: !!a, highlighted: highlightsLink() };
  };

  const applyLink = (text: string, url: string) => {
    if (disabled) return;
    const a = linkAt(saved.current);
    if (a) {
      a.setAttribute('href', url);
      if (text && text !== a.textContent) a.textContent = text;
    } else {
      const sel = restore();
      const selected = sel?.toString() ?? '';
      if (selected && (!text || text === selected)) document.execCommand('createLink', false, url);
      else document.execCommand('insertHTML', false, `<a href="${escapeHTML(url)}">${escapeHTML(text || url.replace(/^(https?:\/\/|mailto:)/i, '').replace(/\/$/, ''))}</a>`);
    }
    refresh();
    changed();
  };

  // Removes the link the caret is in, or every link in the highlighted text. The words stay as plain text.
  const removeLink = () => {
    if (disabled) return;
    const highlighted = highlightsLink();
    const a = linkAt(saved.current);
    if (!highlighted && !a) return;
    const sel = restore();
    if (!highlighted && a) {
      const range = document.createRange();
      range.selectNodeContents(a);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
    document.execCommand('unlink');
    refresh();
    changed();
  };

  // Checks an image before uploading. Returns the reason it can't be used, or null.
  const imageProblem = (file: File) => {
    if (!IMAGE_TYPES.includes(file.type)) return 'Choose a PNG, JPG, GIF or WebP image.';
    if (file.size > maxImageSize) return `Image must be ${formatBytes(maxImageSize)} or smaller.`;
    return null;
  };

  // Shows the image straight away, faded, then swaps in the uploaded address. Removes it if the upload fails.
  const uploadImage = async (file: File) => {
    const el = area.current;
    if (!el || !onImageUpload) return;
    const problem = imageProblem(file);
    if (problem) {
      onImageUploadError?.(file, new Error(problem));
      return;
    }
    const preview = URL.createObjectURL(file);
    restore();
    document.execCommand('insertHTML', false, `<img src="${preview}" alt="" data-uploading="true">`);
    const img = el.querySelector<HTMLImageElement>(`img[src="${preview}"]`);
    changed();
    try {
      const url = await onImageUpload(file);
      // The app's own upload may also hand back a local blob: preview address.
      const safe = /^blob:/i.test(url) ? url : normalizeImageLink(url);
      if (!safe) throw new Error('The upload did not return an http(s) address.');
      img?.setAttribute('src', safe);
      img?.removeAttribute('data-uploading');
    } catch (error) {
      img?.remove();
      onImageUploadError?.(file, error);
    } finally {
      URL.revokeObjectURL(preview);
      changed();
    }
  };

  const imageFiles = (list: FileList | null | undefined) => Array.from(list ?? []).filter((f) => f.type.startsWith('image/'));

  const onPaste = (e: ClipboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const files = imageFiles(e.clipboardData.files);
    if (files.length) {
      e.preventDefault();
      files.forEach((f) => void uploadImage(f));
      return;
    }
    const html = e.clipboardData.getData('text/html');
    const text = e.clipboardData.getData('text/plain');
    e.preventDefault();
    if (html) document.execCommand('insertHTML', false, sanitizePastedHTML(html));
    else if (text) document.execCommand('insertText', false, text);
    changed();
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    const files = imageFiles(e.dataTransfer.files);
    if (!e.dataTransfer.types.includes('Files')) return;
    // Never let the browser drop a file in as-is.
    e.preventDefault();
    if (!files.length) return;
    const doc = document as Document & { caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null };
    let range: Range | null = null;
    if (doc.caretPositionFromPoint) {
      const pos = doc.caretPositionFromPoint(e.clientX, e.clientY);
      if (pos) {
        range = document.createRange();
        range.setStart(pos.offsetNode, pos.offset);
      }
    } else if (document.caretRangeFromPoint) range = document.caretRangeFromPoint(e.clientX, e.clientY);
    if (range) saved.current = range;
    files.forEach((f) => void uploadImage(f));
  };

  // Put the caret back where it was before a toolbar control took focus, then run the command.
  const run = (cmd: string, arg?: string) => {
    if (disabled) return;
    const el = area.current;
    if (!el) return;
    el.focus();
    const sel = document.getSelection();
    if (saved.current && sel) {
      sel.removeAllRanges();
      sel.addRange(saved.current);
    }
    document.execCommand(cmd, false, arg);
    refresh();
    changed();
  };

  const toggleBlock = (c: Command) => {
    if (c.cmd === 'formatBlock' && c.state && active[c.state]) run('formatBlock', 'p');
    else run(c.cmd, c.arg);
  };

  const tool = (c: Command, on: boolean, onClick: () => void) => (
    <CompactButton
      key={c.label}
      variant="ghost"
      aria-label={c.label}
      title={c.shortcut ? `${c.label} (${c.shortcut})` : c.label}
      aria-pressed={on}
      selected={on}
      disabled={disabled}
      // Keep the text selection when clicking a toolbar button.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
    >
      <Icon name={c.icon} />
    </CompactButton>
  );

  const part = parts<RichTextEditorPart>('rich-text-editor', { classNames, styles: partStyles });
  const divider = (key: string) => <span key={key} {...part('divider', styles.divider)} aria-hidden="true" />;

  return (
    <div {...part('root', [styles.editor, size === 'sm' && styles.sm, invalid || aria['aria-invalid'] ? styles.invalid : undefined, disabled && styles.disabled, className])}>
      <div role="toolbar" aria-label="Formatting" aria-controls={id} {...part('toolbar', styles.toolbar)}>
        {show.textStyle && (
          <>
            <Menu
              aria-label="Text style"
              trigger={
                <Button variant="ghost" size="xs" disabled={disabled} iconRight={<Icon name="CaretDown" />} onMouseDown={(e) => e.preventDefault()}>
                  {TEXT_STYLES.find((t) => t.tag === block)?.label ?? 'Normal text'}
                </Button>
              }
              items={TEXT_STYLES.map((t) => ({ label: t.label, selected: t.tag === block, onSelect: () => run('formatBlock', t.tag) }))}
            />
            {divider('d1')}
          </>
        )}
        {show.format && <div {...part('group', styles.group)}>{FORMAT.map((c) => tool(c, !!active[c.cmd], () => run(c.cmd)))}</div>}
        {show.format && (show.blocks || show.insert) && divider('d2')}
        {show.blocks && <div {...part('group', styles.group)}>{BLOCKS.map((c) => tool(c, !!active[c.state ?? c.cmd], () => toggleBlock(c)))}</div>}
        {show.blocks && show.insert && divider('d3')}
        {show.insert && (
          <div {...part('group', styles.group)}>
            <LinkPopover disabled={disabled} active={!!active.link} getInitial={linkInfo} onApply={applyLink} onRemove={removeLink} />
            <ImagePopover
              disabled={disabled}
              canUpload={!!onImageUpload}
              maxSize={maxImageSize}
              check={imageProblem}
              onUpload={(file) => void uploadImage(file)}
              onApply={(url) => run('insertImage', url)}
            />
          </div>
        )}
        <span className={styles.spacer} />
        {show.history && (
          <div {...part('group', styles.group)}>
            {tool({ cmd: 'undo', icon: 'ArrowCounterClockwise', label: 'Undo', shortcut: 'Ctrl+Z' }, false, () => run('undo'))}
            {tool({ cmd: 'redo', icon: 'ArrowClockwise', label: 'Redo', shortcut: 'Ctrl+Y' }, false, () => run('redo'))}
          </div>
        )}
      </div>
      <div {...part('body', styles.contentWrap)}>
        {empty && <div {...part('placeholder', styles.placeholder)} aria-hidden="true">{placeholder}</div>}
        <StatusIcon className={styles.status} invalid={invalid || !!aria['aria-invalid']} disabled={disabled} />
        <div
          ref={area}
          id={id}
          role="textbox"
          aria-multiline="true"
          aria-label={aria['aria-label']}
          aria-labelledby={aria['aria-labelledby']}
          aria-describedby={aria['aria-describedby']}
          aria-invalid={invalid || aria['aria-invalid'] || undefined}
          aria-disabled={disabled || undefined}
          aria-placeholder={placeholder}
          contentEditable={!disabled}
          suppressContentEditableWarning
          {...part('content', styles.content, { minHeight })}
          onInput={changed}
          onKeyUp={refresh}
          onMouseUp={refresh}
          onPaste={onPaste}
          onDrop={onDrop}
        />
      </div>
    </div>
  );
});

const keepSelection = (e: MouseEvent) => e.preventDefault();

function LinkPopover({ disabled, active, getInitial, onApply, onRemove }: {
  disabled?: boolean;
  active: boolean;
  getInitial: () => { text: string; url: string; editing: boolean; highlighted: boolean };
  onApply: (text: string, url: string) => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(false);
  const openChange = (next: boolean) => {
    if (next) {
      const start = getInitial();
      // Highlighting a link and clicking the button removes it, like a toggle.
      if (start.highlighted) {
        onRemove();
        return;
      }
      setText(start.text);
      setUrl(start.url);
      setEditing(start.editing);
      setError(false);
    }
    setOpen(next);
  };
  const apply = () => {
    const link = normalizeLink(url);
    if (!link) {
      setError(true);
      return;
    }
    onApply(text.trim(), link);
    setOpen(false);
  };
  const enter = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      apply();
    }
  };
  return (
    <Popover
      open={open}
      onOpenChange={openChange}
      arrow={false}
      showClose={false}
      align="start"
      title={editing ? 'Edit link' : 'Add link'}
      trigger={
        <CompactButton variant="ghost" aria-label={active ? 'Edit link' : 'Add link'} aria-pressed={active} selected={active} disabled={disabled} onMouseDown={keepSelection}>
          <Icon name="Link" />
        </CompactButton>
      }
      actions={
        <>
          <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
          <Button size="sm" onClick={apply}>{editing ? 'Save' : 'Add'}</Button>
        </>
      }
    >
      <div className={styles.popoverBody}>
        <InputField size="sm" label="Text" optional value={text} onChange={(e) => setText(e.target.value)} onKeyDown={enter} />
        <InputField
          size="sm"
          label="Link"
          required
          placeholder="e.g. coachli.co/johndoe"
          value={url}
          autoFocus
          error={error ? 'Enter a valid link.' : undefined}
          onChange={(e) => {
            setUrl(e.target.value);
            setError(false);
          }}
          onKeyDown={enter}
        />
        {editing && (
          <LinkButton
            variant="destructive"
            size="sm"
            onClick={() => {
              onRemove();
              setOpen(false);
            }}
          >
            Remove link
          </LinkButton>
        )}
      </div>
    </Popover>
  );
}

function ImagePopover({ disabled, canUpload, maxSize, check, onUpload, onApply }: {
  disabled?: boolean;
  canUpload: boolean;
  maxSize: number;
  check: (file: File) => string | null;
  onUpload: (file: File) => void;
  onApply: (url: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('upload');
  const [url, setUrl] = useState('');
  const [linkError, setLinkError] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const openChange = (next: boolean) => {
    if (next) {
      setTab(canUpload ? 'upload' : 'link');
      setUrl('');
      setLinkError(false);
      setFileError(null);
    }
    setOpen(next);
  };
  const applyLink = () => {
    const link = normalizeImageLink(url);
    if (!link) {
      setLinkError(true);
      return;
    }
    onApply(link);
    setOpen(false);
  };
  const linkField = (
    <InputField
      size="sm"
      label="Image address"
      placeholder="e.g. https://example.com/photo.jpg"
      value={url}
      error={linkError ? 'Enter a valid image link.' : undefined}
      onChange={(e) => {
        setUrl(e.target.value);
        setLinkError(false);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          applyLink();
        }
      }}
    />
  );
  const showActions = !canUpload || tab === 'link';
  return (
    <Popover
      open={open}
      onOpenChange={openChange}
      arrow={false}
      showClose={false}
      align="start"
      title="Add image"
      trigger={
        <CompactButton variant="ghost" aria-label="Add image" disabled={disabled} onMouseDown={keepSelection}>
          <Icon name="Image" />
        </CompactButton>
      }
      actions={
        showActions ? (
          <>
            <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={applyLink}>Add</Button>
          </>
        ) : undefined
      }
    >
      {canUpload ? (
        <Tabs value={tab} onValueChange={setTab} size="sm" className={styles.popoverBody}>
          <TabList aria-label="Add image from">
            <Tab value="upload">Upload</Tab>
            <Tab value="link">Link</Tab>
          </TabList>
          <TabPanel value="upload">
            <FileUpload
              accept={IMAGE_TYPES.join(',')}
              maxSize={maxSize}
              title="Drag an image here"
              description={fileError ?? `PNG, JPG, GIF or WebP, up to ${formatBytes(maxSize)}`}
              error={fileError ?? undefined}
              buttonLabel="Browse files"
              onFiles={(files) => {
                const file = files[0];
                if (!file) return;
                const problem = check(file);
                if (problem) {
                  setFileError(problem);
                  return;
                }
                onUpload(file);
                setOpen(false);
              }}
              onReject={(rejected) => setFileError(rejected[0]?.reason === 'size' ? `Image must be ${formatBytes(maxSize)} or smaller.` : 'Choose a PNG, JPG, GIF or WebP image.')}
            />
          </TabPanel>
          <TabPanel value="link">{linkField}</TabPanel>
        </Tabs>
      ) : (
        <div className={styles.popoverBody}>{linkField}</div>
      )}
    </Popover>
  );
}

export interface RichTextEditorFieldProps extends Omit<RichTextEditorProps, 'aria-describedby' | 'aria-invalid' | 'aria-labelledby'>, Pick<FieldProps, 'label' | 'hint' | 'error' | 'optional' | 'info'> {
  required?: boolean;
  /** Shows a character count, with this as the limit. Figma: Count. */
  maxLength?: number;
  fieldClassName?: string;
  fieldClassNames?: FieldWrapperProps['fieldClassNames'];
  fieldStyles?: FieldWrapperProps['fieldStyles'];
}

/** A RichTextEditor with a label, hint and optional character count. */
export const RichTextEditorField = forwardRef<RichTextEditorHandle, RichTextEditorFieldProps>(function RichTextEditorField(
  { label, hint, error, optional, info, required, id, maxLength, fieldClassName, fieldClassNames, fieldStyles, onChange, defaultValue, ...rest },
  ref,
) {
  const textOf = (html: string) => {
    if (typeof document === 'undefined') return html;
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent ?? '';
  };
  const [length, setLength] = useState(() => textOf(defaultValue ?? '').length);
  const tooLong = maxLength !== undefined && length > maxLength;
  const count: ReactNode = maxLength !== undefined ? `${length}/${maxLength}` : undefined;
  return (
    <Field
      label={label}
      hint={hint}
      error={error ?? (tooLong ? `Keep it under ${maxLength} characters.` : undefined)}
      required={required}
      optional={optional}
      info={info}
      count={count}
      controlId={id}
      className={fieldClassName} classNames={fieldClassNames} styles={fieldStyles}
    >
      {(c) => (
        <RichTextEditor
          ref={ref}
          {...rest}
          {...c}
          defaultValue={defaultValue}
          onChange={(html) => {
            setLength(textOf(html).length);
            onChange?.(html);
          }}
        />
      )}
    </Field>
  );
});
