// Build-time model of data/internet.json. Imported only by server components and tests,
// so none of this (or the 160 KB source file) is shipped to the browser.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { STRATA, stratumFor } from './strata.js';

const SOURCE = path.join(process.cwd(), 'data', 'internet.json');

// A packet-and-supply chain through recorded connections that touches all seven strata.
// test/data.test.js asserts every consecutive pair is a link in the data.
export const ROUTE_IDS = ['comcast', 'equinix', 'grace_hopper', 'google', 'verisign', 'icann'];
export const ROUTE_BRANCH_IDS = ['google', 'nvidia', 'tsmc'];

// Connection ids in the source that are spellings of an existing node id. Spellings that
// differ only in punctuation or accents (de-cix / decix) resolve automatically; these are
// the ones that need a human decision. Category words such as "fiber" or "routing" are
// deliberately left unresolved: they name a kind of thing, not an organisation.
export const ALIASES = {
  equnix: 'equinix',
  microsoft: 'azure',
  microsoft_azure: 'azure',
  google_cloud: 'google',
  'nic-cz': 'cznic',
  colt_technology_services: 'colt',
};

const fold = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');

let cache;

export function loadAtlas() {
  if (cache) return cache;
  const raw = JSON.parse(readFileSync(SOURCE, 'utf8'));
  cache = buildAtlas(raw);
  return cache;
}

export function buildAtlas(raw) {
  // 1. Merge records that share an id: the record with the higher importance leads,
  //    connections and classifications are unioned.
  const byId = new Map();
  const duplicates = [];
  for (const record of raw.nodes) {
    if (!record?.id) continue;
    const existing = byId.get(record.id);
    if (!existing) {
      byId.set(record.id, { ...record, classification: [...(record.classification || [])], connections: [...(record.connections || [])], records: 1 });
      continue;
    }
    duplicates.push(record.id);
    const lead = (Number(record.importance) || 0) > (Number(existing.importance) || 0) ? record : existing;
    byId.set(record.id, {
      ...existing,
      ...pick(lead, ['name', 'type', 'layer', 'region', 'network_role', 'importance', 'description']),
      classification: unique([...existing.classification, ...(record.classification || [])]),
      connections: unique([...existing.connections, ...(record.connections || [])]),
      records: existing.records + 1,
    });
  }

  // 2. Links (undirected, de-duplicated) and the references that resolve to nothing.
  const folded = new Map([...byId.keys()].map(id => [fold(id), id]));
  const resolve = ref => (byId.has(ref) ? ref : ALIASES[ref] || folded.get(fold(ref)) || null);
  const repaired = [];
  const links = [];
  const seen = new Set();
  const unresolved = [];
  for (const node of byId.values()) {
    for (const ref of node.connections) {
      const written = typeof ref === 'string' ? ref : ref?.target || ref?.id;
      if (!written) continue;
      const target = resolve(written);
      if (!target) { unresolved.push({ from: node.id, target: written }); continue; }
      if (target === node.id) continue;
      if (target !== written) repaired.push({ from: node.id, written, target });
      const key = [node.id, target].sort().join('|');
      if (seen.has(key)) continue;
      seen.add(key);
      links.push({ source: node.id, target });
    }
  }

  const neighbours = new Map([...byId.keys()].map(id => [id, new Set()]));
  for (const { source, target } of links) { neighbours.get(source).add(target); neighbours.get(target).add(source); }

  const nodes = [...byId.values()].map(node => ({
    id: node.id,
    name: node.name,
    type: node.type,
    layer: node.layer,
    region: node.region,
    classification: node.classification,
    role: node.network_role,
    description: node.description,
    importance: Number(node.importance) || 5,
    stratum: stratumFor(node),
    records: node.records,
    degree: neighbours.get(node.id).size,
  }));
  nodes.sort((a, b) => b.importance - a.importance || b.degree - a.degree || a.name.localeCompare(b.name));
  const nodeById = new Map(nodes.map(n => [n.id, n]));

  const strata = STRATA.map(s => {
    const members = nodes.filter(n => n.stratum === s.id);
    return { ...s, count: members.length, members: members.map(n => n.id) };
  });

  // Links between each pair of strata (including within one stratum).
  const crossings = {};
  for (const { source, target } of links) {
    const a = nodeById.get(source).stratum;
    const b = nodeById.get(target).stratum;
    const key = [a, b].sort().join('|');
    crossings[key] = (crossings[key] || 0) + 1;
  }

  const unresolvedByTarget = groupCount(unresolved.map(u => u.target));

  return {
    nodes,
    nodeById,
    links,
    neighbours,
    strata,
    crossings,
    unresolved,
    unresolvedByTarget,
    repaired,
    duplicates: unique(duplicates),
    sourceRecords: raw.nodes.length,
    layerCount: new Set(nodes.map(n => n.layer)).size,
    isolated: nodes.filter(n => n.degree === 0).length,
  };
}

export function routeOf(atlas, ids) {
  return ids.map(id => atlas.nodeById.get(id));
}

export function isLinked(atlas, a, b) {
  return atlas.neighbours.get(a)?.has(b) || false;
}

function pick(object, keys) {
  return Object.fromEntries(keys.filter(k => object[k] !== undefined).map(k => [k, object[k]]));
}

function unique(list) {
  return [...new Set(list)];
}

function groupCount(list) {
  const counts = new Map();
  for (const item of list) counts.set(item, (counts.get(item) || 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}
