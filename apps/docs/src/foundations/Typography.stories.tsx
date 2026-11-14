import type { Meta, StoryObj } from '@storybook/react-vite';
import { byCollection, Code, Page, Section, styles } from './shared';

const typography = byCollection('Typography');
const sizes = typography.filter((t) => t.name.startsWith('size/'));
const weights = typography.filter((t) => t.name.startsWith('weight/'));
const lineHeightVar = (size: string) => typography.find((t) => t.name === `line-height/${size}`)?.cssVar;

const cell = { padding: '12px', borderBottom: '1px solid var(--halo-border-primary)', verticalAlign: 'middle' } as const;

function Typography() {
  const family = typography.find((t) => t.name === 'family/body');
  return (
    <Page title="Typography" lead={<>Coachli uses <strong>{String(family?.values.default)}</strong> for headings, body, labels and captions. Font sizes are in rem so they respect the user's browser font settings.</>}>
      <Section title="Type scale">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ ...styles.muted, textAlign: 'left' }}>
              <th style={cell}>Token</th>
              <th style={cell}>Size / line height</th>
              <th style={cell}>Sample</th>
            </tr>
          </thead>
          <tbody>
            {sizes.map((t) => {
              const key = t.name.split('/')[1]!;
              const lh = typography.find((x) => x.name === `line-height/${key}`);
              return (
                <tr key={t.name}>
                  <td style={{ ...cell, whiteSpace: 'nowrap' }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{key}</div>
                    <Code>{t.cssVar}</Code>
                  </td>
                  <td style={{ ...cell, whiteSpace: 'nowrap' }}>
                    <Code>
                      {String(t.values.default)}px / {String(lh?.values.default)}px
                    </Code>
                  </td>
                  <td style={cell}>
                    <span style={{ fontSize: `var(${t.cssVar})`, lineHeight: `var(${lineHeightVar(key)})`, fontWeight: 600 }}>
                      Coachli design system
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Section>
      <Section title="Weights">
        <div style={{ display: 'grid', gap: 12 }}>
          {weights.map((t) => (
            <div key={t.name} style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
              <span style={{ fontSize: 24, fontWeight: `var(${t.cssVar})` as never, minWidth: 260 }}>The quick brown fox</span>
              <Code>
                {t.cssVar}: {String(t.values.default)}
              </Code>
            </div>
          ))}
        </div>
      </Section>
    </Page>
  );
}

const meta: Meta = { title: 'Foundations/Typography', component: Typography, parameters: { layout: 'padded' } };
export default meta;
export const Scale: StoryObj = {};
