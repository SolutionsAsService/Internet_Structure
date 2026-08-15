// ============================================
// PHYSICS ENGINE
// Internet Infrastructure Map
// D3 Force Simulation
// ============================================

function createPhysics({ nodes, links, width, height }) {
  const centerX = width / 2;
  const centerY = height / 2;
  const graphSize = Math.min(width, height);

  function nodeRadius(d) {
    const importance = Number(d.importance) || 5;
    return Math.max(7, Math.min(28, 7 + importance * 1.8));
  }

  const padding = Math.max(80, graphSize * 0.08);
  const usableWidth = Math.max(200, width - padding * 2);
  const usableHeight = Math.max(200, height - padding * 2);

  function seeded(index) {
    const value = Math.sin(index * 12.9898) * 43758.5453;
    return value - Math.floor(value);
  }

  nodes.forEach((node, i) => {
    const horizontal = seeded(i + 17);
    const vertical = seeded(i + 91);
    const jitterX = (seeded(i + 151) - 0.5) * 80;
    const jitterY = (seeded(i + 231) - 0.5) * 80;

    node.x = padding + horizontal * usableWidth + jitterX;
    node.y = padding + vertical * usableHeight + jitterY;

    node.x = Math.max(padding, Math.min(width - padding, node.x));
    node.y = Math.max(padding, Math.min(height - padding, node.y));

    node.vx = 0;
    node.vy = 0;
    node.fx = null;
    node.fy = null;
  });

  const simulation = d3.forceSimulation(nodes);

  simulation.force(
    "link",
    d3.forceLink(links)
      .id(d => d.id)
      .distance(link => {
        if (typeof link.distance === "number") return link.distance;
        const sourceImportance = Number(link.source?.importance) || 5;
        const targetImportance = Number(link.target?.importance) || 5;
        const importance = (sourceImportance + targetImportance) / 2;
        return Math.max(100, Math.min(220, 160 + importance * 3.2));
      })
      .strength(link => {
        if (typeof link.strength === "number") return link.strength;
        return 0.9;
      })
      .iterations(3)
  );

  simulation.force(
    "charge",
    d3.forceManyBody()
      .strength(d => {
        const importance = Number(d.importance) || 5;
        return -360 - importance * 22;
      })
      .distanceMin(28)
      .distanceMax(Math.max(650, graphSize * 1.25))
      .theta(0.82)
  );

  simulation.force(
    "collision",
    d3.forceCollide()
      .radius(d => nodeRadius(d) + 20)
      .strength(0.82)
      .iterations(4)
  );

  simulation.force("x", d3.forceX(centerX).strength(0.0025));
  simulation.force("y", d3.forceY(centerY).strength(0.0025));

  function boundaryForce() {
    const margin = 40;
    const strength = 0.018;

    for (const node of nodes) {
      if (node.fx != null) continue;
      if (node.x < margin) node.vx += (margin - node.x) * strength;
      else if (node.x > width - margin) node.vx += (width - margin - node.x) * strength;
      if (node.y < margin) node.vy += (margin - node.y) * strength;
      else if (node.y > height - margin) node.vy += (height - margin - node.y) * strength;
    }
  }

  simulation.force("boundary", boundaryForce);

  simulation.alpha(1).alphaDecay(0.012).velocityDecay(0.64);

  nodes.forEach((node, i) => {
    const angle = seeded(i + 500) * Math.PI * 2;
    const velocity = 0.3 + seeded(i + 700) * 0.55;
    node.vx = Math.cos(angle) * velocity;
    node.vy = Math.sin(angle) * velocity;
  });

  return { simulation, centerX, centerY };
}

function createDragBehavior(simulation) {
  return d3.drag()
    .on("start", function(event, d) {
      if (!event.active) simulation.alphaTarget(0.22).restart();
      d.fx = d.x;
      d.fy = d.y;
      d.__dragVx = d.vx || 0;
      d.__dragVy = d.vy || 0;
    })
    .on("drag", function(event, d) {
      d.fx = event.x;
      d.fy = event.y;
      d.vx *= 0.35;
      d.vy *= 0.35;
    })
    .on("end", function(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
      d.vx = Math.max(-2, Math.min(2, d.vx || d.__dragVx || 0));
      d.vy = Math.max(-2, Math.min(2, d.vy || d.__dragVy || 0));
      delete d.__dragVx;
      delete d.__dragVy;
      simulation.alpha(0.14).restart();
    });
}

export { createPhysics, createDragBehavior };
