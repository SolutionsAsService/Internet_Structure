// Atlas positions, computed once at build time with d3-force. Height on the page means
// stratum (each organisation is held inside its band); horizontal position is where its
// connections pull it. The browser receives finished coordinates and runs no simulation.
import { forceSimulation, forceLink, forceManyBody, forceX, forceY, forceCollide } from 'd3-force';

export const ATLAS_W = 1600;
const BAND_MIN = 80;
const BAND_PER_NODE = 1.7;
const LABEL_FS = 24; // label size in layout units at the default zoom on a desktop stage

export function atlasLayout(atlas) {
  // Band heights grow with membership so dense strata get room.
  let y = 0;
  const bands = atlas.strata.map(s => {
    const h = Math.round(BAND_MIN + s.count * BAND_PER_NODE);
    const band = { id: s.id, n: s.n, name: s.name, y0: y, y1: y + h, mid: y + h / 2 };
    y += h;
    return band;
  });
  const height = y;
  const bandOf = Object.fromEntries(bands.map(b => [b.id, b]));
  const radius = n => 4 + n.importance * 0.9;

  // Deterministic start: spread each band's members evenly along x.
  const nodes = atlas.nodes.map(n => ({ id: n.id, name: n.name, importance: n.importance, degree: n.degree, stratum: n.stratum, r: radius(n) }));
  const perBand = {};
  for (const n of nodes) (perBand[n.stratum] ||= []).push(n);
  // Home positions interleave by a hash of the id, so the big hubs do not all start on one side.
  const hash = id => [...id].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0, 2166136261);
  for (const [id, list] of Object.entries(perBand)) {
    list.sort((a, b) => hash(a.id) - hash(b.id));
    list.forEach((n, i) => {
      n.x = n.homeX = 160 + ((i + 0.5) / list.length) * (ATLAS_W - 180);
      n.y = bandOf[id].mid + ((i % 3) - 1) * 18;
    });
  }

  const links = atlas.links.map(l => ({ source: l.source, target: l.target }));
  const sim = forceSimulation(nodes)
    .randomSource(mulberry32(7))
    .force('link', forceLink(links).id(d => d.id).distance(60).strength(0.04))
    .force('charge', forceManyBody().strength(-60).distanceMax(320))
    .force('x', forceX(d => d.homeX).strength(0.06))
    .force('y', forceY(d => bandOf[d.stratum].mid).strength(0.35))
    .force('collide', forceCollide(d => d.r + 3).iterations(2))
    .stop();

  for (let i = 0; i < 420; i++) {
    sim.tick();
    for (const n of nodes) {
      const b = bandOf[n.stratum];
      n.y = Math.min(Math.max(n.y, b.y0 + n.r + 26), b.y1 - n.r - 6);
      n.x = Math.min(Math.max(n.x, n.r + 150), ATLAS_W - n.r - 10);
    }
  }

  // Label the most connected organisations whose labels fit without overlapping.
  const boxes = [];
  const labelled = new Set();
  const ranked = [...nodes].sort((a, b) => b.degree - a.degree || b.importance - a.importance);
  for (const n of ranked) {
    const w = n.name.length * LABEL_FS * 0.56;
    const box = { x0: n.x - w / 2 - 4, x1: n.x + w / 2 + 4, y0: n.y - n.r - 6 - LABEL_FS, y1: n.y - n.r - 2 };
    const hitsLabel = boxes.some(b => box.x0 < b.x1 && box.x1 > b.x0 && box.y0 < b.y1 && box.y1 > b.y0);
    const hitsDot = nodes.some(o => o !== n && o.x + o.r > box.x0 && o.x - o.r < box.x1 && o.y + o.r > box.y0 && o.y - o.r < box.y1);
    if (hitsLabel || hitsDot || box.x0 < 0 || box.x1 > ATLAS_W) continue;
    boxes.push(box);
    labelled.add(n.id);
    if (labelled.size >= 40) break;
  }

  return {
    width: ATLAS_W,
    labelled,
    height,
    bands,
    nodes: nodes.map(n => ({ id: n.id, x: Math.round(n.x), y: Math.round(n.y), r: Math.round(n.r * 10) / 10 })),
  };
}

function mulberry32(seed) {
  return function next() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
