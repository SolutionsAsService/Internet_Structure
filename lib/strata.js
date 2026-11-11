// The seven strata of the atlas, listed top (closest to the person using the internet)
// to bottom (the ground it is made from). Every one of the dataset's `layer` values maps
// to exactly one stratum; test/data.test.js fails if a new layer arrives unmapped.

export const STRATA = [
  {
    id: 'serve',
    n: 7,
    name: 'Serve',
    title: 'Clouds & content',
    question: 'Where does the thing you asked for actually live?',
    blurb: 'Cloud platforms and content delivery networks that hold the pages, video and apps people ask for, and copy them close to every city.',
    layers: ['cloud'],
  },
  {
    id: 'govern',
    n: 6,
    name: 'Govern',
    title: 'Standards & stewards',
    question: 'Who writes the rules everyone agrees to follow?',
    blurb: 'Standards bodies, coordinators, security teams and researchers. They own no cables, but nothing interoperates without them.',
    layers: ['internet_coordination', 'standards', 'web_standards', 'measurement', 'routing_measurement', 'security'],
  },
  {
    id: 'name',
    n: 5,
    name: 'Name',
    title: 'Names, numbers & trust',
    question: 'How does a name become an address, and how do you know the answer is real?',
    blurb: 'DNS, address registries, routing software, certificates and clocks: the shared ledgers that turn names into numbers and numbers into routes.',
    layers: [
      'dns', 'dns_root', 'dns_software', 'dns_security', 'registry', 'rir', 'routing', 'routing_security',
      'pki', 'certificate_authority', 'time', 'network_software', 'network_security', 'network_operations',
    ],
  },
  {
    id: 'carry',
    n: 4,
    name: 'Carry',
    title: 'Carriers & access',
    question: 'Whose network is the packet on right now?',
    blurb: 'Backbones, national carriers, home ISPs, mobile operators, satellites and research networks: the companies that move traffic and sell the connection.',
    layers: ['backbone', 'transit', 'carrier', 'isp', 'mobile', 'satellite', 'research_network'],
  },
  {
    id: 'meet',
    n: 3,
    name: 'Meet',
    title: 'Exchanges & data centres',
    question: 'Where do rival networks physically plug into each other?',
    blurb: 'Internet exchanges, carrier hotels and colocation buildings. Competing networks meet in the same rooms and hand traffic across.',
    layers: ['ixp', 'colocation', 'cloud_interconnect', 'peering', 'ixp_software'],
  },
  {
    id: 'wire',
    n: 2,
    name: 'Wire',
    title: 'Cables, fibre & towers',
    question: 'What is the light actually travelling through?',
    blurb: 'Submarine cables, long-haul and metro fibre, the crews who lay it and the towers that hold the radios.',
    layers: ['submarine', 'fiber', 'metro', 'longhaul', 'optical_transport', 'tower_infrastructure', 'fiber_construction'],
  },
  {
    id: 'make',
    n: 1,
    name: 'Make',
    title: 'Silicon, machines & power',
    question: 'What is all of it built from, and what keeps it switched on?',
    blurb: 'Chip designers, foundries and the tool makers behind them; servers, routers, optics; and the power and cooling plant every data hall depends on.',
    layers: [
      'semiconductor_design', 'semiconductor_equipment', 'semiconductor_fab', 'server_oem', 'storage_hardware',
      'network_hardware', 'optical', 'radio_access', 'physical', 'power', 'backup_power', 'cooling',
    ],
  },
];

// Nodes whose recorded type says plainly that they run names or registries are filed under
// Name even when their `layer` says otherwise (Verisign and Route 53 are filed as `cloud`).
export const TYPE_OVERRIDES = [{ pattern: /\b(DNS|Registry)\b/i, stratum: 'name' }];

export const STRATUM_BY_ID = Object.fromEntries(STRATA.map(s => [s.id, s]));

const LAYER_TO_STRATUM = new Map(STRATA.flatMap(s => s.layers.map(layer => [layer, s.id])));

export function stratumFor(node) {
  for (const rule of TYPE_OVERRIDES) if (rule.pattern.test(node.type || '')) return rule.stratum;
  return LAYER_TO_STRATUM.get(node.layer) || null;
}
