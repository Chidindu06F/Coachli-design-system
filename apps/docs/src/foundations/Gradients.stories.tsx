import type { Meta, StoryObj } from '@storybook/react-vite';
import { Code, Page, Section, styles } from './shared';

// The moving Highlight border. Copy this CSS as it is. The colours are the gradient/highlight tokens.
const css = `@property --highlight-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

.highlight-border {
  border: 1.5px solid transparent;
  border-radius: 16px;
  background:
    linear-gradient(var(--halo-surface-primary), var(--halo-surface-primary)) padding-box,
    conic-gradient(
      from var(--highlight-angle),
      var(--halo-gradient-highlight-1),
      var(--halo-gradient-highlight-2),
      var(--halo-gradient-highlight-3),
      var(--halo-gradient-highlight-4),
      var(--halo-gradient-highlight-5),
      var(--halo-gradient-highlight-1)
    ) border-box;
  animation: highlight-turn 8s linear infinite;
}

@keyframes highlight-turn {
  to { --highlight-angle: 360deg; }
}

/* People who ask for less motion get the still border. */
@media (prefers-reduced-motion: reduce) {
  .highlight-border { animation: none; }
}`;

const still = `.highlight-border-still {
  border: 1.5px solid transparent;
  border-radius: 16px;
  background:
    linear-gradient(var(--halo-surface-primary), var(--halo-surface-primary)) padding-box,
    linear-gradient(90deg,
      var(--halo-gradient-highlight-1),
      var(--halo-gradient-highlight-2) 25%,
      var(--halo-gradient-highlight-3) 50%,
      var(--halo-gradient-highlight-4) 75%,
      var(--halo-gradient-highlight-5)) border-box;
}`;

function Card({ className, label }: { className: string; label: string }) {
  return (
    <div
      className={className}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', maxWidth: 720, color: 'var(--halo-text-primary)', fontWeight: 600, fontSize: 'var(--halo-font-size-md)' }}
    >
      <span>Finish setting up your account</span>
      <span style={styles.muted}>{label}</span>
    </div>
  );
}

const pre = { ...styles.code, display: 'block', whiteSpace: 'pre', background: 'var(--halo-surface-minimal)', padding: 16, borderRadius: 12, overflowX: 'auto', maxWidth: 720, boxSizing: 'border-box' } as const;

function Gradients() {
  return (
    <Page
      title="Gradients"
      lead={
        <>
          The Highlight gradient runs yellow, sky blue, lime, pink and orange (<Code>gradient/highlight-1</Code> to <Code>-5</Code>; Figma style
          Gradient/Highlight). It is the 1.5px border of the setup checklist on Home. On screen the colours turn slowly around the border, once every 8
          seconds. Nothing else moves.
        </>
      }
    >
      <style>{css + '\n' + still}</style>
      <Section title="Moving">
        <Card className="highlight-border" label="3/5" />
        <p style={styles.muted}>
          Use this one in the app. The colours travel around the border. It stops for people who turn on reduced motion in their device settings. Browsers that can't animate it
          (very old ones) show it still.
        </p>
        <code style={pre}>{css}</code>
      </Section>
      <Section title="Still">
        <Card className="highlight-border-still" label="3/5" />
        <p style={styles.muted}>The same colours left to right, as in Figma.</p>
        <code style={pre}>{still}</code>
      </Section>
    </Page>
  );
}

const meta: Meta = { title: 'Foundations/Gradients', component: Gradients, parameters: { layout: 'padded' } };
export default meta;
export const All: StoryObj = {};
