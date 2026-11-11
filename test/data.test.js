import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { ALIASES, loadAtlas, isLinked, ROUTE_IDS, ROUTE_BRANCH_IDS } from '../lib/data.js';
import { STRATA, stratumFor } from '../lib/strata.js';
import { DOSSIERS, EXPLAINER, cleanText, loadDossier } from '../lib/dossiers.js';
import { figureGeometry } from '../lib/figure.js';
import { atlasLayout } from '../lib/layout.js';

const atlas = loadAtlas();

test('every JSON file in data/ parses', () => {
  for (const file of readdirSync('data').filter(f => f.endsWith('.json'))) {
    assert.doesNotThrow(() => JSON.parse(readFileSync(path.join('data', file), 'utf8')), file);
  }
});

test('every node lands in exactly one stratum', () => {
  const unmapped = atlas.nodes.filter(n => !n.stratum).map(n => `${n.id} (${n.layer})`);
  assert.deepEqual(unmapped, []);
  const total = atlas.strata.reduce((sum, s) => sum + s.count, 0);
  assert.equal(total, atlas.nodes.length);
  const layers = STRATA.flatMap(s => s.layers);
  assert.equal(new Set(layers).size, layers.length, 'a layer tag is mapped to two strata');
});

test('duplicate ids are merged, not dropped', () => {
  const raw = JSON.parse(readFileSync('data/internet.json', 'utf8'));
  assert.equal(atlas.sourceRecords, raw.nodes.length);
  assert.equal(atlas.nodes.length, new Set(raw.nodes.map(n => n.id)).size);
  assert.equal(atlas.nodes.length + atlas.duplicates.length, raw.nodes.length);
});

test('links are undirected, unique and resolve', () => {
  const keys = atlas.links.map(l => [l.source, l.target].sort().join('|'));
  assert.equal(new Set(keys).size, keys.length);
  for (const l of atlas.links) assert.ok(atlas.nodeById.has(l.source) && atlas.nodeById.has(l.target));
  for (const target of Object.values(ALIASES)) assert.ok(atlas.nodeById.has(target), `alias target ${target}`);
});

test('the red line is made only of recorded connections and touches all seven strata', () => {
  for (const chain of [ROUTE_IDS, ROUTE_BRANCH_IDS]) {
    for (let i = 1; i < chain.length; i++) assert.ok(isLinked(atlas, chain[i - 1], chain[i]), `${chain[i - 1]} -> ${chain[i]}`);
  }
  const touched = new Set([...ROUTE_IDS, ...ROUTE_BRANCH_IDS].map(id => atlas.nodeById.get(id).stratum));
  assert.equal(touched.size, STRATA.length);
});

test('type override moves DNS and registry operators to Name', () => {
  assert.equal(stratumFor({ type: 'DNS Platform', layer: 'cloud' }), 'name');
  assert.equal(stratumFor({ type: 'Global CDN', layer: 'cloud' }), 'serve');
});

test('each dossier year appears in its source file', () => {
  for (const d of DOSSIERS) {
    const text = readFileSync(path.join('data', d.file), 'utf8');
    assert.ok(text.includes(String(d.year)), `${d.slug}: ${d.year}`);
    assert.ok(Object.keys(loadDossier(d.file)).length > 0);
  }
  assert.ok(loadDossier(EXPLAINER.file).executive_model);
});

test('citation artefacts are stripped from displayed text', () => {
  assert.equal(cleanText('BBN built it. :chatgpt-content-reference{index="1"}'), 'BBN built it.');
});

test('landing figure: one dot per organisation, all inside the drawing', () => {
  for (const size of ['wide', 'narrow']) {
    const g = figureGeometry(atlas, size);
    const dots = g.bands.flatMap(b => b.dots);
    assert.equal(dots.length, atlas.nodes.length, size);
    assert.equal(new Set(dots.map(d => d.id)).size, dots.length);
    for (const d of dots) {
      assert.ok(d.x - d.r >= g.plotX - 1 && d.x + d.r <= g.size.width, `${size} ${d.id} x`);
      const band = g.bands.find(b => b.dots.includes(d));
      assert.ok(d.y - d.r >= band.y0 && d.y + d.r <= band.y0 + g.size.bandH, `${size} ${d.id} y`);
    }
  }
});

test('atlas layout keeps every organisation inside its stratum band', () => {
  const layout = atlasLayout(atlas);
  const band = Object.fromEntries(layout.bands.map(b => [b.id, b]));
  for (const p of layout.nodes) {
    const b = band[atlas.nodeById.get(p.id).stratum];
    assert.ok(p.y >= b.y0 && p.y <= b.y1, p.id);
    assert.ok(p.x >= 0 && p.x <= layout.width, p.id);
  }
  // Deterministic: the same build gives the same picture.
  assert.deepEqual(atlasLayout(atlas).nodes, layout.nodes);
});
