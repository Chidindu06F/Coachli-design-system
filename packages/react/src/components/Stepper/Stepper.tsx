import type { HTMLAttributes, ReactNode } from 'react';
import { Icon } from '../../internal/Icon';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import styles from './Stepper.module.css';

export interface StepperStep {
  /** Figma: Title. */
  title: ReactNode;
  /** Figma: Description. */
  description?: ReactNode;
  /** Marks a step with a problem, like a form section with errors. Figma: State=Error. */
  error?: boolean;
}

/** Parts you can style with `classNames` and `styles`. */
export type StepperPart = 'root' | 'header' | 'current' | 'count' | 'title' | 'segments' | 'segment' | 'list' | 'step' | 'indicator' | 'connector' | 'text' | 'description';

export interface StepperProps extends Omit<HTMLAttributes<HTMLElement>, 'title'>, PartsProps<StepperPart> {
  steps: StepperStep[];
  /** Index of the current step, starting at 0. Earlier steps show as complete. */
  current: number;
  /** horizontal, vertical, or compact (a title and a segmented bar for small screens). Figma: Orientation. */
  orientation?: 'horizontal' | 'vertical' | 'compact';
  /** Compact only: shows "Next: …" with the next step's title. Figma: Next step. */
  showNext?: boolean;
  /** Screen reader name for the steps. */
  'aria-label'?: string;
}

type Status = 'complete' | 'current' | 'upcoming' | 'error';

/** Shows progress through a task with several steps, like checkout or onboarding. */
export function Stepper({ steps, current, orientation = 'horizontal', showNext = true, className, classNames, styles: partStyles, 'aria-label': label = 'Progress', ...rest }: StepperProps) {
  const part = parts<StepperPart>('stepper', { classNames, styles: partStyles });
  const statusOf = (i: number): Status => (steps[i]?.error ? 'error' : i < current ? 'complete' : i === current ? 'current' : 'upcoming');

  if (orientation === 'compact') {
    const step = steps[current];
    const next = steps[current + 1];
    return (
      <nav aria-label={label} {...rest} {...part('root', [styles.compact, className], rest.style)}>
        <div {...part('header', styles.compactHeader)}>
          <div {...part('current', styles.compactCurrent)}>
            <span {...part('count', styles.count)}>Step {current + 1} of {steps.length}</span>
            <span {...part('title', styles.compactTitle)} aria-current="step">{step?.title}</span>
          </div>
          {showNext && next && <span {...part('count', styles.count)}>Next: {next.title}</span>}
        </div>
        <div {...part('segments', styles.segments)} aria-hidden="true">
          {steps.map((_, i) => (
            <span key={i} {...part('segment', [styles.segment, i <= current && styles.segmentDone, statusOf(i) === 'error' && styles.segmentError])} />
          ))}
        </div>
      </nav>
    );
  }

  return (
    <nav aria-label={label} {...rest} {...part('root', className, rest.style)}>
      <ol {...part('list', [styles.stepper, styles[orientation]])}>
        {steps.map((step, i) => {
          const status = statusOf(i);
          const last = i === steps.length - 1;
          const connectorDone = i < current;
          const indicator = (
            <span {...part('indicator', [styles.indicator, styles[status]])} aria-hidden="true">
              {status === 'complete' ? <Icon name="Check" /> : status === 'error' ? <Icon name="ExclamationMark" /> : i + 1}
            </span>
          );
          const connector = !last && <span {...part('connector', [styles.connector, connectorDone && styles.connectorDone])} aria-hidden="true" />;
          return (
            <li key={i} {...part('step', [styles.step, styles[status]])} aria-current={status === 'current' ? 'step' : undefined}>
              {orientation === 'vertical' ? (
                <span className={styles.rail}>
                  {indicator}
                  {connector}
                </span>
              ) : (
                indicator
              )}
              <span {...part('text', styles.text)}>
                <span {...part('title', styles.title)}>
                  {step.title}
                  <span className={styles.srOnly}>{status === 'complete' ? ', complete' : status === 'error' ? ', has errors' : ''}</span>
                </span>
                {step.description && <span {...part('description', styles.description)}>{step.description}</span>}
              </span>
              {orientation === 'horizontal' && connector && <span className={styles.connectorWrap}>{connector}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
