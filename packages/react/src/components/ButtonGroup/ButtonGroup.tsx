import { Children, cloneElement, forwardRef, isValidElement } from 'react';
import type { HTMLAttributes, ReactElement, ReactNode } from 'react';
import { Button } from '../Button';
import type { ButtonProps, ButtonSize } from '../Button';
import styles from './ButtonGroup.module.css';

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Sets the size of every button in the group. Figma: Size. */
  size?: ButtonSize;
  /** Names the group for screen readers, such as "File actions". */
  'aria-label': string;
  /** `Button` elements. They are shown as joined Secondary buttons. Figma: Items slot. */
  children: ReactNode;
}

type Wrapper = ReactElement<{ children?: ReactNode }>;

// Style the Button, even when it is wrapped in something like a Tooltip.
function styleButton(node: ReactElement, size: ButtonSize): ReactElement {
  const props = node.props as ButtonProps & { children?: ReactNode };
  if (node.type === Button || !isValidElement(props.children)) {
    return cloneElement(node as ReactElement<ButtonProps>, {
      variant: 'secondary',
      size,
      className: [styles.item, props.className].filter(Boolean).join(' '),
    });
  }
  return cloneElement(node as Wrapper, { children: styleButton(props.children as ReactElement, size) });
}

/** A row of joined buttons for related actions, shown as one control. */
export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup(
  { size = 'md', className, children, ...rest },
  ref,
) {
  const buttons = Children.toArray(children).filter(isValidElement);
  return (
    <div ref={ref} role="group" data-halo="button-group" className={[styles.group, className].filter(Boolean).join(' ')} {...rest}>
      {buttons.map((button) => styleButton(button, size))}
    </div>
  );
});
