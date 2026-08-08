// colors.js
// Internet Infrastructure Map — Centralized Color System
//
// Keep all map colors here.
// Other files should import/use COLORS rather than hard-coding colors.
//
// Example:
//   import { COLORS } from "./colors.js";
//   node.color = COLORS.nodes.submarine;
//

const COLORS = {
  // ============================================================
  // GLOBAL / UI
  // ============================================================

  background: "#070B12",
  backgroundAlt: "#0B111A",
  panel: "#0D141E",
  panelAlt: "#111A26",

  text: "#E6EDF3",
  textMuted: "#8B98A8",
  textDim: "#5F6B78",

  border: "#263342",
  borderLight: "#344252",

  white: "#FFFFFF",
  black: "#000000",

  // ============================================================
  // PHYSICAL INFRASTRUCTURE
  // ============================================================


    // General physical infrastructure
    default: "#737B84",

    // Buildings / facilities
    buildings: "#8A929B",
    datacenters: "#A0A7AE",
    serverFacilities: "#929AA3",
    colocation: "#7D8791",

    // Network facilities
    telecomFacility: "#69737D",
    carrierHotel: "#606A74",
    networkOperations: "#59636D",

    // Towers / terrestrial structures
    towers: "#858D95",
    cellTowers: "#747D86",
    radioTowers: "#6D7781",

    // Roads / physical routes
    roads: "#454D56",
    rail: "#515A64",
    terrestrialRoutes: "#626B74",

    // Power infrastructure
    power: "#A49A62",
    substations: "#8E8450",
    powerPlants: "#7C7448",

    // Construction / industrial
    industrial: "#70777E",
    manufacturing: "#7A8188",
  

  // ============================================================
  // SUBMARINE INFRASTRUCTURE
  // ============================================================


    // Deep ocean / cable system
    submarine: "#075985",

    cable: "#0369A1",
    cableBright: "#0284C7",
    cableDark: "#0C4A6E",

    landingStation: "#0EA5E9",
    landingPoint: "#38BDF8",

    repeater: "#0891B2",

    subseaRoute: "#075985",
    subseaDark: "#063B5C",

    // Ocean
    ocean: "#082F49",
    oceanDeep: "#041E32",
  

  // ============================================================
  // INTERNET / NETWORK LAYERS
  // ============================================================

  
    network: "#22C55E",
    
    // Backbone
    backbone: "#16A34A",
    backboneBright: "#22C55E",
    backboneDark: "#166534",

    // Tiered ISPs
    tier1: "#10B981",
    tier2: "#14B8A6",
    tier3: "#2DD4BF",

    // Transit
    transit: "#059669",
    peering: "#0D9488",

    // Routing
    routing: "#84CC16",
    bgp: "#65A30D",
    anycast: "#A3E635",

    // Autonomous systems
    asn: "#22C55E",
    autonomousSystem: "#16A34A",
  

  // ============================================================
  // ISP / TELECOM
  // ============================================================

  
    isp: "#14B8A6",

    tier1: "#0F766E",
    tier2: "#0D9488",
    tier3: "#14B8A6",

    broadband: "#2DD4BF",
    fiber: "#5EEAD4",

    telecom: "#0891B2",
    carrier: "#0284C7",

    mobile: "#06B6D4",
    wireless: "#22D3EE",

    satellite: "#38BDF8",
  

  // ============================================================
  // INTERNET EXCHANGE POINTS
  // ============================================================

  
    ixp: "#F59E0B",

    exchange: "#F59E0B",
    peering: "#D97706",
    routeServer: "#FBBF24",

    facility: "#B45309",
    fabric: "#FCD34D",
  
  // ============================================================
  // DATA CENTERS / CLOUD
  // ============================================================

  

    datacenter: "#7C3AED",
    cloudRegion: "#8B5CF6",
    availabilityZone: "#A78BFA",

    compute: "#9333EA",
    storage: "#A855F7",
    database: "#C084FC",

    serverless: "#D8B4FE",

    privateCloud: "#6D28D9",
    publicCloud: "#8B5CF6",
    hybridCloud: "#A78BFA",
  

  // ============================================================
  // CDN / EDGE
  // ============================================================

  

    cdn: "#DB2777",
    edge: "#F472B6",
    edgeNode: "#EC4899",
    edgeRegion: "#BE185D",

    cache: "#F9A8D4",
    edgeCompute: "#E879F9",

    pointOfPresence: "#C026D3",
    pop: "#D946EF",
  

  // ============================================================
  // DNS
  // ============================================================

  
    dns: "#06B6D4",

    dns: "#0891B2",
    resolver: "#0E7490",
    authoritative: "#155E75",

    root: "#164E63",
    tld: "#0E7490",

    geodns: "#22D3EE",
    recursive: "#67E8F9",

    nameserver: "#06B6D4",
  

  // ============================================================
  // BGP / ROUTING
  // ============================================================

  

    bgp: "#65A30D",
    route: "#84CC16",
    routeAnnouncement: "#A3E635",

    peer: "#4D7C0F",
    transit: "#3F6212",

    anycast: "#BEF264",
    routeReflector: "#D9F99D",
  

  // ============================================================
  // SATELLITE NETWORKS
  // ============================================================

 

    satellite: "#0EA5E9",
    constellation: "#0284C7",

    groundStation: "#22D3EE",
    uplink: "#67E8F9",
    downlink: "#7DD3FC",

    orbit: "#075985",
  

  // ============================================================
  // CELLULAR NETWORKS
  // ============================================================

 
   cellular: "#F43F5E",

    tower: "#E11D48",
    cellSite: "#BE123C",

    core: "#F43F5E",
    radio: "#FB7185",

    backhaul: "#9F1239",

    fiveG: "#FB7185",
    fourG: "#F43F5E",
    threeG: "#E11D48",
  

  // ============================================================
  // COMPUTE / SERVERS / HARDWARE
  // ============================================================

  
    compute: "#A855F7",

    server: "#9333EA",
    rack: "#7E22CE",
    cluster: "#6B21A8",

    cpu: "#C084FC",
    gpu: "#D8B4FE",

    accelerator: "#E879F9",

    bareMetal: "#7C3AED",
    virtualMachine: "#8B5CF6",
    container: "#A78BFA",
  

  // ============================================================
  // SEMICONDUCTOR SUPPLY CHAIN
  // ============================================================

    semiconductor: "#F97316",

    fab: "#EA580C",
    fabrication: "#C2410C",

    design: "#FB923C",
    ip: "#FDBA74",

    packaging: "#F59E0B",
    testing: "#FBBF24",

    equipment: "#D97706",
    materials: "#B45309",

    wafer: "#FFB86B",
    chip: "#FF8A3D",
  

  // ============================================================
  // OPTICAL NETWORKS
  // ============================================================

    optical: "#F472B6",

    fiber: "#EC4899",
    fiberBackbone: "#DB2777",

    wavelength: "#F9A8D4",
    dwdm: "#BE185D",

    transceiver: "#E879F9",
    optic: "#C026D3",

    photonics: "#D946EF",
  

  // ============================================================
  // CDN / DNS / EDGE FLOW
  // ============================================================

  
    default: "#60A5FA",

    request: "#60A5FA",
    response: "#93C5FD",

    ingress: "#3B82F6",
    egress: "#2563EB",

    cacheHit: "#22C55E",
    cacheMiss: "#F59E0B",

    dnsRequest: "#06B6D4",
    bgpRoute: "#84CC16",

    encrypted: "#8B5CF6",
  

  // ============================================================
  // SECURITY
  // ============================================================

    default: "#EF4444",

    firewall: "#DC2626",
    waf: "#EF4444",

    ddos: "#F43F5E",
    mitigation: "#FB7185",

    encryption: "#8B5CF6",
    identity: "#6366F1",

    zeroTrust: "#A855F7",
    secureTunnel: "#7C3AED",
  

  // ============================================================
  // BLOCKCHAIN / DISTRIBUTED TRUST
  // ============================================================


    blockchain: "#CA8A04",
    validator: "#FACC15",

    node: "#EAB308",
    consensus: "#FDE047",

    smartContract: "#F59E0B",
    identity: "#FBBF24",

    zk: "#F97316",
  

  // ============================================================
  // MESH NETWORKS
  // ============================================================

 mesh: "#10B981",

    node: "#34D399",
    router: "#10B981",
    gateway: "#059669",

    local: "#6EE7B7",
    remote: "#14B8A6",

    peer: "#2DD4BF",
    relay: "#0D9488",

    meshLink: "#5EEAD4",
  

  // ============================================================
  // ENDPOINTS / USERS
  // ============================================================


    default: "#F8FAFC",

    user: "#E2E8F0",
    device: "#CBD5E1",

    phone: "#94A3B8",
    laptop: "#CBD5E1",
    desktop: "#A8B1BC",

    iot: "#64748B",
    sensor: "#94A3B8",
  

  // ============================================================
  // ORGANIZATIONS / COMPANIES
  // ============================================================

  organization: "#64748B",

    provider: "#475569",
    enterprise: "#334155",

    operator: "#475569",
    manufacturer: "#64748B",

    hyperscaler: "#8B5CF6",
    telecom: "#0891B2",
    cdn: "#DB2777",
  

  // ============================================================
  // MAP LINK COLORS
  // ============================================================

  links: "#3B4652",

    physical: "#68737E",
    terrestrial: "#59636D",
    submarine: "#075985",

    backbone: "#16A34A",
    transit: "#059669",
    peering: "#F59E0B",

    fiber: "#EC4899",
    wireless: "#22D3EE",
    satellite: "#38BDF8",

    cloud: "#8B5CF6",
    edge: "#DB2777",
    dns: "#06B6D4",

    bgp: "#84CC16",
    traffic: "#60A5FA",
    mesh: "#10B981",

    inactive: "#27313B",
    disabled: "#1B232C",
  

  // ============================================================
  // NODE STATES
  // ============================================================

 
    online: "#22C55E",
    active: "#34D399",

    warning: "#F59E0B",
    degraded: "#F97316",

    offline: "#64748B",
    error: "#EF4444",

    selected: "#FFFFFF",
    highlighted: "#60A5FA",
  

  // ============================================================
  // VISUAL EFFECTS
  // ============================================================

 
    glow: "#60A5FA",
    glowPhysical: "#94A3B8",
    glowSubmarine: "#0284C7",
    glowNetwork: "#22C55E",
    glowCloud: "#8B5CF6",
    glowEdge: "#EC4899",
    glowDns: "#06B6D4",
    glowIxp: "#F59E0B",

    selection: "#FFFFFF",
    hover: "#CBD5E1",
  

  // ============================================================
  // LAYER COLORS
  // ============================================================


    physical: "#737B84",
    submarine: "#075985",

    optical: "#EC4899",
    network: "#22C55E",

    isp: "#14B8A6",
    bgp: "#84CC16",
    dns: "#06B6D4",

    ixp: "#F59E0B",
    cellular: "#F43F5E",
    satellite: "#38BDF8",

    cloud: "#8B5CF6",
    cdn: "#DB2777",
    edge: "#D946EF",

    compute: "#A855F7",
    semiconductor: "#F97316",

    security: "#EF4444",
    blockchain: "#EAB308",
    mesh: "#10B981",

    endpoint: "#CBD5E1",

};


// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get a color from a nested path.
 *
 * Example:
 *   getColor("submarine.cable")
 *   getColor("cloud.datacenter")
 */
function getColor(path, fallback = COLORS.links.default) {
  const parts = path.split(".");
  let value = COLORS;

  for (const part of parts) {
    if (value && Object.prototype.hasOwnProperty.call(value, part)) {
      value = value[part];
    } else {
      return fallback;
    }
  }

  return typeof value === "string" ? value : fallback;
}


/**
 * Return a color based on a node/link type.
 */
function colorForType(type) {
  if (!type) return COLORS.nodes?.default || COLORS.links.default;

  const normalized = String(type)
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

  const mappings = {
    submarine: COLORS.submarine.default,
    submarinecable: COLORS.submarine.cable,
    landingstation: COLORS.submarine.landingStation,
    landingpoint: COLORS.submarine.landingPoint,

    physical: COLORS.physical.default,
    datacenter: COLORS.physical.datacenters,
    building: COLORS.physical.buildings,
    tower: COLORS.physical.towers,

    isp: COLORS.isp.default,
    tier1: COLORS.isp.tier1,
    tier2: COLORS.isp.tier2,
    tier3: COLORS.isp.tier3,
    telecom: COLORS.isp.telecom,
    carrier: COLORS.isp.carrier,

    ixp: COLORS.ixp.default,
    exchange: COLORS.ixp.exchange,
    peering: COLORS.ixp.peering,

    cloud: COLORS.cloud.default,
    datacentercloud: COLORS.cloud.datacenter,
    compute: COLORS.compute.default,
    server: COLORS.compute.server,

    cdn: COLORS.cdn.default,
    edge: COLORS.cdn.edge,
    pop: COLORS.cdn.pop,

    dns: COLORS.dns.default,
    geodns: COLORS.dns.geodns,
    resolver: COLORS.dns.resolver,

    bgp: COLORS.bgp.default,
    anycast: COLORS.bgp.anycast,
    routing: COLORS.bgp.route,

    satellite: COLORS.satellite.default,
    groundstation: COLORS.satellite.groundStation,

    cellular: COLORS.cellular.default,
    celltower: COLORS.cellular.tower,
    fiveg: COLORS.cellular.fiveG,

    fiber: COLORS.optical.fiber,
    photonics: COLORS.optical.photonics,
    transceiver: COLORS.optical.transceiver,

    semiconductor: COLORS.semiconductor.default,
    fab: COLORS.semiconductor.fab,
    packaging: COLORS.semiconductor.packaging,
    chip: COLORS.semiconductor.chip,

    security: COLORS.security.default,
    firewall: COLORS.security.firewall,
    waf: COLORS.security.waf,

    blockchain: COLORS.blockchain.default,
    validator: COLORS.blockchain.validator,

    mesh: COLORS.mesh.default,
    meshnnode: COLORS.mesh.node,
    router: COLORS.mesh.router,

    endpoint: COLORS.endpoint.default,
    device: COLORS.endpoint.device,
    iot: COLORS.endpoint.iot,
  };

  return mappings[normalized] || COLORS.links.default;
}


// ============================================================
// EXPORTS
// ============================================================

// ES Module
export {
  COLORS,
  getColor,
  colorForType,
};

// Optional default export
export default COLORS;
