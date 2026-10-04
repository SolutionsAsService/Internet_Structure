import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(await readFile(path.join(root, 'data', 'internet.json'), 'utf8'));
const ids = new Set(data.nodes.map(node => node.id));
const missingReferences = [];

for (const node of data.nodes) {
  for (const connection of node.connections || []) {
    const target = typeof connection === 'string' ? connection : connection?.target || connection?.id;
    if (target && !ids.has(target)) missingReferences.push({ node: node.id, target });
  }
}

console.log(`Indexed ${data.nodes.length} nodes; ${missingReferences.length} connection references do not resolve.`);
if (missingReferences.length) {
  console.table(missingReferences.slice(0, 25));
  process.exitCode = 1;
} else {
  console.log('Internet dataset connections are valid.');
}
