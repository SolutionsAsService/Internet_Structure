import { cp, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'data');
const destination = path.join(root, 'public', 'data');

await mkdir(destination, { recursive: true });
const files = (await readdir(source, { withFileTypes: true }))
  .filter(entry => entry.isFile() && entry.name.toLowerCase().endsWith('.json'));

for (const file of files) {
  await cp(path.join(source, file.name), path.join(destination, file.name));
}

console.log(`Copied ${files.length} source datasets into public/data.`);
