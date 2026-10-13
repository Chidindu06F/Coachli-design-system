import { forwardRef, useMemo, useRef, useState } from 'react';
import type { HTMLAttributes, KeyboardEvent, ReactNode } from 'react';
import { Icon } from '../../internal/Icon';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import { useControllable } from '../../internal/useControllable';
import styles from './Tree.module.css';

export interface TreeNode {
  id: string;
  /** Text for the row. Also used by TreeSelect's search. */
  label: string;
  /** Icon before the label, like a folder or a file. Figma: L icon. */
  icon?: ReactNode;
  children?: TreeNode[];
  disabled?: boolean;
}

/** Parts you can style with `classNames` and `styles`. */
export type TreePart = 'root' | 'item' | 'row' | 'toggle' | 'check' | 'icon' | 'label' | 'group';

export interface TreeProps extends Omit<HTMLAttributes<HTMLUListElement>, 'onSelect' | 'defaultValue' | 'defaultChecked'>, PartsProps<TreePart> {
  nodes: TreeNode[];
  /** Ids of the open branches. */
  expanded?: string[];
  defaultExpanded?: string[];
  onExpandedChange?: (expanded: string[]) => void;
  /** The chosen row, when the tree has no checkboxes. */
  selected?: string | null;
  defaultSelected?: string | null;
  onSelectedChange?: (id: string) => void;
  /** Shows checkboxes. Checking a branch checks everything inside it. Figma: Checkbox. */
  checkable?: boolean;
  /** Ids of the checked leaves (rows with no children). */
  checked?: string[];
  defaultChecked?: string[];
  onCheckedChange?: (checked: string[]) => void;
  /** 32 or 40px rows. Figma: Size. */
  size?: 'sm' | 'md';
  /** Screen reader name, like "Folders". */
  'aria-label'?: string;
}

type Flat = { node: TreeNode; level: number; parent: string | null };

/** All leaf ids under a node, or the node itself when it has no children. */
export function treeLeaves(node: TreeNode): string[] {
  return node.children?.length ? node.children.flatMap(treeLeaves) : [node.id];
}

function flatten(nodes: TreeNode[], open: Set<string>, level = 1, parent: string | null = null, out: Flat[] = []) {
  for (const node of nodes) {
    out.push({ node, level, parent });
    if (node.children?.length && open.has(node.id)) flatten(node.children, open, level + 1, node.id, out);
  }
  return out;
}

/** A list of nested items people open and close, like folders, categories or permissions. */
export const Tree = forwardRef<HTMLUListElement, TreeProps>(function Tree(
  {
    nodes,
    expanded,
    defaultExpanded = [],
    onExpandedChange,
    selected,
    defaultSelected = null,
    onSelectedChange,
    checkable = false,
    checked,
    defaultChecked = [],
    onCheckedChange,
    size = 'md',
    className,
    classNames,
    styles: partStyles,
    ...rest
  },
  ref,
) {
  const part = parts<TreePart>('tree', { classNames, styles: partStyles });
  const [open, setOpen] = useControllable<string[]>(expanded, defaultExpanded, onExpandedChange);
  const [sel, setSel] = useControllable<string | null>(selected, defaultSelected, onSelectedChange as (v: string | null) => void);
  const [ticks, setTicks] = useControllable<string[]>(checked, defaultChecked, onCheckedChange);
  const openSet = useMemo(() => new Set(open), [open]);
  const tickSet = useMemo(() => new Set(ticks), [ticks]);
  const visible = useMemo(() => flatten(nodes, openSet), [nodes, openSet]);
  const [focus, setFocus] = useState<string | null>(null);
  const rows = useRef(new Map<string, HTMLLIElement>());

  const current = focus && visible.some((v) => v.node.id === focus) ? focus : (sel ?? visible[0]?.node.id ?? null);

  const toggleOpen = (id: string, to?: boolean) => {
    const isOpen = openSet.has(id);
    const next = to ?? !isOpen;
    if (next === isOpen) return;
    setOpen(next ? [...open, id] : open.filter((x) => x !== id));
  };

  const stateOf = (node: TreeNode): 'on' | 'off' | 'some' => {
    const leaves = treeLeaves(node);
    const n = leaves.filter((l) => tickSet.has(l)).length;
    return n === 0 ? 'off' : n === leaves.length ? 'on' : 'some';
  };

  const toggleCheck = (node: TreeNode) => {
    const leaves = treeLeaves(node);
    const turnOn = stateOf(node) !== 'on';
    const next = new Set(ticks);
    for (const l of leaves) {
      if (turnOn) next.add(l);
      else next.delete(l);
    }
    setTicks([...next]);
  };

  const activate = (node: TreeNode) => {
    if (node.disabled) return;
    if (checkable) toggleCheck(node);
    else setSel(node.id);
  };

  const moveTo = (id: string | undefined) => {
    if (!id) return;
    setFocus(id);
    rows.current.get(id)?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    rest.onKeyDown?.(e);
    const i = visible.findIndex((v) => v.node.id === current);
    const item = visible[i];
    if (!item) return;
    const hasKids = !!item.node.children?.length;
    const isOpen = openSet.has(item.node.id);
    switch (e.key) {
      case 'ArrowDown':
        moveTo(visible[i + 1]?.node.id);
        break;
      case 'ArrowUp':
        moveTo(visible[i - 1]?.node.id);
        break;
      case 'ArrowRight':
        if (hasKids && !isOpen) toggleOpen(item.node.id, true);
        else if (hasKids) moveTo(visible[i + 1]?.node.id);
        break;
      case 'ArrowLeft':
        if (hasKids && isOpen) toggleOpen(item.node.id, false);
        else if (item.parent) moveTo(item.parent);
        break;
      case 'Home':
        moveTo(visible[0]?.node.id);
        break;
      case 'End':
        moveTo(visible[visible.length - 1]?.node.id);
        break;
      case 'Enter':
      case ' ':
        activate(item.node);
        break;
      default:
        return;
    }
    e.preventDefault();
  };

  const renderLevel = (list: TreeNode[], level: number): ReactNode =>
    list.map((node, i) => {
      const hasKids = !!node.children?.length;
      const isOpen = openSet.has(node.id);
      const check = checkable ? stateOf(node) : null;
      const isSelected = !checkable && sel === node.id;
      return (
        <li
          key={node.id}
          ref={(el) => {
            if (el) rows.current.set(node.id, el);
            else rows.current.delete(node.id);
          }}
          role="treeitem"
          aria-level={level}
          aria-setsize={list.length}
          aria-posinset={i + 1}
          aria-expanded={hasKids ? isOpen : undefined}
          aria-selected={checkable ? undefined : isSelected}
          aria-checked={check ? (check === 'some' ? 'mixed' : check === 'on') : undefined}
          aria-disabled={node.disabled || undefined}
          tabIndex={node.id === current ? 0 : -1}
          {...part('item', styles.item)}
          onFocus={(e) => {
            if (e.target === e.currentTarget) setFocus(node.id);
          }}
        >
          <div
            {...part('row', [styles.row, isSelected && styles.selected, node.disabled && styles.disabled], { paddingInlineStart: `calc(${level - 1} * var(--indent) + var(--halo-spacing-3))` })}
            onClick={() => {
              setFocus(node.id);
              activate(node);
            }}
          >
            {hasKids ? (
              <span
                {...part('toggle', [styles.toggle, isOpen && styles.open])}
                aria-hidden="true"
                onClick={(e) => {
                  e.stopPropagation();
                  setFocus(node.id);
                  toggleOpen(node.id);
                }}
              >
                <Icon name="CaretRight" />
              </span>
            ) : (
              <span className={styles.toggleSpace} aria-hidden="true" />
            )}
            {check && (
              <span {...part('check', [styles.check, check !== 'off' && styles.checkOn])} aria-hidden="true">
                {check === 'on' && <Icon name="Check" />}
                {check === 'some' && <Icon name="Minus" />}
              </span>
            )}
            {node.icon && <span {...part('icon', styles.icon)} aria-hidden="true">{node.icon}</span>}
            <span {...part('label', styles.label)}>{node.label}</span>
          </div>
          {hasKids && isOpen && (
            <ul role="group" {...part('group', styles.group)}>
              {renderLevel(node.children!, level + 1)}
            </ul>
          )}
        </li>
      );
    });

  return (
    <ul ref={ref} role="tree" aria-multiselectable={checkable || undefined} {...rest} {...part('root', [styles.tree, styles[size], className], rest.style)} onKeyDown={onKeyDown}>
      {renderLevel(nodes, 1)}
    </ul>
  );
});

/** Finds a node by id anywhere in the tree. */
export function findTreeNode(nodes: TreeNode[], id: string): TreeNode | undefined {
  for (const n of nodes) {
    if (n.id === id) return n;
    const inner = n.children && findTreeNode(n.children, id);
    if (inner) return inner;
  }
  return undefined;
}

