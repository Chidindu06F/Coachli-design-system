import type { Meta, StoryObj } from '@storybook/react-vite';
import { Illustration, illustrationGroups } from '@chidindu06f/coachli-react';
import { Code, Page, Section } from './shared';

const label = (n: string) => n.charAt(0).toUpperCase() + n.slice(1).replace(/-/g, ' ');

function Illustrations() {
  return (
    <Page
      title="Illustrations"
      lead={
        <>
          Forty spot illustrations for empty states. Use one with <Code>{'<Illustration name="no-results" />'}</Code>, usually in the
          media slot of Empty state. Recolour them with the <Code>--halo-illustration-*</Code> variables.
        </>
      }
    >
      {Object.entries(illustrationGroups).map(([group, names]) => (
        <Section key={group} title={group}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(176px, 1fr))', gap: 24 }}>
            {names.map((n) => (
              <figure key={n} style={{ margin: 0, display: 'grid', justifyItems: 'center', gap: 6 }}>
                <Illustration name={n} />
                <figcaption style={{ textAlign: 'center' }}>{label(n)}</figcaption>
              </figure>
            ))}
          </div>
        </Section>
      ))}
    </Page>
  );
}

const meta: Meta = { title: 'Foundations/Illustrations', component: Illustrations, parameters: { layout: 'padded' } };
export default meta;
export const All: StoryObj = {};
