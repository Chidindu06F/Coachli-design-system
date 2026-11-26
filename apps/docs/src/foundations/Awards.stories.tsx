import type { Meta, StoryObj } from '@storybook/react-vite';
import { Award, awardLabel, awardNames } from '@chidindu06f/coachli-react';
import { Code, Page, Section } from './shared';

const groups = [
  { title: 'Earned', inactive: false },
  { title: 'Inactive', inactive: true },
];

function Awards() {
  return (
    <Page
      title="Awards"
      lead={
        <>
          Twenty raised badges people earn. Earned awards blend three colours: <Code>{'<Award name="on-fire" />'}</Code>. Awards not
          earned yet are flat gray, shades of black in dark mode: <Code>{'<Award name="on-fire" inactive />'}</Code>. Don't fade an
          earned award with opacity instead.
        </>
      }
    >
      {groups.map((g) => (
        <Section key={g.title} title={g.title}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 24 }}>
            {awardNames.map((n) => (
              <figure key={n} style={{ margin: 0, display: 'grid', justifyItems: 'center', gap: 6 }}>
                <Award name={n} inactive={g.inactive} title="" />
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
