import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('Next app uses a bundled client map and local network data', async () => {
  const [page, layout, app, physics, packageText] = await Promise.all([
    readFile(new URL('../src/Atlas.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../app/layout.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../js/app.js', import.meta.url), 'utf8'),
    readFile(new URL('../js/physics.js', import.meta.url), 'utf8'),
    readFile(new URL('../package.json', import.meta.url), 'utf8'),
  ]);
  const packageData = JSON.parse(packageText);
  assert.match(page, /useEffect/);
  assert.match(page, /import\('\.\.\/js\/app\.js'\)/);
  assert.match(layout, /globals\.css/);
  assert.match(app, /fetch\("\/data\/internet\.json"/);
  assert.match(app, /NETWORK DATA UNAVAILABLE/);
  assert.match(physics, /forceManyBody/);
  assert.equal(packageData.dependencies.next, '16.3.8');
  assert.equal(packageData.dependencies.d3, '^7.9.0');
});
