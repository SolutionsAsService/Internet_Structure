// Geometry for the landing cross-section, computed at build time. Two sizes are produced
// (desktop and phone) and drawn at 1:1 so no label is ever scaled below its set size.
import { ROUTE_IDS, ROUTE_BRANCH_IDS } from './data.js';
import { DOSSIERS } from './dossiers.js';

// Where along the band (0..1) each route stop sits, so the red line reads left to right.
const ROUTE_X = { comcast: 0.06, equinix: 0.2, grace_hopper: 0.34, google: 0.5, verisign: 0.66, icann: 0.82, nvidia: 0.56, tsmc: 0.86 };

export const SIZES = {
  wide: { width: 720, labelW: 160, bandH: 70, gap: 0, pitch: 9.5, rMin: 2, rMax: 4.2, font: 13, small: 11.5, pad: 10, historyH: 78 },
  narrow: { width: 343, labelW: 82, bandH: 50, gap: 0, pitch: 7.4, rMin: 1.5, rMax: 3.1, font: 12, small: 11, pad: 6, historyH: 64 },
};

export function figureGeometry(atlas, sizeKey) {
  const s = SIZES[sizeKey];
  const plotX = s.labelW;
  const plotW = s.width - s.labelW - s.pad;
  const routeSet = new Set([...ROUTE_IDS, ...ROUTE_BRANCH_IDS]);
  const r = n => s.rMin + ((n.importance - 1) / 9) * (s.rMax - s.rMin);

  const bands = atlas.strata.map((stratum, i) => {
    const y0 = i * s.bandH;
    const members = stratum.members.map(id => atlas.nodeById.get(id));
    const cols = Math.floor(plotW / s.pitch);
    const rows = Math.ceil(members.length / cols);
    const rowGap = Math.min(s.pitch, (s.bandH - 22) / Math.max(rows, 1));
    // Reserve the route stops' slots, then pour the remaining members into the grid.
    const taken = new Set();
    const placed = [];
    for (const n of members.filter(m => routeSet.has(m.id))) {
      const col = Math.round(ROUTE_X[n.id] * (cols - 1));
      const row = 0;
      taken.add(`${row}:${col}`);
      placed.push({ n, col, row });
    }
    let cursor = 0; // fills row 0 around the reserved route slots, then the rows below
    for (const n of members.filter(m => !routeSet.has(m.id))) {
      let row, col;
      do { row = Math.floor(cursor / cols); col = cursor % cols; cursor++; } while (taken.has(`${row}:${col}`));
      placed.push({ n, col, row });
    }
    const dotsTop = y0 + s.bandH - 8 - (rows - 1) * rowGap;
    const dots = placed.map(({ n, col, row }) => ({
      id: n.id,
      name: n.name,
      x: round(plotX + s.pitch / 2 + col * s.pitch),
      y: round(dotsTop + row * rowGap),
      r: round(routeSet.has(n.id) ? Math.max(r(n), s.rMax) + 0.6 : r(n)),
      route: routeSet.has(n.id),
    }));
    return { id: stratum.id, n: stratum.n, name: stratum.name, title: stratum.title, count: stratum.count, y0, dots };
  });

  const dotById = new Map(bands.flatMap(b => b.dots).map(d => [d.id, d]));
  const route = ROUTE_IDS.map(id => dotById.get(id));
  const branch = ROUTE_BRANCH_IDS.map(id => dotById.get(id));

  // The bedrock band: the history dossiers on a time axis.
  const hy0 = bands.length * s.bandH;
  const years = DOSSIERS.map(d => d.year);
  const minY = Math.min(...years);
  const maxY = Math.max(...years);
  const tx = year => round(plotX + 6 + ((year - minY) / (maxY - minY)) * (plotW - 12));
  const stacked = new Map();
  const history = {
    y0: hy0,
    axisY: hy0 + s.historyH - 18,
    minYear: minY,
    maxYear: maxY,
    ticks: DOSSIERS.map(d => {
      const k = stacked.get(d.year) || 0;
      stacked.set(d.year, k + 1);
      return { slug: d.slug, title: d.title, short: d.short, year: d.year, x: tx(d.year), lift: k };
    }),
  };

  return { size: s, plotX, plotW, height: hy0 + s.historyH, bands, route, branch, history };
}

function round(value) {
  return Math.round(value * 10) / 10;
}
