/*
============================================================
INTERNET INFRASTRUCTURE MAP
app.js
============================================================
*/

import { createPhysics, createDragBehavior } from "./physics.js";
import { COLORS, colorForType } from "./colors.js";

const normalizedColorLookup = buildNormalizedColorLookup();

const mapState = {
  data: null,
  nodes: [],
  links: [],
  nodeMap: new Map(),
  svg: null,
  viewport: null,
  linkLayer: null,
  nodeLayer: null,
  labelLayer: null,
  linkElements: null,
  nodeElements: null,
  labelElements: null,
  zoom: null,
  simulation: null,
  width: 0,
  height: 0,
  isInitializing: false,
  hasInitialized: false
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startApplication, { once: true });
} else {
  startApplication();
}

function startApplication() {
  if (mapState.isInitializing || mapState.hasInitialized) return;
  mapState.isInitializing = true;
  initializeMap().finally(() => {
    mapState.isInitializing = false;
  });
}

async function initializeMap() {
  try {
    const network = document.querySelector("#network");
    if (!network) throw new Error("Map container #network was not found.");

    const response = await fetch("data/internet.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`internet.json failed loading (${response.status})`);

    const data = await response.json();
    if (!data || typeof data !== "object") throw new Error("internet.json did not contain a valid JSON object.");
    if (!Array.isArray(data.nodes)) throw new Error("internet.json is missing the nodes array.");

    mapState.data = data;
    mapState.nodes = data.nodes;
    mapState.width = Math.max(1200, network.clientWidth || 0);
    mapState.height = Math.max(800, network.clientHeight || 0);

    buildNodeMap();
    buildLinks();
    createSVG(network);
    renderLinks();
    renderNodes();
    renderLabels();
    setupZoom();
    setupSearch();
    setupGlobalFunctions();
    initializePhysics();
    updateStatistics();
    resetView();
    mapState.hasInitialized = true;
  } catch (error) {
    handleMapError(error);
  }
}

function buildNodeMap() {
  mapState.nodeMap = new Map();
  mapState.nodes.forEach(node => {
    if (!node || !node.id || mapState.nodeMap.has(node.id)) return;
    mapState.nodeMap.set(node.id, node);
  });
}

function buildLinks() {
  const links = [];
  const duplicateCheck = new Set();
  mapState.nodes.forEach(node => {
    if (!node?.id || !Array.isArray(node.connections)) return;
    node.connections.forEach(connectionId => {
      if (!connectionId || !mapState.nodeMap.has(connectionId) || node.id === connectionId) return;
      const key = [node.id, connectionId].sort().join("::");
      if (duplicateCheck.has(key)) return;
      duplicateCheck.add(key);
      links.push({ source: node.id, target: connectionId });
    });
  });
  mapState.links = links;
}

function createSVG(network) {
  d3.select(network).selectAll("svg").remove();
  mapState.svg = d3.select(network).append("svg").attr("width", "100%").attr("height", "100%").attr("viewBox", `0 0 ${mapState.width} ${mapState.height}`);
  mapState.viewport = mapState.svg.append("g").attr("class", "viewport");
  mapState.linkLayer = mapState.viewport.append("g").attr("class", "links");
  mapState.nodeLayer = mapState.viewport.append("g").attr("class", "nodes");
  mapState.labelLayer = mapState.viewport.append("g").attr("class", "labels");
}

function renderLinks() {
  mapState.linkElements = mapState.linkLayer.selectAll("line").data(mapState.links, d => `${d.source}::${d.target}`).enter().append("line").attr("class", "network-link").attr("stroke", linkColor).attr("stroke-width", 1.35).attr("opacity", 0.62).attr("stroke-linecap", "round");
}

function renderNodes() {
  mapState.nodeElements = mapState.nodeLayer.selectAll("circle").data(mapState.nodes, d => d.id).enter().append("circle").attr("class", "network-node").attr("r", getNodeRadius).attr("fill", resolveNodeColor).attr("stroke", getNodeStrokeColor()).attr("stroke-width", 1.5).style("cursor", "pointer");
  mapState.nodeElements.on("mouseenter", function() { d3.select(this).attr("stroke", getNodeHoverStrokeColor()).attr("stroke-width", 3); }).on("mouseleave", function() { d3.select(this).attr("stroke", getNodeStrokeColor()).attr("stroke-width", 1.5); }).on("click", function(event, node) { showDetails(event, node); });
}

function getNodeRadius(node) {
  const importance = Number(node.importance) || 5;
  return Math.max(9, Math.min(28, 8 + importance * 2));
}

function resolveNodeColor(node) {
  const type = String(node?.type || node?.layer || "physical").toLowerCase();
  const category = normalizeCategory(type, node?.layer);
  return categoryColor(category) || colorForType(type) || COLORS.default;
}

function categoryColor(category) {
  const map = {
    physical: COLORS.physical.default,
    submarine: COLORS.submarine.default,
    network: COLORS.network,
    backbone: COLORS.backbone.default,
    isp: COLORS.isp.default,
    carrier: COLORS.isp.carrier,
    telecom: COLORS.isp.telecom,
    ixp: COLORS.ixp.default,
    cloud: COLORS.cloud.default,
    cdn: COLORS.cdn.default,
    dns: COLORS.dns.default,
    bgp: COLORS.bgp.default,
    satellite: COLORS.satellite.default,
    cellular: COLORS.cellular.default,
    compute: COLORS.compute.default,
    semiconductor: COLORS.semiconductor.default,
    optical: COLORS.optical.default,
    security: COLORS.security.default,
    blockchain: COLORS.blockchain.default,
    mesh: COLORS.mesh.default,
    endpoint: COLORS.endpoint.default,
    organization: COLORS.organization.default
  };
  return map[category] || null;
}

function normalizeCategory(type, layer) {
  const value = String(type || layer || "").toLowerCase().replace(/[\s_-]+/g, "");
  const groups = {
    physical: ["physical", "building", "datacenter", "tower"],
    submarine: ["submarine", "submarinecable", "landingstation", "landingpoint"],
    network: ["network"],
    backbone: ["backbone", "terrestrial", "transit"],
    isp: ["isp", "carrier", "telecom", "mobile", "wireless"],
    ixp: ["ixp", "exchange", "peering"],
    cloud: ["cloud", "datacentercloud", "publiccloud", "privatecloud", "hybridcloud"],
    cdn: ["cdn", "edge", "pop"],
    dns: ["dns", "resolver", "geodns", "authoritative", "recursive", "nameserver"],
    bgp: ["bgp", "routing", "route", "anycast"],
    satellite: ["satellite", "groundstation", "uplink", "downlink", "orbit"],
    cellular: ["cellular", "tower", "cellsite", "fiveg", "fourg", "threeg"],
    compute: ["compute", "server", "rack", "cluster", "container", "virtualmachine", "baremetal"],
    semiconductor: ["semiconductor", "fab", "packaging", "chip"],
    optical: ["optical", "fiber", "photonics", "transceiver", "dwdm"],
    security: ["security", "firewall", "waf", "ddos"],
    blockchain: ["blockchain", "validator", "consensus", "smartcontract"],
    mesh: ["mesh", "router", "gateway"],
    endpoint: ["endpoint", "device", "iot", "sensor"],
    organization: ["organization", "enterprise", "provider", "operator", "manufacturer", "hyperscaler"]
  };
  for (const [cat, values] of Object.entries(groups)) if (values.some(v => value.includes(v))) return cat;
  return value || "physical";
}

function getNodeStrokeColor() { return COLORS.effects.selection; }
function getNodeHoverStrokeColor() { return COLORS.effects.hover || COLORS.effects.selection; }
function getLabelColor() { return COLORS.text; }
function linkColor(link) { return COLORS.links[normalizeCategory(link?.source?.layer || link?.target?.layer || link?.source?.type || link?.target?.type || "default")] || COLORS.links.default; }

function resolveColorToken(token) {
  if (!token || typeof token !== "string") return null;
  if (typeof COLORS[token] === "string") return COLORS[token];
  return normalizedColorLookup.get(token.toLowerCase().replace(/[\s_-]+/g, "")) || null;
}

function buildNormalizedColorLookup() {
  const lookup = new Map();
  const walk = (obj, prefix = "") => {
    Object.entries(obj).forEach(([key, value]) => {
      const next = prefix ? `${prefix}.${key}` : key;
      if (typeof value === "string") lookup.set(next.toLowerCase().replace(/[\s_-]+/g, ""), value);
      else if (value && typeof value === "object") walk(value, next);
    });
  };
  walk(COLORS);
  return lookup;
}

function renderLabels() {
  mapState.labelElements = mapState.labelLayer.selectAll("text").data(mapState.nodes, d => d.id).enter().append("text").text(d => d.name || d.id).attr("class", "network-label").attr("fill", getLabelColor()).attr("font-size", d => Number(d.importance) >= 9 ? "14px" : "11px").attr("font-family", "monospace").attr("text-anchor", "middle").style("pointer-events", "none");
}

function setupZoom() {
  mapState.zoom = d3.zoom().scaleExtent([0.12, 6]).on("zoom", event => { mapState.viewport.attr("transform", event.transform); });
  mapState.svg.call(mapState.zoom);
}

function initializePhysics() {
  try {
    const physics = createPhysics({ nodes: mapState.nodes, links: mapState.links, width: mapState.width, height: mapState.height });
    mapState.simulation = physics.simulation;
    mapState.simulation.on("tick", updateGraphPositions);
    mapState.nodeElements.call(createDragBehavior(mapState.simulation));
    updateGraphPositions();
  } catch (error) {
    console.error("Physics initialization failed:", error);
  }
}

function updateGraphPositions() {
  if (!mapState.nodeElements) return;
  if (mapState.linkElements) mapState.linkElements.attr("x1", d => getPosition(d.source, "x")).attr("y1", d => getPosition(d.source, "y")).attr("x2", d => getPosition(d.target, "x")).attr("y2", d => getPosition(d.target, "y"));
  mapState.nodeElements.attr("cx", d => Number.isFinite(d.x) ? d.x : mapState.width / 2).attr("cy", d => Number.isFinite(d.y) ? d.y : mapState.height / 2);
  if (mapState.labelElements) mapState.labelElements.attr("x", d => Number.isFinite(d.x) ? d.x : mapState.width / 2).attr("y", d => Number.isFinite(d.y) ? d.y - 32 : mapState.height / 2 - 32);
}

function getPosition(object, axis) { return object && Number.isFinite(object[axis]) ? object[axis] : axis === "x" ? mapState.width / 2 : mapState.height / 2; }

function setupSearch() {
  const searchBox = document.querySelector("#search");
  if (!searchBox) return;
  searchBox.addEventListener("input", () => {
    const value = searchBox.value.trim().toLowerCase();
    if (!value) return showAllNodes();
    mapState.nodeElements.attr("opacity", node => nodeMatchesSearch(node, value) ? 1 : 0.12);
    mapState.labelElements.attr("opacity", node => nodeMatchesSearch(node, value) ? 1 : 0.12);
    mapState.linkElements.attr("opacity", link => nodeMatchesSearch(getNodeFromLink(link.source), value) || nodeMatchesSearch(getNodeFromLink(link.target), value) ? 0.65 : 0.04);
  });
}

function nodeMatchesSearch(node, value) { if (!node) return false; return [node.name, node.id, node.type, node.layer].some(v => String(v || "").toLowerCase().includes(value)); }
function showAllNodes() { mapState.nodeElements.attr("opacity", 1); mapState.labelElements.attr("opacity", 1); mapState.linkElements.attr("opacity", 0.62); }
function setupGlobalFunctions() { window.resetView = resetView; window.filterLayer = filterLayer; }
function filterLayer(layer) { if (!layer || layer === "all") return showAllNodes(); const normalizedLayer = String(layer).trim().toLowerCase(); mapState.nodeElements.attr("opacity", node => String(node.layer || "").toLowerCase() === normalizedLayer ? 1 : 0.1); mapState.labelElements.attr("opacity", node => String(node.layer || "").toLowerCase() === normalizedLayer ? 1 : 0.1); mapState.linkElements.attr("opacity", link => { const source = getNodeFromLink(link.source); const target = getNodeFromLink(link.target); return [source?.layer, target?.layer].some(v => String(v || "").toLowerCase() === normalizedLayer) ? 0.75 : 0.04; }); }
function getNodeFromLink(value) { if (!value) return null; if (typeof value === "object" && value.id) return value; return mapState.nodeMap.get(value) || null; }
function showDetails(event, node) { const details = document.querySelector("#details"); if (!details || !node) return; const connectedNodes = getConnectedNodes(node); const connectionsHTML = connectedNodes.length ? connectedNodes.map(other => `<div class="connection"><strong>${escapeHTML(other.name || other.id)}</strong><span>${escapeHTML(other.layer || "unknown")}</span></div>`).join("") : `<div class="connection">No known connections</div>`; details.innerHTML = `<div class="node-details"><h2>${escapeHTML(node.name || node.id)}</h2><div><strong>Type</strong><br>${escapeHTML(node.type || "Unknown")}</div><div><strong>Layer</strong><br>${escapeHTML(node.layer || "Unknown")}</div><div><strong>Region</strong><br>${escapeHTML(node.region || "Global")}</div><div><strong>Importance</strong><br>${escapeHTML(String(node.importance ?? "Unknown"))}</div><div><strong>Network Role</strong><br>${escapeHTML(node.network_role || "")}</div><div><strong>Description</strong><br>${escapeHTML(node.description || "")}</div><div><strong>Connected Infrastructure</strong><div class="connections">${connectionsHTML}</div></div></div>`; }
function getConnectedNodes(node) { const results = []; const seen = new Set(); mapState.links.forEach(link => { const source = getNodeFromLink(link.source); const target = getNodeFromLink(link.target); const other = source?.id === node.id ? target : target?.id === node.id ? source : null; if (other && !seen.has(other.id)) { seen.add(other.id); results.push(other); } }); return results; }
function escapeHTML(value) { return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"); }
function resetView() { if (!mapState.svg || !mapState.zoom) return; mapState.svg.transition().duration(500).call(mapState.zoom.transform, d3.zoomIdentity); }
function updateStatistics() { const statsBox = document.querySelector("#stats"); if (!statsBox) return; const regions = new Set(mapState.nodes.map(node => node.region).filter(Boolean)); const critical = mapState.nodes.filter(node => Number(node.importance) >= 9).length; statsBox.innerHTML = `<div>NODES: ${mapState.nodes.length}</div><div>CONNECTIONS: ${mapState.links.length}</div><div>REGIONS: ${regions.size}</div><div>CRITICAL NODES: ${critical}</div>`; }
function handleMapError(error) { const details = document.querySelector("#details"); if (details) details.innerHTML = `<div class="system-error"><h2>SYSTEM FAILURE</h2><p>${escapeHTML(error.message || String(error))}</p></div>`; }
