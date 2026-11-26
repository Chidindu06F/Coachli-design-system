/*
 * Award badges, drawn on a 96 by 104 grid: a raised, bevelled shape with a white symbol.
 * Earned awards blend three colours; inactive ones (not earned yet) are flat gray. The same generator builds the Figma components,
 * so keep to plain SVG: paths, circles, rects, ellipses, linear gradients and one clip path.
 */

type Shape = 'hex' | 'shield' | 'octagon' | 'diamond' | 'circle' | 'flower';

const flower = (() => {
  let d = '';
  for (let i = 0; i < 12; i++) {
    const a = (Math.PI * 2 * i) / 12;
    const r = i % 2 ? 35 : 41;
    d += `${i ? 'L' : 'M'}${(48 + r * Math.cos(a)).toFixed(1)} ${(46 + r * Math.sin(a)).toFixed(1)}`;
  }
  return `${d}Z`;
})();

const SHAPES: Record<Shape, string> = {
  hex: 'M48 6L84 27V69L48 90L12 69V27Z',
  shield: 'M48 6L82 16V46C82 68 66 82 48 90C30 82 14 68 14 46V16Z',
  octagon: 'M34 8H62L84 30V58L62 80H34L12 58V30Z',
  diamond: 'M48 6L88 46L48 86L8 46Z',
  circle: 'M48 8A38 38 0 1 1 47.99 8Z',
  flower,
};

const starPath = (cx: number, cy: number, R: number, r: number) => {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 ? r : R;
    d += `${i ? 'L' : 'M'}${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)}`;
  }
  return `${d}Z`;
};
const sparkle = (x: number, y: number, s: number) => `M${x} ${y - s}Q${x} ${y} ${x + s} ${y}Q${x} ${y} ${x} ${y + s}Q${x} ${y} ${x - s} ${y}Q${x} ${y} ${x} ${y - s}Z`;
// Marks inside a symbol, like the hole in a key, are cut-outs shown as a faint dark fill.
const cut = (shape: string) => shape.replace('/>', ' fill="#000000" fill-opacity="0.2" stroke="none"/>');

const laurel = (() => {
  // Two branches curving up from the bottom, each leaf turned along the curve.
  let s = '';
  for (const t of [110, 132, 155, 180, 205, 228]) {
    for (const deg of [t, 180 - t]) {
      const a = (Math.PI / 180) * deg;
      const x = (48 + 16 * Math.cos(a)).toFixed(1);
      const y = (47 + 16 * Math.sin(a)).toFixed(1);
      s += `<ellipse cx="${x}" cy="${y}" rx="5" ry="2.5" transform="rotate(${deg + 90} ${x} ${y})"/>`;
    }
  }
  return `${s}<path d="${starPath(48, 45, 7, 3)}" stroke-linejoin="round" stroke-width="1.5"/>`;
})();

const SYMBOLS = {
  star: `<path d="${starPath(48, 46, 17, 7.5)}" stroke-linejoin="round" stroke-width="3"/>`,
  flame: '<path d="M48 26C55 34 62 40 62 51A14 14 0 0 1 34 51C34 44 37 40 41 37C41 42 43 45 45 46C44 37 47 31 48 26Z" stroke-linejoin="round" stroke-width="2"/>',
  trophy:
    '<path d="M38 30H58V39A10 10 0 0 1 38 39Z"/><path d="M38 33H33A6 6 0 0 0 39 42M58 33H63A6 6 0 0 1 57 42" fill="none" stroke-width="3" stroke-linecap="round"/><rect x="45.5" y="48" width="5" height="8"/><rect x="39" y="55" width="18" height="6" rx="2.5"/>',
  crown: '<path d="M32 57L29 34L40 43L48 29L56 43L67 34L64 57Z" stroke-linejoin="round" stroke-width="2.5"/>',
  bolt: '<path d="M52 26L37 49H47L44 66L59 42H49Z" stroke-linejoin="round" stroke-width="2"/>',
  rocket: `<path d="M48 25C55 30 58 40 56 52H40C38 40 41 30 48 25Z"/><path d="M40 45L33 55H40ZM56 45L63 55H56Z" stroke-linejoin="round" stroke-width="2"/><path d="M44 55H52L48 63Z"/>${cut('<circle cx="48" cy="39" r="4"/>')}`,
  heart: '<path d="M48 62C37 55 30 49 30 41A9 9 0 0 1 48 37A9 9 0 0 1 66 41C66 49 59 55 48 62Z" stroke-linejoin="round" stroke-width="2"/>',
  gem: `<path d="M39 32H57L64 41L48 62L32 41Z" stroke-linejoin="round" stroke-width="2"/>${cut('<path d="M32 41H64L48 62Z"/>')}`,
  target: `<circle cx="48" cy="46" r="16"/>${cut('<circle cx="48" cy="46" r="10.5"/>')}<circle cx="48" cy="46" r="5"/>`,
  flag: '<rect x="35" y="26" width="4" height="38" rx="2"/><path d="M39 28H62L57 36L62 44H39Z" stroke-linejoin="round" stroke-width="2"/>',
  mountain: `<path d="M28 60L42 37L49 47L55 39L68 60Z" stroke-linejoin="round" stroke-width="2.5"/>${cut('<path d="M42 37L47 45L44 43.5L40 46Z"/>')}`,
  check: '<path d="M36 46L44 54L61 36" fill="none" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/>',
  sparkles: `<path d="${sparkle(45, 48, 15)}"/><path d="${sparkle(62, 31, 6)}"/><path d="${sparkle(62, 62, 4.5)}"/>`,
  medal: `<path d="M38 25H47L52 39H43ZM58 25H49L44 39H53Z"/><circle cx="48" cy="52" r="12"/>${cut(`<path d="${starPath(48, 52, 6, 2.6)}"/>`)}`,
  laurel,
  key: `<circle cx="38" cy="46" r="9.5"/>${cut('<circle cx="38" cy="46" r="3.5"/>')}<rect x="45" y="43.5" width="22" height="5" rx="2"/><rect x="59" y="47" width="4" height="7" rx="1"/><rect x="52" y="47" width="4" height="5" rx="1"/>`,
  book: `<path d="M48 35C42 31 34 31 28 33V59C34 57 42 57 48 61Z" stroke-linejoin="round" stroke-width="2"/><path d="M48 35C54 31 62 31 68 33V59C62 57 54 57 48 61Z" stroke-linejoin="round" stroke-width="2"/>${cut('<rect x="47" y="35" width="2" height="26"/>')}`,
  coin: `<circle cx="48" cy="46" r="16"/>${cut('<circle cx="48" cy="46" r="10"/>')}<rect x="45.5" y="39" width="5" height="14" rx="2.5"/>`,
  moon: `<path d="M53 29A17 17 0 1 0 65 52A13 13 0 0 1 53 29Z" stroke-linejoin="round" stroke-width="2"/><path d="${sparkle(62, 33, 4)}"/>`,
  sun: `<circle cx="48" cy="46" r="9"/>${Array.from({ length: 8 }, (_, i) => `<rect x="46.2" y="26" width="3.6" height="7" rx="1.8" transform="rotate(${i * 45} 48 46)"/>`).join('')}`,
};

interface AwardDef {
  label: string;
  shape: Shape;
  symbol: keyof typeof SYMBOLS;
  /** The three face colours, then the two edge tones. */
  three: [string, string, string];
  edge: [string, string];
}

const AWARDS = {
  'first-step': { label: 'First step', shape: 'shield', symbol: 'star', three: ['#FF8AD8', '#C04CF5', '#6A5CFF'], edge: ['#6A1FA0', '#3E1570'] },
  'on-fire': { label: 'On fire', shape: 'hex', symbol: 'flame', three: ['#FFE36E', '#FF8A3D', '#E8314F'], edge: ['#B8451A', '#7A2A0E'] },
  champion: { label: 'Champion', shape: 'octagon', symbol: 'trophy', three: ['#FFF3A0', '#FFC83D', '#E8892A'], edge: ['#B57406', '#7A4C03'] },
  legend: { label: 'Legend', shape: 'circle', symbol: 'crown', three: ['#29D3C5', '#5B8CFF', '#C04CF5'], edge: ['#4A2FB0', '#2C1C70'] },
  'quick-thinker': { label: 'Quick thinker', shape: 'diamond', symbol: 'bolt', three: ['#FFF59D', '#FFC93C', '#FF7A3D'], edge: ['#C27A00', '#855200'] },
  'lift-off': { label: 'Lift off', shape: 'shield', symbol: 'rocket', three: ['#7DF0E0', '#3DA5FF', '#5B5CF0'], edge: ['#2840A8', '#18286E'] },
  'most-loved': { label: 'Most loved', shape: 'flower', symbol: 'heart', three: ['#FFD25E', '#FF7A59', '#D9488F'], edge: ['#A8215C', '#6E153C'] },
  'rare-find': { label: 'Rare find', shape: 'diamond', symbol: 'gem', three: ['#9BF2E0', '#2FB6E8', '#3A5BD9'], edge: ['#16709A', '#0C4566'] },
  bullseye: { label: 'Bullseye', shape: 'circle', symbol: 'target', three: ['#FFB36B', '#FF5A5F', '#C2185B'], edge: ['#9E1B32', '#661020'] },
  'finish-line': { label: 'Finish line', shape: 'hex', symbol: 'flag', three: ['#D7F57A', '#4FD18B', '#119E8F'], edge: ['#0F7048', '#08482E'] },
  summit: { label: 'Summit', shape: 'shield', symbol: 'mountain', three: ['#B5F5E0', '#3CC8C0', '#2F6FD9'], edge: ['#0E6670', '#084048'] },
  verified: { label: 'Verified', shape: 'flower', symbol: 'check', three: ['#7DE8FF', '#6A8CFF', '#8A4CF5'], edge: ['#3328A8', '#1F186E'] },
  shining: { label: 'Shining', shape: 'octagon', symbol: 'sparkles', three: ['#FFD0F0', '#E254D8', '#7C4DFF'], edge: ['#7A1288', '#4E0B58'] },
  medalist: { label: 'Medalist', shape: 'circle', symbol: 'medal', three: ['#FFE0B0', '#E39A5C', '#A8502A'], edge: ['#8A4B1F', '#5C3014'] },
  laurels: { label: 'Laurels', shape: 'circle', symbol: 'laurel', three: ['#FFE36E', '#9BD94A', '#2E9E5B'], edge: ['#4A7A1C', '#2E4E10'] },
  unlocked: { label: 'Unlocked', shape: 'diamond', symbol: 'key', three: ['#FFF0A0', '#F5B83A', '#D9622A'], edge: ['#A85E08', '#6E3C04'] },
  bookworm: { label: 'Bookworm', shape: 'shield', symbol: 'book', three: ['#FFD9A0', '#F58A5C', '#C2354A'], edge: ['#9C3A1E', '#662410'] },
  saver: { label: 'Saver', shape: 'flower', symbol: 'coin', three: ['#E8FF9A', '#5ED69A', '#139C8E'], edge: ['#127052', '#0A4834'] },
  'night-owl': { label: 'Night owl', shape: 'hex', symbol: 'moon', three: ['#9AD8FF', '#6A6CF0', '#4A2A9E'], edge: ['#2A2680', '#181652'] },
  'early-bird': { label: 'Early bird', shape: 'diamond', symbol: 'sun', three: ['#FFE36E', '#FF9A6B', '#F0508A'], edge: ['#B84A3A', '#7A2E24'] },
} satisfies Record<string, AwardDef>;

export type AwardName = keyof typeof AWARDS;

/** Every award name, in display order. */
export const awardNames = Object.keys(AWARDS) as AwardName[];
export const awardLabel = (name: AwardName) => AWARDS[name].label;

const gradient = (id: string, stops: string[], x2 = 0.9, y2 = 1, x1 = 0.1, y1 = 0) =>
  `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops
    .map((c, i) => `<stop offset="${stops.length === 1 ? 0 : (i / (stops.length - 1)).toFixed(2)}" stop-color="${c}"/>`)
    .join('')}</linearGradient>`;

// Inactive awards (not earned yet) are flat gray with a gray symbol. The colours are tokens, so they turn to
// shades of black in dark mode. CSS variables only work in style, not in SVG attributes.
const INACTIVE = {
  face: 'var(--halo-award-inactive-face)',
  edge: 'var(--halo-award-inactive-edge)',
  shade: 'var(--halo-award-inactive-edge-shade)',
  symbol: 'var(--halo-award-inactive-symbol)',
};

/**
 * The inner SVG for an award. `id` must be unique on the page, because the gradients are referenced by id.
 * `inactive` draws the award not earned yet.
 */
export function awardMarkup(name: AwardName, id: string, inactive = false) {
  const a = AWARDS[name] as AwardDef;
  const d = SHAPES[a.shape];
  const stops = inactive ? [] : a.three;
  const face = `${id}-face`;
  const inner = `${id}-inner`;
  const side = `${id}-side`;
  const bevel = `${id}-bevel`;
  const shine = `${id}-shine`;
  const clip = `${id}-clip`;
  const faceFill = inactive ? INACTIVE.face : `url(#${face})`;
  const innerFill = faceFill === `url(#${face})` ? `url(#${inner})` : faceFill;
  const paint = (fill: string) => (inactive ? `style="fill:${fill};stroke:${fill}"` : `fill="${fill}" stroke="${fill}"`);
  const at = (s: number) => `transform="translate(48 46) scale(${s}) translate(-48 -46)"`;
  const symbol = SYMBOLS[a.symbol];
  return [
    '<defs>',
    inactive ? '' : gradient(face, stops) + gradient(inner, [...stops].reverse()),
    inactive
      ? `<linearGradient id="${side}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:${INACTIVE.edge}"/><stop offset="1" style="stop-color:${INACTIVE.shade}"/></linearGradient>`
      : gradient(side, a.edge, 0, 1, 0, 0),
    gradient(bevel, ['#FFFFFF', '#FFFFFF', '#000000'], 0, 1, 0, 0),
    `<linearGradient id="${shine}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.45"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient>`,
    `<clipPath id="${clip}"><path d="${d}"/></clipPath>`,
    '</defs>',
    `<path d="${d}" fill="url(#${side})" stroke="url(#${side})" stroke-width="7" stroke-linejoin="round" transform="translate(0 7)"/>`,
    `<path d="${d}" fill="url(#${side})" stroke="url(#${side})" stroke-width="7" stroke-linejoin="round" transform="translate(0 3.5)"/>`,
    `<path d="${d}" ${paint(faceFill)} stroke-width="7" stroke-linejoin="round"/>`,
    `<path d="${d}" fill="none" stroke="url(#${bevel})" stroke-opacity="0.35" stroke-width="2.5" stroke-linejoin="round" ${at(0.94)}/>`,
    `<path d="${d}" fill="#000000" fill-opacity="0.16" ${at(0.77)}/>`,
    inactive ? `<path d="${d}" style="fill:${innerFill}" ${at(0.74)}/>` : `<path d="${d}" fill="${innerFill}" ${at(0.74)}/>`,
    `<path d="${d}" fill="none" stroke="#FFFFFF" stroke-opacity="0.45" stroke-width="1.5" ${at(0.74)}/>`,
    `<g clip-path="url(#${clip})"><ellipse cx="48" cy="14" rx="40" ry="20" fill="url(#${shine})"/></g>`,
    `<g fill="#000000" fill-opacity="0.22" stroke="#000000" stroke-opacity="0.22" transform="translate(0 3)">${symbol}</g>`,
    `<g ${paint(inactive ? INACTIVE.symbol : '#FFFFFF')}>${symbol}</g>`,
  ].join('');
}
