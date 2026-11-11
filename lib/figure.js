// Geometry for the landing cross-section, computed at build time. Two sizes are produced
// (desktop and phone) and drawn at 1:1 so no label is ever scaled below its set size.
//
// Encodings: one dot = one organisation (all dots the same size); band = stratum, and a
// band is as tall as its rows of dots need, so a crowded stratum is visibly heavier;
// ink dot = hub (one of the fewest organisations that together hold half of all recorded
// connections); red = one chain of recorded connections. Position along a band is fill
// order only.
import { ROUTE_IDS, ROUTE_BRANCH_IDS } from './data.js';
import { DOSSIERS } from './dossiers.js';

// Where along the band (0..1) each route stop sits, so the red line reads left to right.
// Hand-set for legibility; the caption says position along a band carries no meaning.
const ROUTE_X = { comcast: 0.06, equinix: 0.2, grace_hopper: 0.34, google: 0.5, verisign: 0.66, icann: 0.82, nvidia: 0.56, tsmc: 0.86 };

export const SIZES = {
  wide: { width: 720, labelW: 214, pitch: 16, r: 5.8, padTop: 24, padBottom: 9, labelMinH: 48, pad: 8, historyH: 76 },
  narrow: { width: 343, labelW: 84, pitch: 9, r: 3.4, padTop: 21, padBottom: 6, labelMinH: 40, pad: 4, historyH: 72 },
};

export function figureGeometry(atlas, sizeKey) {
  const s = SIZES[sizeKey];
  const plotX = s.labelW;
  const plotW = s.width - s.labelW - s.pad;
  const cols = Math.floor(plotW / s.pitch);
  const routeSet = new Set([...ROUTE_IDS, ...ROUTE_BRANCH_IDS]);

  let y = 0;
  const bands = atlas.strata.map(stratum => {
    const members = stratum.members.map(id => atlas.nodeById.get(id));
    const rows = Math.ceil(members.length / cols);
    const bandH = Math.max(s.labelMinH, s.padTop + rows * s.pitch + s.padBottom);
    const y0 = y;
    y += bandH;
    // Reserve the route stops' slots in the first row, then pour the rest in, hubs first.
    const taken = new Set();
    const placed = [];
    for (const n of members.filter(m => routeSet.has(m.id))) {
      const col = Math.round(ROUTE_X[n.id] * (cols - 1));
      taken.add(`0:${col}`);
      placed.push({ n, col, row: 0 });
    }
    let cursor = 0;
    const rest = members.filter(m => !routeSet.has(m.id)).sort((a, b) => Number(b.hub) - Number(a.hub));
    for (const n of rest) {
      let row, col;
      do { row = Math.floor(cursor / cols); col = cursor % cols; cursor++; } while (taken.has(`${row}:${col}`));
      placed.push({ n, col, row });
    }
    const dotsTop = y0 + bandH - s.padBottom - (rows - 1) * s.pitch - s.pitch / 2;
    const dots = placed.map(({ n, col, row }) => ({
      id: n.id,
      name: n.name,
      x: round(plotX + s.pitch / 2 + col * s.pitch),
      y: round(dotsTop + row * s.pitch),
      r: s.r,
      hub: n.hub,
      route: routeSet.has(n.id),
    }));
    return { id: stratum.id, n: stratum.n, name: stratum.name, title: stratum.title, count: stratum.count, hubs: members.filter(m => m.hub).length, y0, h: bandH, dots };
  });

  const dotById = new Map(bands.flatMap(b => b.dots).map(d => [d.id, d]));
  const route = ROUTE_IDS.map(id => dotById.get(id));
  const branch = ROUTE_BRANCH_IDS.map(id => dotById.get(id));

  // The bedrock band: the history dossiers on a time axis with labelled quarter-century marks.
  const hy0 = y;
  const years = DOSSIERS.map(d => d.year);
  const minY = Math.min(...years);
  const maxY = Math.max(...years);
  const tx = year => round(plotX + 6 + ((year - minY) / (maxY - minY)) * (plotW - 12));
  const stacked = new Map();
  const marks = [];
  for (let yr = Math.ceil(minY / 25) * 25; yr <= maxY; yr += 25) marks.push({ year: yr, x: tx(yr) });
  const history = {
    y0: hy0,
    axisY: hy0 + s.historyH - 20,
    minYear: minY,
    maxYear: maxY,
    marks,
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
