// Reports the state of data/internet.json as the site sees it. Exits non-zero only for
// problems that break the build: a file that does not parse, or a layer with no stratum.
import { readdirSync, readFileSync } from 'node:fs';
import { loadAtlas } from '../lib/data.js';

let failed = false;
for (const file of readdirSync('data').filter(f => f.endsWith('.json'))) {
  try { JSON.parse(readFileSync(`data/${file}`, 'utf8')); } catch (error) { failed = true; console.error(`✗ data/${file}: ${error.message}`); }
}
const atlas = loadAtlas();
const unmapped = atlas.nodes.filter(n => !n.stratum);
if (unmapped.length) { failed = true; console.error('✗ layer tags with no stratum:', [...new Set(unmapped.map(n => n.layer))].join(', ')); }

console.log(`${atlas.sourceRecords} records → ${atlas.nodes.length} organisations (${atlas.duplicates.length} ids merged)`);
console.log(`${atlas.links.length} connections; ${atlas.repaired.length} references repaired; ${atlas.unresolved.length} unresolved`);
console.log('Most frequent unresolved references:');
console.table(atlas.unresolvedByTarget.slice(0, 15).map(([target, count]) => ({ target, count })));
process.exitCode = failed ? 1 : 0;
