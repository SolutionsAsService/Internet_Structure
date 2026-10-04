import assert from 'node:assert/strict';
import test from 'node:test';
import { createPhysics } from '../js/physics.js';

test('force layout keeps a connected single-layer graph broadly distributed', () => {
  const nodes = Array.from({ length: 64 }, (_, index) => ({
    id: `node-${String(index).padStart(3, '0')}`,
    layer: 'fiber',
    importance: 5,
  }));
  const links = nodes.slice(1).map((node, index) => ({ source: nodes[index].id, target: node.id }));
  const { simulation } = createPhysics({ nodes, links, width: 1600, height: 1000 });

  simulation.stop();
  const start = nodes.map(node => ({ x: node.x, y: node.y }));
  simulation.tick(180);

  const xRange = Math.max(...nodes.map(node => node.x)) - Math.min(...nodes.map(node => node.x));
  const yRange = Math.max(...nodes.map(node => node.y)) - Math.min(...nodes.map(node => node.y));
  const movement = nodes.reduce((total, node, index) => total + Math.hypot(node.x - start[index].x, node.y - start[index].y), 0) / nodes.length;
  assert(xRange > 900, `expected broad horizontal spread, got ${xRange.toFixed(1)}px`);
  assert(yRange > 500, `expected broad vertical spread, got ${yRange.toFixed(1)}px`);
  assert(movement > 3, `expected links and forces to animate nodes, got ${movement.toFixed(1)}px average movement`);
  assert(nodes.every(node => Number.isFinite(node.x) && Number.isFinite(node.y)));
});

test('collision force prevents coincident nodes while allowing connected movement', () => {
  const nodes = Array.from({ length: 32 }, (_, index) => ({
    id: `node-${String(index).padStart(3, '0')}`,
    layer: index % 2 ? 'carrier' : 'cloud',
    importance: 6,
  }));
  const links = nodes.slice(1).map((node, index) => ({ source: nodes[index].id, target: node.id }));
  const { simulation } = createPhysics({ nodes, links, width: 1400, height: 900 });

  simulation.stop();
  simulation.tick(220);

  let closest = Infinity;
  for (let left = 0; left < nodes.length; left += 1) {
    for (let right = left + 1; right < nodes.length; right += 1) {
      closest = Math.min(closest, Math.hypot(nodes[left].x - nodes[right].x, nodes[left].y - nodes[right].y));
    }
  }
  assert(closest > 18, `unexpected node overlap at ${closest.toFixed(1)}px`);
});
