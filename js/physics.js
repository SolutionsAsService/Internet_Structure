import * as d3 from 'd3';

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

function nodeRadius(node) {
  const importance = Number(node.importance) || 5;
  return Math.max(8, Math.min(24, 7 + importance * 1.25));
}

function createPhysics({ nodes, links, width, height }) {
  const centerX = width / 2;
  const centerY = height / 2;
  const horizontalRadius = width * 0.44;
  const verticalRadius = height * 0.43;
  const orderedNodes = [...nodes].sort((left, right) => String(left.id).localeCompare(String(right.id), 'en'));

  orderedNodes.forEach((node, index) => {
    const progress = Math.sqrt((index + 0.5) / Math.max(1, orderedNodes.length));
    const angle = index * GOLDEN_ANGLE;
    node.x = centerX + Math.cos(angle) * horizontalRadius * progress;
    node.y = centerY + Math.sin(angle) * verticalRadius * progress;
    node.homeX = node.x;
    node.homeY = node.y;
    node.vx = 0;
    node.vy = 0;
    node.fx = null;
    node.fy = null;
  });

  const linkForce = d3.forceLink(links)
    .id(node => node.id)
    .distance(link => {
      const sourceImportance = Number(link.source?.importance) || 5;
      const targetImportance = Number(link.target?.importance) || 5;
      return Math.max(150, Math.min(255, 158 + (sourceImportance + targetImportance) * 3.5));
    })
    .strength(link => {
      if (typeof link.strength === 'number') return link.strength;
      const sourceImportance = Number(link.source?.importance) || 5;
      const targetImportance = Number(link.target?.importance) || 5;
      return Math.max(0.18, Math.min(0.34, 0.28 - ((sourceImportance + targetImportance) / 2) * 0.006));
    })
    .iterations(1);

  const simulation = d3.forceSimulation(nodes)
    .force('link', linkForce)
    .force('charge', d3.forceManyBody()
      .strength(node => -520 - (Number(node.importance) || 5) * 24)
      .distanceMin(30)
      .distanceMax(Math.max(width, height) * 0.95)
      .theta(0.8))
    .force('collision', d3.forceCollide()
      .radius(node => nodeRadius(node) + 13)
      .strength(0.92)
      .iterations(3))
    .force('home-x', d3.forceX(node => node.homeX).strength(0.012))
    .force('home-y', d3.forceY(node => node.homeY).strength(0.012))
    .alpha(1)
    .alphaDecay(0.018)
    .velocityDecay(0.43);

  return { simulation, centerX, centerY };
}

function createDragBehavior(simulation) {
  return d3.drag()
    .on('start', function(event, node) {
      if (!event.active) simulation.alphaTarget(0.2).restart();
      node.fx = node.x;
      node.fy = node.y;
      node.__dragVx = node.vx || 0;
      node.__dragVy = node.vy || 0;
    })
    .on('drag', function(event, node) {
      node.fx = event.x;
      node.fy = event.y;
      node.vx *= 0.25;
      node.vy *= 0.25;
    })
    .on('end', function(event, node) {
      if (!event.active) simulation.alphaTarget(0);
      node.homeX = event.x;
      node.homeY = event.y;
      node.fx = null;
      node.fy = null;
      node.vx = Math.max(-2.5, Math.min(2.5, (node.vx || node.__dragVx || 0) * 0.85));
      node.vy = Math.max(-2.5, Math.min(2.5, (node.vy || node.__dragVy || 0) * 0.85));
      delete node.__dragVx;
      delete node.__dragVy;
      simulation.alpha(0.26).restart();
    });
}

export { createPhysics, createDragBehavior };
