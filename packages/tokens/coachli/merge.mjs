// Merges coachli/export.json (flat export of the COACHLI DESIGN SYSTEM Figma variables)
// into figma/<Collection>/<Mode>.tokens.json, in Figma's own export format.
// Tokens that only exist in the code are kept and listed, so no component loses a variable.
//
// Usage: node coachli/merge.mjs   (then: pnpm build:tokens)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FIGMA = path.join(ROOT, 'figma');
const exp = JSON.parse(fs.readFileSync(path.join(ROOT, 'coachli', 'export.json'), 'utf8'));

const flatten = (node, trail = [], out = new Map()) => {
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith('$')) continue;
    if (v && typeof v === 'object' && '$type' in v) out.set([...trail, k].join('/'), v);
    else if (v && typeof v === 'object') flatten(v, [...trail, k], out);
  }
  return out;
};
const nest = (map) => {
  const root = {};
  for (const [name, tok] of map) {
    const parts = name.split('/');
    let n = root;
    for (const p of parts.slice(0, -1)) n = n[p] ??= {};
    n[parts.at(-1)] = tok;
  }
  return root;
};

const parseRef = (collection, v) => {
  const s = v.slice(1);
  const i = s.indexOf(':');
  return i === -1 ? { set: collection, name: s } : { set: s.slice(0, i), name: s.slice(i + 1) };
};
const modeOf = (set, mode) => (exp[`${set}/${mode}`] ? mode : Object.keys(exp).find((k) => k.startsWith(`${set}/`)).split('/')[1]);
const resolve = (set, mode, name, depth = 0) => {
  const v = exp[`${set}/${modeOf(set, mode)}`]?.[name];
  if (typeof v === 'string' && v.startsWith('@') && depth < 10) {
    const r = parseRef(set, v);
    return resolve(r.set, r.set === set ? mode : undefined, r.name, depth + 1);
  }
  return v;
};
const color = (hex) => {
  const h = hex.replace('#', '');
  const c = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const alpha = h.length === 8 ? Math.round((parseInt(h.slice(6, 8), 16) / 255) * 10000) / 10000 : 1;
  return { colorSpace: 'srgb', components: c, alpha, hex: `#${h.slice(0, 6).toUpperCase()}` };
};

const report = [];
for (const key of Object.keys(exp).filter((k) => !k.startsWith('_'))) {
  const [set, mode] = key.split('/');
  const file = path.join(FIGMA, set, `${mode}.tokens.json`);
  const existing = fs.existsSync(file) ? flatten(JSON.parse(fs.readFileSync(file, 'utf8'))) : new Map();
  const merged = new Map(existing);
  let changed = 0, added = 0;
  for (const [name, v] of Object.entries(exp[key])) {
    const prev = existing.get(name);
    const res = resolve(set, mode, name);
    const isColor = typeof res === 'string' && res.startsWith('#');
    const type = prev?.$type ?? (isColor ? 'color' : typeof res === 'number' ? 'number' : 'string');
    let tok;
    if (typeof v === 'string' && v.startsWith('@')) {
      const r = parseRef(set, v);
      tok = { $type: type, $value: type === 'color' ? color(res) : res, $extensions: { 'com.figma.aliasData': { targetVariableName: r.name, targetVariableSetName: r.set } } };
    } else tok = { $type: type, $value: type === 'color' ? color(v) : v };
    if (!prev) added++;
    else if (JSON.stringify(prev.$value) !== JSON.stringify(tok.$value) || JSON.stringify(prev.$extensions ?? null) !== JSON.stringify(tok.$extensions ?? null)) changed++;
    merged.set(name, tok);
  }
  const kept = [...existing.keys()].filter((n) => !(n in exp[key]));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(nest(merged), null, 2) + '\n');
  report.push(`${key}: ${changed} changed, ${added} added${kept.length ? `, kept from code: ${kept.join(', ')}` : ''}`);
}
console.log(report.join('\n'));
