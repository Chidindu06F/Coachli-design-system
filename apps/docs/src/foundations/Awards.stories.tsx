import type { Meta, StoryObj } from '@storybook/react-vite';
import { Award, awardLabel, awardNames } from '@chidindu06f/coachli-react';
import { Code, Page, Section } from './shared';

const groups = [
  { title: 'One colour', colors: 1 as const },
  { title: 'Two colours', colors: 2 as const },
  { title: 'Three colours', colors: 3 as const },
];

function Awards() {
  return (
    <Page
      title="Awards"
      lead={
        <>
          Twenty raised badges people earn, each in one, two or three colours. Use one with{' '}
          <Code>{'<Award name="on-fire" colors={2} />'}</Code>.
        </>
      }
    >
      {groups.map((g) => (
        <Section key={g.title} title={g.title}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 24 }}>
            {awardNames.map((n) => (
              <figure key={n} style={{ margin: 0, display: 'grid', justifyItems: 'center', gap: 6 }}>
                <Award name={n} colors={g.colors} title="" />
                <figcaption style={{ textAlign: 'center' }}>{awardLabel(n)}</figcaption>
              </figure>
            ))}
          </div>
        </Section>
      ))}
    </Page>
  );
}

const meta: Meta = { title: 'Foundations/Awards', component: Awards, parameters: { layout: 'padded' } };
export default meta;
export const All: StoryObj = {};
