
// ============================================
// INTERNET INFRASTRUCTURE MAP
// app.js
// ============================================

console.log("Internet Infrastructure Map Starting");


// ============================================
// APPLICATION STATE
// ============================================

let mapState = {
    data: null,
    nodes: [],
    links: [],
    nodeMap: new Map(),

    svg: null,
    viewport: null,
    zoom: null,

    simulation: null,

    linkLayer: null,
    nodeLayer: null,
    labelLayer: null,

    linkElements: null,
    nodeElements: null,
    labelElements: null,

    width: 1000,
    height: 700
};


// ============================================
// DOM
// ============================================

const network = document.querySelector("#network");
const details = document.querySelector("#details");
const statsBox = document.querySelector("#stats");
const searchBox = document.querySelector("#search");


if (!network) {

    console.error("#network missing");

    throw new Error("#network missing");

}


// ============================================
// LAYER COLORS
// ============================================

const layerColors = {

    // Physical
    physical: "#6B7280",
    power: "#F59E0B",
    datacenter: "#8B5CF6",
    colocation: "#A78BFA",
    edge: "#7C3AED",
    pop: "#8B5CF6",

    // Connectivity
    isp: "#22C55E",
    mobile: "#16A34A",
    fixed_wireless: "#4ADE80",
    enterprise_isp: "#15803D",

    carrier: "#10B981",
    backbone: "#059669",
    transit: "#047857",
    tier1: "#065F46",
    tier2: "#0F766E",
    tier3: "#14B8A6",

    // Internet Exchange
    ixp: "#06B6D4",
    route_server: "#0891B2",
    peering: "#0E7490",
    internet_exchange_fabric: "#155E75",
    internet_exchange_operator: "#06B6D4",

    // Routing
    routing: "#3B82F6",
    routing_security: "#2563EB",
    routing_measurement: "#1D4ED8",
    routing_software: "#2563EB",
    network_operations: "#1E40AF",
    network_automation: "#4F46E5",

    // DNS
    dns: "#F97316",
    dns_root: "#EA580C",
    dns_authoritative: "#C2410C",
    dns_recursive: "#9A3412",
    dns_registry: "#7C2D12",

    // Internet coordination
    registry: "#14B8A6",
    rir: "#0D9488",
    rir_database: "#0F766E",
    internet_coordination: "#14B8A6",
    internet_governance: "#0D9488",
    standards: "#0F766E",
    web_standards: "#115E59",

    // CDN / Edge
    cdn: "#EC4899",
    edge_compute: "#DB2777",
    web_acceleration: "#BE185D",
    anycast: "#F43F5E",
    geodns: "#E11D48",

    // Cloud
    cloud: "#6366F1",
    compute: "#4F46E5",
    gpu_compute: "#4338CA",
    server: "#3730A3",
    storage: "#312E81",

    // Network hardware
    network_hardware: "#64748B",
    router: "#475569",
    switching: "#334155",
    firewall: "#1E293B",
    load_balancing: "#0F172A",

    // Optical
    optical: "#EAB308",
    fiber: "#CA8A04",
    longhaul: "#A16207",
    metro: "#854D0E",
    optical_transport: "#713F12",

    // Submarine
    submarine: "#090088",
    subsea: "#090088",
    cable_landing: "#0369A1",
    submarine_operator: "#075985",

    // Satellite
    satellite: "#FFBF00",
    leo: "#7C3AED",
    geo_satellite: "#6D28D9",
    ground_station: "#5B21B6",
    satellite_ground: "#7C3AED",

    // Mobile
    mobile_core: "#84CC16",
    radio_access: "#65A30D",
    cell_tower: "#4D7C0F",
    spectrum: "#9333EA",

    // Security
    security: "#EF4444",
    ddos: "#DC2626",
    waf: "#B91C1C",
    incident_response: "#991B1B",

    // PKI
    pki: "#EF4444",
    certificate_authority: "#DC2626",
    certificate_transparency: "#B91B1B",

    // Time
    time: "#FACC15",
    ntp: "#EAB308",
    ptp: "#CA8A04",
    gps_timing: "#A16207",

    // Research
    research_network: "#A855F7",
    national_research: "#9333EA",
    measurement: "#D946EF",
    topology: "#C026D3",
    traffic_measurement: "#A21CAF",

    // Software
    ixp_software: "#0891B2",
    server_oem: "#64748B",
    server_odm: "#475569",
    storage_hardware: "#334155",

    // Semiconductor
    semiconductor: "#F43F5E",
    semiconductor_design: "#E11D48",
    semiconductor_fab: "#BE123C",
    semiconductor_equipment: "#9F1239",
    semiconductor_materials: "#881337",
    chip_packaging: "#701A75",
    memory: "#1E293B",

    // Electronics
    pcb: "#78716C",
    electronics_manufacturing: "#57534E",

    // Power / cooling
    cooling: "#06B6D4",
    liquid_cooling: "#0891B2",
    backup_power: "#F59E0B",
    generator: "#D97706",
    ups: "#B45309",

    // Physical operations
    physical_security: "#52525B",
    construction: "#71717A",
    fiber_construction: "#A1A1AA",
    tower_infrastructure: "#84CC16",

    // Government
    government_network: "#475569",
    critical_infrastructure: "#334155",

    // Content
    content_provider: "#EC4899",
    application: "#F43F5E",

    // Operators
    network_operator: "#10B981",

    // Telecom
    telecom_equipment: "#64748B"
};


// ============================================
// LOAD DATABASE
// ============================================

async function loadDatabase() {

    console.log("Loading internet.json...");

    const response =
        await fetch("data/internet.json");

    if (!response.ok) {

        throw new Error(
            `internet.json failed loading (${response.status})`
        );

    }

    const data =
        await response.json();

    if (!data || !Array.isArray(data.nodes)) {

        throw new Error(
            "internet.json does not contain a valid nodes array"
        );

    }

    console.log(
        "Database Loaded",
        data
    );

    return data;

}


// ============================================
// BUILD GRAPH DATA
// ============================================

function buildGraphData(data) {

    const nodes =
        data.nodes || [];

    const nodeMap =
        new Map();

    nodes.forEach(node => {

        if (!node.id) {

            console.warn(
                "Node missing ID:",
                node
            );

            return;

        }

        nodeMap.set(
            node.id,
            node
        );

    });


    const links = [];


    nodes.forEach(node => {

        if (!Array.isArray(node.connections)) {

            return;

        }


        node.connections.forEach(connection => {

            if (nodeMap.has(connection)) {

                links.push({

                    source: node.id,
                    target: connection

                });

            }

            else {

                console.warn(
                    "Missing connection:",
                    node.id,
                    "->",
                    connection
                );

            }

        });

    });


    return {
        nodes,
        links,
        nodeMap
    };

}


// ============================================
// SIZE
// ============================================

function calculateDimensions() {

    let width =
        network.clientWidth;

    let height =
        network.clientHeight;


    if (width < 500) {
        width = 1000;
    }

    if (height < 500) {
        height = 700;
    }


    return {
        width,
        height
    };

}


// ============================================
// INITIALIZE APPLICATION
// ============================================

async function initializeMap() {

    try {

        const data =
            await loadDatabase();


        const graph =
            buildGraphData(data);


        const dimensions =
            calculateDimensions();


        mapState.data =
            data;

        mapState.nodes =
            graph.nodes;

        mapState.links =
            graph.links;

        mapState.nodeMap =
            graph.nodeMap;

        mapState.width =
            dimensions.width;

        mapState.height =
            dimensions.height;


        console.log(
            "Nodes:",
            mapState.nodes.length
        );

        console.log(
            "Links:",
            mapState.links.length
        );


        initializeSVG();

        initializeSimulation();

        initializeNodes();

        initializeLabels();

        initializeInteractions();

        initializeStatistics();


        console.log(
            "Internet Infrastructure Map Ready"
        );

    }

    catch (error) {

        console.error(
            "MAP FAILURE:",
            error
        );


        if (details) {

            details.innerHTML = `
                <strong>SYSTEM FAILURE</strong>
                <br><br>
                ${error.message}
            `;

        }

    }

}


// =================================
// PHYSICS ENGINE
// =================================

const {
    simulation,
    centerX,
    centerY
} = createPhysics({

    nodes,

    links,

    width,

    height

});


// =================================
// DRAG BEHAVIOR
// =================================

const dragBehavior =
    createDragBehavior(simulation);



// ============================================
// SVG
// ============================================

function initializeSVG() {

    const {
        width,
        height
    } = mapState;


    const svg =
        d3.select(network)
            .append("svg")
            .attr("width", "100%")
            .attr("height", "100%");


    const viewport =
        svg.append("g")
            .attr(
                "class",
                "viewport"
            );


    const zoom =
        d3.zoom()
            .scaleExtent([
                0.2,
                4
            ])
            .on(
                "zoom",
                event => {

                    viewport.attr(
                        "transform",
                        event.transform
                    );

                }
            );


    svg.call(zoom);


    svg.call(
        zoom.transform,
        d3.zoomIdentity
            .translate(
                width / 2,
                height / 2
            )
            .scale(0.7)
    );


    mapState.svg =
        svg;

    mapState.viewport =
        viewport;

    mapState.zoom =
        zoom;


    mapState.linkLayer =
        viewport
            .append("g")
            .attr(
                "class",
                "links"
            );


    mapState.nodeLayer =
        viewport
            .append("g")
            .attr(
                "class",
                "nodes"
            );


    mapState.labelLayer =
        viewport
            .append("g")
            .attr(
                "class",
                "labels"
            );

}


// ============================================
// SIMULATION
// ============================================

function initializeSimulation() {

    const {
        nodes,
        links,
        width,
        height
    } = mapState;


    const centerX =
        width / 2;

    const centerY =
        height / 2;


    const radius =
        Math.min(
            width,
            height
        ) * 0.32;


    nodes.forEach((node, index) => {

        const angle =
            (
                index /
                Math.max(
                    nodes.length,
                    1
                )
            ) *
            Math.PI *
            2;


        node.x =
            centerX +
            Math.cos(angle) *
            radius;


        node.y =
            centerY +
            Math.sin(angle) *
            radius;

    });


    const simulation =
        d3.forceSimulation(nodes)

            .force(
                "link",

                d3.forceLink(links)
                    .id(d => d.id)
                    .distance(180)
                    .strength(0.35)
            )

            .force(
                "charge",

                d3.forceManyBody()
                    .strength(-300)
                    .distanceMin(40)
                    .distanceMax(800)
            )

            .force(
                "center",

                d3.forceCenter(
                    centerX,
                    centerY
                )
            )

            .force(
                "collision",

                d3.forceCollide()
                    .radius(d => {

                        return (
                            (d.importance || 5) *
                            1.7
                        ) + 24;

                    })
                    .strength(0.9)
                    .iterations(3)
            )

            .force(
                "x",

                d3.forceX(centerX)
                    .strength(0.01)
            )

            .force(
                "y",

                d3.forceY(centerY)
                    .strength(0.01)
            )

            .alpha(0.7)
            .alphaDecay(0.02)
            .velocityDecay(0.6);


    mapState.simulation =
        simulation;

}


// ============================================
// NODES
// ============================================

function initializeNodes() {

    const {
        nodes,
        links,
        nodeLayer,
        linkLayer,
        simulation
    } = mapState;


    const linkElements =
        linkLayer
            .selectAll("line")
            .data(links)
            .enter()
            .append("line")
            .attr(
                "stroke",
                "#33495c"
            )
            .attr(
                "stroke-width",
                1.5
            )
            .attr(
                "opacity",
                0.7
            );


    const nodeElements =
        nodeLayer
            .selectAll("circle")
            .data(nodes)
            .enter()
            .append("circle")
            .attr(
                "r",
                d => (
                    (d.importance || 5) *
                    1.7
                ) + 7
            )
            .attr(
                "fill",
                d =>
                    layerColors[d.layer] ||
                    "#888"
            )
            .attr(
                "stroke",
                "#000"
            )
            .attr(
                "stroke-width",
                2
            )
            .style(
                "filter",
                "drop-shadow(0px 0px 8px currentColor)"
            );


    nodeElements
        .on(
            "mouseenter",
            function() {

                d3.select(this)
                    .attr(
                        "stroke",
                        "#ffffff"
                    )
                    .attr(
                        "stroke-width",
                        4
                    );

            }
        )
        .on(
            "mouseleave",
            function() {

                d3.select(this)
                    .attr(
                        "stroke",
                        "#000"
                    )
                    .attr(
                        "stroke-width",
                        2
                    );

            }
        )
        .on(
            "click",
            showDetails
        );


    nodeElements.call(
    dragBehavior
);

    );


    mapState.linkElements =
        linkElements;

    mapState.nodeElements =
        nodeElements;


    simulation.on(
        "tick",
        updateGraph
    );

}


// ============================================
// LABELS
// ============================================

function initializeLabels() {

    const {
        nodes,
        labelLayer
    } = mapState;


    const labelElements =
        labelLayer
            .selectAll("text")
            .data(nodes)
            .enter()
            .append("text")
            .text(
                d => d.name
            )
            .attr(
                "fill",
                "#d0d7de"
            )
            .attr(
                "font-size",
                d =>
                    (d.importance || 0) >= 9
                        ? "14px"
                        : "11px"
            )
            .attr(
                "font-family",
                "monospace"
            )
            .attr(
                "text-anchor",
                "middle"
            )
            .style(
                "pointer-events",
                "none"
            );


    mapState.labelElements =
        labelElements;

}


// ============================================
// GRAPH UPDATE
// ============================================

function updateGraph() {

    const {
        linkElements,
        nodeElements,
        labelElements
    } = mapState;


    linkElements
        .attr(
            "x1",
            d => d.source.x
        )
        .attr(
            "y1",
            d => d.source.y
        )
        .attr(
            "x2",
            d => d.target.x
        )
        .attr(
            "y2",
            d => d.target.y
        );


    nodeElements
        .attr(
            "cx",
            d => d.x
        )
        .attr(
            "cy",
            d => d.y
        );


    labelElements
        .attr(
            "x",
            d => d.x
        )
        .attr(
            "y",
            d => d.y - 35
        );

}




// ============================================
// DETAILS
// ============================================

function showDetails(event, node) {

    const {
        links
    } = mapState;


    const connected =
        links

            .filter(link => {

                return (
                    link.source.id === node.id ||
                    link.target.id === node.id
                );

            })

            .map(link => {

                const other =
                    link.source.id === node.id
                        ? link.target
                        : link.source;


                return `
                    <div>
                        ${other.name}
                        <small>
                            ${other.layer || ""}
                        </small>
                    </div>
                `;

            })

            .join("");


    details.innerHTML = `

        <h2>${node.name}</h2>

        <p>
            <strong>Type:</strong>
            ${node.type || "Unknown"}
        </p>

        <p>
            <strong>Layer:</strong>
            ${node.layer || "Unknown"}
        </p>

        <p>
            <strong>Region:</strong>
            ${node.region || "Global"}
        </p>

        <p>
            <strong>Importance:</strong>
            ${node.importance || "Unknown"}
        </p>

        <p>
            <strong>Network Role:</strong>
            ${node.network_role || ""}
        </p>

        <p>
            ${node.description || ""}
        </p>

        <h3>
            Connected Infrastructure
        </h3>

        ${
            connected ||
            "No known connections"
        }

    `;

}


// ============================================
// SEARCH
// ============================================

function initializeSearch() {

    if (!searchBox) {
        return;
    }


    searchBox.addEventListener(
        "input",
        () => {

            const value =
                searchBox.value
                    .toLowerCase()
                    .trim();


            const {
                nodeElements,
                labelElements
            } = mapState;


            nodeElements.attr(
                "opacity",
                d =>
                    d.name
                        .toLowerCase()
                        .includes(value)
                        ? 1
                        : 0.15
            );


            labelElements.attr(
                "opacity",
                d =>
                    d.name
                        .toLowerCase()
                        .includes(value)
                        ? 1
                        : 0.15
            );

        }
    );

}


// ============================================
// LAYER FILTER
// ============================================

function filterLayer(layer) {

    const {
        nodeElements,
        labelElements,
        linkElements
    } = mapState;


    nodeElements.attr(
        "opacity",
        d => {

            if (layer === "all") {
                return 1;
            }

            return d.layer === layer
                ? 1
                : 0.1;

        }
    );


    labelElements.attr(
        "opacity",
        d => {

            if (layer === "all") {
                return 1;
            }

            return d.layer === layer
                ? 1
                : 0.1;

        }
    );


    linkElements.attr(
        "opacity",
        d => {

            if (layer === "all") {
                return 0.7;
            }

            return (
                d.source.layer === layer ||
                d.target.layer === layer
            )
                ? 0.8
                : 0.05;

        }
    );

}


// Keep compatibility with
// existing HTML onclick handlers.
window.filterLayer =
    filterLayer;


// ============================================
// RESET VIEW
// ============================================

function resetView() {

    const {
        svg,
        zoom
    } = mapState;


    svg
        .transition()
        .duration(750)
        .call(
            zoom.transform,
            d3.zoomIdentity
        );

}


window.resetView =
    resetView;


// ============================================
// STATISTICS
// ============================================

function initializeStatistics() {

    if (!statsBox) {
        return;
    }


    const {
        nodes
    } = mapState;


    const stats = {

        nodes:
            nodes.length,

        links:
            mapState.links.length,

        regions:
            new Set(
                nodes.map(
                    d => d.region
                )
            ).size,

        critical:
            nodes.filter(
                d =>
                    (d.importance || 0) >= 9
            ).length

    };


    statsBox.innerHTML = `

        NODES:
        ${stats.nodes}

        <br>

        CONNECTIONS:
        ${stats.links}

        <br>

        REGIONS:
        ${stats.regions}

        <br>

        CRITICAL NODES:
        ${stats.critical}

    `;


    console.log(
        "Network Statistics",
        stats
    );

}


// ============================================
// INTERACTIONS
// ============================================

function initializeInteractions() {

    initializeSearch();

}


// ============================================
// START
// ============================================

initializeMap();

