import { COACHING_ICONS } from './coachingIcons';

// One seamless tile of the coaching icon pattern, matching the Figma component:
// 28px icons on a 76px grid, every other row shifted half a step, with small tilts.
// The tile is used as a CSS mask, so the icon colour comes from a token and follows dark mode.

const STEP = 76;
const SIZE = 28;
const COLS = 6;
const ROWS = 4;
const W = STEP * COLS;
const H = STEP * ROWS;
const TILTS = [0, -12, 8, 0, 12, -8];
// A fixed shuffle so neighbouring icons differ and rows don't repeat.
const ORDER = [3, 17, 8, 22, 1, 12, 19, 5, 14, 0, 21, 9, 6, 15, 23, 2, 11, 18, 7, 20, 13, 4, 16, 10];

function icon(name: string, cx: number, cy: number, tilt: number) {
  const s = SIZE / 256;
  const paths = (COACHING_ICONS[name] ?? []).map((d) => `<path d="${d}"/>`).join('');
  return `<g transform="translate(${cx} ${cy}) rotate(${tilt}) translate(${-SIZE / 2} ${-SIZE / 2}) scale(${s})">${paths}</g>`;
}

function buildTile() {
  const names = Object.keys(COACHING_ICONS);
  const parts: string[] = [];
  let i = 0;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const name = names[(ORDER[i % ORDER.length] ?? i) % names.length] ?? '';
      const tilt = TILTS[(r + c) % TILTS.length] ?? 0;
      const cx = c * STEP + STEP / 2 + (r % 2 ? STEP / 2 : 0);
      const cy = r * STEP + STEP / 2;
      // Draw again one tile-width to the left so shifted rows wrap seamlessly.
      for (const dx of [0, -W]) parts.push(icon(name, cx + dx, cy, tilt));
      i++;
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${parts.join('')}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export const PATTERN_TILE = buildTile();
export const PATTERN_SIZE = { width: W, height: H };
