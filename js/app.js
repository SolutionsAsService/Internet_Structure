/*
============================================================
INTERNET INFRASTRUCTURE MAP
app.js
============================================================
*/

import * as d3 from "d3";
import { createPhysics, createDragBehavior } from "./physics.js";
import { COLORS, colorForType } from "./colors.js";

const normalizedColorLookup = buildNormalizedColorLookup();

const mapState = {
  root: null,
  controller: null,
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
  selectedNodeId: null,
  hoveredNodeId: null,
  activeLayer: "all",
  searchTerm: "",
  missingConnectionCount: 0
};

export function mountAtlas(root) {
  if (!root) return () => {};
  mapState.root = root;
  mapState.controller = new AbortController();
  initializeMap().catch(error => handleMapError(error));
  return () => {
    mapState.controller?.abort();
    mapState.simulation?.stop();
    mapState.root?.querySelectorAll("svg").forEach(element => element.remove());
    mapState.root = null;
    mapState.simulation = null;
  };
}

async function initializeMap() {
  try {
    const network = mapState.root.querySelector("#network");
    if (!network) throw new Error("Map container #network was not found.");

    setStatus("LOADING DATA");
    const response = await fetch("/data/internet.json", { cache: "no-store", signal: mapState.controller.signal });
    if (!response.ok) throw new Error(`internet.json failed loading (${response.status})`);

    const data = await response.json();
    if (!data || typeof data !== "object") throw new Error("internet.json did not contain a valid JSON object.");
    if (!Array.isArray(data.nodes)) throw new Error("internet.json is missing the nodes array.");

    mapState.data = data;
    mapState.nodes = data.nodes;
    mapState.width = Math.max(1600, network.clientWidth || 0);
    mapState.height = Math.max(1000, network.clientHeight || 0);

    buildNodeMap();
    buildLinks();
    createSVG(network);
    renderLinks();
    renderNodes();
    renderLabels();
    setupZoom();
    setupSearch();
    setupControls();
    initializePhysics();
    updateStatistics();
    resetView();
    const loading = mapState.root.querySelector("#map-loading");
    if (loading) loading.hidden = true;
    setStatus("NETWORK READY", "ready");
  } catch (error) {
    if (error.name === "AbortError") return;
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
  mapState.missingConnectionCount = 0;
  mapState.nodes.forEach(node => {
    if (!node?.id || !Array.isArray(node.connections)) return;
    node.connections.forEach(connection => {
      const connectionId = typeof connection === "string" ? connection : connection?.target || connection?.id;
      if (!connectionId || node.id === connectionId) return;
      if (!mapState.nodeMap.has(connectionId)) {
        mapState.missingConnectionCount += 1;
        return;
      }
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
  mapState.nodeElements
    .on("mouseenter", function(event, node) {
      mapState.hoveredNodeId = node.id;
      d3.select(this).attr("stroke", getNodeHoverStrokeColor()).attr("stroke-width", 3);
      focusNode(node.id);
    })
    .on("mouseleave", function() {
      mapState.hoveredNodeId = null;
      d3.select(this).attr("stroke", getNodeStrokeColor()).attr("stroke-width", 1.5);
      if (mapState.selectedNodeId) focusNode(mapState.selectedNodeId);
      else showAllNodes();
    })
    .on("click", function(event, node) {
      event.stopPropagation();
      mapState.selectedNodeId = node.id;
      showDetails(node);
      focusNode(node.id);
    });
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
function linkColor(link) {
  const source = getNodeFromLink(link?.source);
  const target = getNodeFromLink(link?.target);
  return COLORS.links[normalizeCategory(source?.layer || target?.layer || source?.type || target?.type || "default")] || COLORS.links.default;
}

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
  mapState.labelElements = mapState.labelLayer.selectAll("text").data(mapState.nodes, d => d.id).enter().append("text").text(d => d.name || d.id).attr("class", "network-label").attr("fill", getLabelColor()).attr("font-size", d => Number(d.importance) >= 9 ? "12px" : "10px").attr("font-family", "sans-serif").attr("text-anchor", "middle").attr("opacity", d => Number(d.importance) >= 9 ? 0.85 : 0).style("pointer-events", "none");
}

function setupZoom() {
  mapState.zoom = d3.zoom().scaleExtent([0.18, 6]).on("zoom", event => {
    mapState.viewport.attr("transform", event.transform);
    mapState.zoomScale = event.transform.k;
    updateGraphEmphasis();
  });
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

function setupControls() {
  const signal = mapState.controller.signal;
  const searchBox = mapState.root.querySelector("#search");
  searchBox?.addEventListener("input", () => {
    mapState.searchTerm = searchBox.value.trim().toLowerCase();
    updateGraphEmphasis();
  }, { signal });

  mapState.root.querySelectorAll("[data-layer]").forEach(button => {
    button.setAttribute("aria-pressed", button.dataset.layer === "all" ? "true" : "false");
    button.addEventListener("click", () => {
      mapState.activeLayer = button.dataset.layer || "all";
      mapState.root.querySelectorAll("[data-layer]").forEach(item => {
        const selected = item.dataset.layer === mapState.activeLayer;
        item.classList.toggle("active", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      updateGraphEmphasis();
    }, { signal });
  });

  mapState.root.querySelector("#reset-view")?.addEventListener("click", resetView, { signal });
  mapState.root.addEventListener("keydown", event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      searchBox?.focus();
    }
  }, { signal });
}

function nodeMatchesSearch(node, value) {
  return !value || [node?.name, node?.id, node?.type, node?.layer].some(text => String(text || "").toLowerCase().includes(value));
}

function nodeMatchesLayer(node) {
  return mapState.activeLayer === "all" || String(node?.layer || "").toLowerCase() === mapState.activeLayer;
}

function getNodeFromLink(value) {
  if (!value) return null;
  if (typeof value === "object" && value.id) return value;
  return mapState.nodeMap.get(value) || null;
}

function getConnectedNodes(nodeOrId) {
  const nodeId = typeof nodeOrId === "string" ? nodeOrId : nodeOrId?.id;
  if (!nodeId) return [];
  const results = new Map();
  mapState.links.forEach(link => {
    const source = getNodeFromLink(link.source);
    const target = getNodeFromLink(link.target);
    const other = source?.id === nodeId ? target : target?.id === nodeId ? source : null;
    if (other) results.set(other.id, other);
  });
  return [...results.values()].sort((left, right) => (Number(right.importance) || 0) - (Number(left.importance) || 0));
}

function focusNode(nodeId) {
  mapState.hoveredNodeId = nodeId;
  updateGraphEmphasis();
}

function showAllNodes() {
  mapState.hoveredNodeId = null;
  updateGraphEmphasis();
}

function updateGraphEmphasis() {
  if (!mapState.nodeElements) return;
  const focusId = mapState.hoveredNodeId || mapState.selectedNodeId;
  const neighborIds = new Set(getConnectedNodes(focusId).map(node => node.id));
  const passes = node => nodeMatchesSearch(node, mapState.searchTerm) && nodeMatchesLayer(node);

  mapState.nodeElements.attr("opacity", node => {
    if (!passes(node)) return 0.055;
    if (focusId && node.id !== focusId && !neighborIds.has(node.id)) return 0.2;
    return 1;
  });
  mapState.labelElements.attr("opacity", node => {
    if (!passes(node)) return 0;
    if (mapState.searchTerm && nodeMatchesSearch(node, mapState.searchTerm)) return 0.95;
    if (node.id === focusId || neighborIds.has(node.id)) return 0.95;
    if (Number(node.importance) >= 9) return 0.72;
    return mapState.zoomScale > 1.35 && Number(node.importance) >= 7 ? 0.8 : 0;
  });
  mapState.linkElements.attr("opacity", link => {
    const source = getNodeFromLink(link.source);
    const target = getNodeFromLink(link.target);
    const matchesSearch = nodeMatchesSearch(source, mapState.searchTerm) || nodeMatchesSearch(target, mapState.searchTerm);
    const matchesLayer = nodeMatchesLayer(source) || nodeMatchesLayer(target);
    if (!matchesSearch || !matchesLayer) return 0.025;
    return focusId && (source?.id === focusId || target?.id === focusId) ? 0.88 : focusId ? 0.055 : 0.42;
  });
}

function showDetails(node) {
  const details = mapState.root.querySelector("#details");
  if (!details || !node) return;
  const connectedNodes = getConnectedNodes(node);
  const connectionsHTML = connectedNodes.length
    ? connectedNodes.slice(0, 18).map(other => `<div class="connection"><strong>${escapeHTML(other.name || other.id)}</strong><span>${escapeHTML(other.layer || "unknown")}</span></div>`).join("")
    : `<div class="connection"><strong>No mapped connections</strong></div>`;
  const moreConnections = connectedNodes.length > 18
    ? `<div class="detail-field">${connectedNodes.length - 18} more connected systems are shown on the map.</div>`
    : "";
  details.innerHTML = `<div class="node-details"><h2>${escapeHTML(node.name || node.id)}</h2><div class="node-meta"><span>${escapeHTML(node.type || "Infrastructure")}</span><span>${escapeHTML(node.layer || "Unclassified layer")}</span></div><div class="detail-field"><strong>Region</strong>${escapeHTML(node.region || "Global / unspecified")}</div><div class="detail-field"><strong>Importance</strong>${escapeHTML(String(node.importance ?? "Not rated"))}</div>${node.network_role ? `<div class="detail-field"><strong>Network role</strong>${escapeHTML(node.network_role)}</div>` : ""}${node.description ? `<div class="detail-field"><strong>Description</strong>${escapeHTML(node.description)}</div>` : ""}<div class="detail-field"><strong>Connected systems · ${connectedNodes.length}</strong><div class="connections">${connectionsHTML}</div></div>${moreConnections}</div>`;
}

function escapeHTML(value) { return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"); }
function resetView() { if (!mapState.svg || !mapState.zoom) return; mapState.svg.transition().duration(500).call(mapState.zoom.transform, d3.zoomIdentity); }
function updateStatistics() {
  const statsBox = mapState.root.querySelector("#stats");
  if (!statsBox) return;
  const layers = new Set(mapState.nodes.map(node => node.layer).filter(Boolean));
  const connected = new Set(mapState.links.flatMap(link => [getNodeFromLink(link.source)?.id, getNodeFromLink(link.target)?.id]).filter(Boolean));
  const isolated = mapState.nodes.length - connected.size;
  statsBox.innerHTML = `<div class="stat-card"><span>NODES</span><strong>${mapState.nodes.length.toLocaleString()}</strong></div><div class="stat-card"><span>LINKS</span><strong>${mapState.links.length.toLocaleString()}</strong></div><div class="stat-card"><span>LAYERS</span><strong>${layers.size.toLocaleString()}</strong></div><div class="stat-card"><span>ISOLATED</span><strong>${isolated.toLocaleString()}</strong></div>`;
  mapState.root.querySelector("#network-summary").textContent = `${mapState.nodes.length.toLocaleString()} nodes · ${mapState.links.length.toLocaleString()} mapped connections`;
  mapState.root.querySelector("#layer-summary").textContent = mapState.missingConnectionCount
    ? `${mapState.missingConnectionCount.toLocaleString()} UNRESOLVED REFERENCES`
    : "ALL REFERENCES MAPPED";
  mapState.root.querySelector("#status-records").textContent = `${mapState.nodes.length.toLocaleString()} indexed systems`;
}

function setStatus(message, state = "") {
  const pill = mapState.root?.querySelector("#runtime-state");
  const label = mapState.root?.querySelector("#runtime-label");
  if (label) label.textContent = message;
  if (pill) pill.className = `runtime-pill ${state}`.trim();
}

function handleMapError(error) {
  if (error.name === "AbortError") return;
  const details = mapState.root?.querySelector("#details");
  if (details) details.innerHTML = `<div class="system-error"><h2>NETWORK DATA UNAVAILABLE</h2><p>${escapeHTML(error.message || String(error))}</p></div>`;
  const loading = mapState.root?.querySelector("#map-loading");
  if (loading) {
    loading.hidden = false;
    loading.innerHTML = `<div class="system-error"><h2>MAP COULD NOT LOAD</h2><p>${escapeHTML(error.message || String(error))}</p></div>`;
  }
  setStatus("DATA LOAD ERROR", "error");
}
