// The repository's companion dossiers, as pages. Each `year` must appear in its source file
// (test/data.test.js checks it), and `marks` says what the year marks in that source.
import { readFileSync } from 'node:fs';
import path from 'node:path';

export const DOSSIERS = [
  { slug: 'bell-system', file: 'BellSystem.json', title: 'Bell System', short: 'Bell System', era: 'Wires', year: 1877, marks: 'founded', dek: 'The telephone monopoly whose wires, labs and long lines the internet later ran over.' },
  { slug: 'att', file: 'ATNT.json', title: 'AT&T', era: 'Wires', year: 1885, marks: 'incorporated, 3 March 1885', dek: 'Long Lines, transatlantic cables, cable ships and the 1984 break-up.' },
  { slug: 'packet-switching', file: 'PacketSwitching.json', title: 'Packet switching', era: 'Packets', year: 1965, marks: 'development dated “1965 onward”', dek: 'The idea that made the internet: chop messages into packets and route each one separately.' },
  { slug: 'arpanet', file: 'ARPANET.json', title: 'ARPANET', short: 'ARPANET', era: 'Packets', year: 1969, marks: 'established', dek: 'The first wide-area packet-switched network; its first message, “lo”, crashed the receiver.' },
  { slug: 'imp', file: 'IMP.json', title: 'Interface Message Processor', era: 'Packets', year: 1969, marks: 'introduced', dek: 'BBN’s store-and-forward box: the first generation of what we now call routers.' },
  { slug: 'prnet', file: 'PRNET.json', title: 'Packet Radio Network', era: 'Packets', year: 1973, marks: 'project start', dek: 'Packet switching over radio: the ancestor of every mobile data network.' },
  { slug: 'packet-radio-van', file: 'PacketRadioVan.json', title: 'Packet Radio Van', era: 'Internetworking', year: 1977, marks: 'three-network demonstration, 22 November 1977', dek: 'A bread truck full of radios that took part in the first transmission across three networks.' },
  { slug: 'satnet', file: 'SATNET.json', title: 'SATNET', era: 'Internetworking', year: 1977, marks: 'three-network demonstration, 22 November 1977', dek: 'The Atlantic packet-satellite network that carried that demonstration across the ocean.' },
  { slug: 'dns', file: 'DNS.json', title: 'Domain Name System', era: 'Internetworking', year: 1983, marks: 'introduced, November 1983', dek: 'The distributed directory that turns names into numbers.' },
  { slug: 'rboc', file: 'RBOC.json', title: 'Regional Bell Operating Companies', era: 'Break-up', year: 1984, marks: 'Bell System divestiture effective 1 January 1984', dek: 'The seven “Baby Bells” created when AT&T was broken up.' },
  { slug: 'verizon', file: 'Verizon.json', title: 'Verizon', era: 'Break-up', year: 2000, marks: 'the Verizon name begins', dek: 'A Baby Bell lineage, Bell Atlantic, NYNEX and GTE, reassembled into one carrier.' },
];

export const EXPLAINER = { slug: 'how-it-works', file: 'HowTheInternetWorks.json', title: 'How the internet works' };

export const DOSSIER_BY_SLUG = Object.fromEntries(DOSSIERS.map(d => [d.slug, d]));

export function loadDossierSource(file) {
  return JSON.parse(readFileSync(path.join(process.cwd(), 'data', file), 'utf8'));
}

// Unwrap single-key roots such as { "ARPANET": { ... } }.
export function loadDossier(file) {
  const json = loadDossierSource(file);
  const keys = Object.keys(json);
  return keys.length === 1 && isObject(json[keys[0]]) ? json[keys[0]] : json;
}

// Keys that describe how the record was assembled rather than the subject.
const PROVENANCE = /^(source|sources|source_.*|.*_source|.*_sources|.*citation.*|record_metadata|metadata|.*_line_span|.*_line_count)$/i;

export function isProvenanceKey(key) {
  return PROVENANCE.test(key);
}

// Generated-citation artefacts left in some source strings.
export function cleanText(value) {
  return String(value)
    .replace(/:?chatgpt-content-reference\{[^}]*\}/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function humanize(key) {
  const text = String(key)
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (/^\d{4}/.test(text)) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function isScalar(value) {
  return value === null || ['string', 'number', 'boolean'].includes(typeof value);
}

export function anchorId(key) {
  return String(key).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// A dossier's sections, minus provenance and empty strings once citations are removed.
export function sectionsOf(record) {
  return Object.entries(record).filter(([key, value]) => !isProvenanceKey(key) && !(typeof value === 'string' && !cleanText(value)));
}
