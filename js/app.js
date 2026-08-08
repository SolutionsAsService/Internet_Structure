/*
============================================================
INTERNET INFRASTRUCTURE MAP
app.js

Responsibilities:
- Load internet.json
- Validate database
- Build node/link relationships
- Create SVG graph
- Render nodes, links and labels
- Search
- Layer filtering
- Details panel
- Statistics
- Zoom
- Drag interaction

NOT responsible for:
- Physics / force simulation
- Layer color definitions

Physics is handled by:
    physics.js

============================================================
*/

import {
    createPhysics,
    createDragBehavior
} from "./physics.js";


console.log("Internet Infrastructure Map Starting");


// ============================================================
// GLOBAL STATE
// ============================================================

let mapState = {
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
    height: 0
};


// ============================================================
// START APPLICATION
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    initializeMap();

});


// ============================================================
// INITIALIZE
// ============================================================

async function initializeMap() {

    try {

        console.log("Initializing map...");

        const network =
            document.querySelector("#network");

        const details =
            document.querySelector("#details");

        if (!network) {

            throw new Error(
                "Map container #network was not found."
            );

        }

        // ----------------------------------------------------
        // LOAD DATABASE
        // ----------------------------------------------------

        const response =
            await fetch("data/internet.json", {
                cache: "no-store"
            });

        if (!response.ok) {

            throw new Error(
                `internet.json failed loading (${response.status})`
            );

        }

        const data =
            await response.json();

        console.log(
            "Database Loaded",
            data
        );


        // ----------------------------------------------------
        // VALIDATE DATABASE
        // ----------------------------------------------------

        if (!data || typeof data !== "object") {

            throw new Error(
                "internet.json did not contain a valid JSON object."
            );

        }

        if (!Array.isArray(data.nodes)) {

            throw new Error(
                "internet.json is missing the nodes array."
            );

        }


        // ----------------------------------------------------
        // STORE DATA
        // ----------------------------------------------------

        mapState.data = data;

        mapState.nodes = data.nodes;

        console.log(
            "Database Nodes:",
            mapState.nodes.length
        );


        // ----------------------------------------------------
        // GET DIMENSIONS
        // ----------------------------------------------------

        let width =
            network.clientWidth;

        let height =
            network.clientHeight;


        if (!width || width < 500) {

            width = 1200;

        }

        if (!height || height < 500) {

            height = 800;

        }


        mapState.width = width;
        mapState.height = height;


        // ----------------------------------------------------
        // BUILD NODE MAP
        // ----------------------------------------------------

        buildNodeMap();


        // ----------------------------------------------------
        // BUILD LINKS
        // ----------------------------------------------------

        buildLinks();


        // ----------------------------------------------------
        // CREATE SVG
        // ----------------------------------------------------

        createSVG(network);


        // ----------------------------------------------------
        // RENDER GRAPH
        // ----------------------------------------------------

        renderLinks();

        renderNodes();

        renderLabels();


        // ----------------------------------------------------
        // CREATE ZOOM
        // ----------------------------------------------------

        setupZoom();


        // ----------------------------------------------------
        // SETUP INTERACTION
        // ----------------------------------------------------

        setupSearch();

        setupLayerFilters();

        setupGlobalFunctions();


        // ----------------------------------------------------
        // CONNECT PHYSICS
        // ----------------------------------------------------

        initializePhysics();


        // ----------------------------------------------------
        // STATISTICS
        // ----------------------------------------------------

        updateStatistics();


        // ----------------------------------------------------
        // INITIAL VIEW
        // ----------------------------------------------------

        resetView();


        console.log(
            "Internet Infrastructure Map Ready"
        );

    }

    catch (error) {

        handleMapError(error);

    }

}


// ============================================================
// NODE MAP
// ============================================================

function buildNodeMap() {

    mapState.nodeMap =
        new Map();


    mapState.nodes.forEach(node => {

        if (!node || !node.id) {

            console.warn(
                "Skipping invalid node:",
                node
            );

            return;

        }


        if (mapState.nodeMap.has(node.id)) {

            console.warn(
                "Duplicate node ID:",
                node.id
            );

            return;

        }


        mapState.nodeMap.set(
            node.id,
            node
        );

    });


    console.log(
        "Node Map:",
        mapState.nodeMap.size
    );

}


// ============================================================
// BUILD LINKS
// ============================================================

function buildLinks() {

    const links = [];

    const duplicateCheck =
        new Set();


    mapState.nodes.forEach(node => {

        if (
            !node ||
            !node.id ||
            !Array.isArray(node.connections)
        ) {

            return;

        }


        node.connections.forEach(connectionId => {

            if (!connectionId) {

                return;

            }


            // -----------------------------------------------
            // VERIFY TARGET EXISTS
            // -----------------------------------------------

            if (!mapState.nodeMap.has(connectionId)) {

                console.warn(
                    "Missing connection:",
                    node.id,
                    "->",
                    connectionId
                );

                return;

            }


            // -----------------------------------------------
            // PREVENT SELF LINKS
            // -----------------------------------------------

            if (node.id === connectionId) {

                console.warn(
                    "Ignoring self connection:",
                    node.id
                );

                return;

            }


            // -----------------------------------------------
            // PREVENT DUPLICATE EDGES
            // -----------------------------------------------

            const key =
                [node.id, connectionId]
                    .sort()
                    .join("::");


            if (duplicateCheck.has(key)) {

                return;

            }


            duplicateCheck.add(key);


            links.push({

                source: node.id,

                target: connectionId

            });

        });

    });


    mapState.links = links;


    console.log(
        "Links:",
        mapState.links.length
    );

}


// ============================================================
// CREATE SVG
// ============================================================

function createSVG(network) {

    // Clear old SVG if application somehow initializes twice.

    d3.select(network)
        .selectAll("svg")
        .remove();


    mapState.svg =
        d3.select(network)

            .append("svg")

            .attr(
                "width",
                "100%"
            )

            .attr(
                "height",
                "100%"
            )

            .attr(
                "viewBox",
                `0 0 ${mapState.width} ${mapState.height}`
            );


    // --------------------------------------------------------
    // MAIN VIEWPORT
    // --------------------------------------------------------

    mapState.viewport =
        mapState.svg

            .append("g")

            .attr(
                "class",
                "viewport"
            );


    // --------------------------------------------------------
    // LAYER ORDER
    // --------------------------------------------------------

    mapState.linkLayer =
        mapState.viewport

            .append("g")

            .attr(
                "class",
                "links"
            );


    mapState.nodeLayer =
        mapState.viewport

            .append("g")

            .attr(
                "class",
                "nodes"
            );


    mapState.labelLayer =
        mapState.viewport

            .append("g")

            .attr(
                "class",
                "labels"
            );

}


// ============================================================
// LINKS
// ============================================================

function renderLinks() {

    mapState.linkElements =

        mapState.linkLayer

            .selectAll("line")

            .data(
                mapState.links,
                d =>
                    `${d.source}::${d.target}`
            )

            .enter()

            .append("line")

            .attr(
                "class",
                "network-link"
            )

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
                0.65
            );

}


// ============================================================
// NODES
// ============================================================

function renderNodes() {

    mapState.nodeElements =

        mapState.nodeLayer

            .selectAll("circle")

            .data(
                mapState.nodes,
                d => d.id
            )

            .enter()

            .append("circle")

            .attr(
                "class",
                "network-node"
            )

            .attr(
                "r",
                getNodeRadius
            )

            /*
             * Neutral fallback color.
             *
             * colors.js can replace this later.
             */

            .attr(
                "fill",
                "#64748b"
            )

            .attr(
                "stroke",
                "#000000"
            )

            .attr(
                "stroke-width",
                2
            )

            .style(
                "cursor",
                "pointer"
            );


    // --------------------------------------------------------
    // HOVER
    // --------------------------------------------------------

    mapState.nodeElements

        .on(
            "mouseenter",
            function () {

                d3.select(this)

                    .attr(
                        "stroke",
                        "#ffffff"
                    )

                    .attr(
                        "stroke-width",
                        3
                    );

            }
        )


        .on(
            "mouseleave",
            function () {

                d3.select(this)

                    .attr(
                        "stroke",
                        "#000000"
                    )

                    .attr(
                        "stroke-width",
                        2
                    );

            }
        )


        .on(
            "click",
            function (event, node) {

                showDetails(
                    event,
                    node
                );

            }
        );

}


// ============================================================
// NODE SIZE
// ============================================================

function getNodeRadius(node) {

    const importance =
        Number(node.importance) || 5;


    /*
     * Keep node sizes controlled.
     *
     * Importance 1-10 becomes approximately
     * 10px-28px.
     */

    return Math.max(
        9,
        Math.min(
            28,
            8 + importance * 2
        )
    );

}


// ============================================================
// LABELS
// ============================================================

function renderLabels() {

    mapState.labelElements =

        mapState.labelLayer

            .selectAll("text")

            .data(
                mapState.nodes,
                d => d.id
            )

            .enter()

            .append("text")

            .text(
                d =>
                    d.name ||
                    d.id
            )

            .attr(
                "class",
                "network-label"
            )

            .attr(
                "fill",
                "#d0d7de"
            )

            .attr(
                "font-size",
                d => {

                    const importance =
                        Number(d.importance) || 0;

                    return importance >= 9
                        ? "14px"
                        : "11px";

                }
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

}


// ============================================================
// ZOOM
// ============================================================

function setupZoom() {

    mapState.zoom =

        d3.zoom()

            .scaleExtent([
                0.15,
                5
            ])

            .on(
                "zoom",
                event => {

                    mapState.viewport

                        .attr(
                            "transform",
                            event.transform
                        );

                }
            );


    mapState.svg.call(
        mapState.zoom
    );

}


// ============================================================
// PHYSICS
// ============================================================

function initializePhysics() {

    try {

        console.log(
            "Initializing physics engine..."
        );


        // ----------------------------------------
        // CREATE SIMULATION
        // ----------------------------------------

        const physics =
            createPhysics({

                nodes:
                    mapState.nodes,

                links:
                    mapState.links,

                width:
                    mapState.width,

                height:
                    mapState.height

            });


        // Store simulation globally in map state.

        mapState.simulation =
            physics.simulation;


        // ----------------------------------------
        // UPDATE GRAPH EVERY TICK
        // ----------------------------------------

        mapState.simulation.on(
            "tick",
            updateGraphPositions
        );


        // ----------------------------------------
        // DRAG BEHAVIOR
        // ----------------------------------------

        const dragBehavior =
            createDragBehavior(
                mapState.simulation
            );


        mapState.nodeElements.call(
            dragBehavior
        );


        // ----------------------------------------
        // FIRST POSITION UPDATE
        // ----------------------------------------

        updateGraphPositions();


        console.log(
            "Physics engine initialized:",
            mapState.nodes.length,
            "nodes /",
            mapState.links.length,
            "links"
        );

    }

    catch (error) {

        console.error(
            "Physics initialization failed:",
            error
        );

        console.warn(
            "Graph rendered without simulation."
        );

    }

}


   

// ============================================================
// UPDATE GRAPH POSITIONS
// ============================================================

function updateGraphPositions() {

    if (!mapState.nodeElements) {

        return;

    }


    // --------------------------------------------------------
    // LINKS
    // --------------------------------------------------------

    if (mapState.linkElements) {

        mapState.linkElements

            .attr(
                "x1",
                d =>
                    getPosition(d.source, "x")
            )

            .attr(
                "y1",
                d =>
                    getPosition(d.source, "y")
            )

            .attr(
                "x2",
                d =>
                    getPosition(d.target, "x")
            )

            .attr(
                "y2",
                d =>
                    getPosition(d.target, "y")
            );

    }


    // --------------------------------------------------------
    // NODES
    // --------------------------------------------------------

    mapState.nodeElements

        .attr(
            "cx",
            d =>
                Number.isFinite(d.x)
                    ? d.x
                    : mapState.width / 2
        )

        .attr(
            "cy",
            d =>
                Number.isFinite(d.y)
                    ? d.y
                    : mapState.height / 2
        );


    // --------------------------------------------------------
    // LABELS
    // --------------------------------------------------------

    if (mapState.labelElements) {

        mapState.labelElements

            .attr(
                "x",
                d =>
                    Number.isFinite(d.x)
                        ? d.x
                        : mapState.width / 2
            )

            .attr(
                "y",
                d =>
                    Number.isFinite(d.y)
                        ? d.y - 32
                        : mapState.height / 2 - 32
            );

    }

}


// ============================================================
// SAFE POSITION
// ============================================================

function getPosition(object, axis) {

    if (
        object &&
        Number.isFinite(object[axis])
    ) {

        return object[axis];

    }


    return axis === "x"
        ? mapState.width / 2
        : mapState.height / 2;

}


// ============================================================
// SEARCH
// ============================================================

function setupSearch() {

    const searchBox =
        document.querySelector("#search");


    if (!searchBox) {

        console.warn(
            "#search was not found."
        );

        return;

    }


    searchBox.addEventListener(
        "input",
        () => {

            const value =
                searchBox.value
                    .trim()
                    .toLowerCase();


            if (!value) {

                showAllNodes();

                return;

            }


            mapState.nodeElements

                .attr(
                    "opacity",
                    node =>
                        nodeMatchesSearch(
                            node,
                            value
                        )
                            ? 1
                            : 0.12
                );


            mapState.labelElements

                .attr(
                    "opacity",
                    node =>
                        nodeMatchesSearch(
                            node,
                            value
                        )
                            ? 1
                            : 0.12
                );


            mapState.linkElements

                .attr(
                    "opacity",
                    link => {

                        const source =
                            getNodeFromLink(
                                link.source
                            );

                        const target =
                            getNodeFromLink(
                                link.target
                            );


                        if (
                            nodeMatchesSearch(
                                source,
                                value
                            ) ||
                            nodeMatchesSearch(
                                target,
                                value
                            )
                        ) {

                            return 0.65;

                        }


                        return 0.04;

                    }
                );

        }
    );

}


// ============================================================
// SEARCH MATCH
// ============================================================

function nodeMatchesSearch(node, value) {

    if (!node) {

        return false;

    }


    const name =
        String(node.name || "")
            .toLowerCase();


    const id =
        String(node.id || "")
            .toLowerCase();


    const type =
        String(node.type || "")
            .toLowerCase();


    const layer =
        String(node.layer || "")
            .toLowerCase();


    return (
        name.includes(value) ||
        id.includes(value) ||
        type.includes(value) ||
        layer.includes(value)
    );

}


// ============================================================
// SHOW ALL
// ============================================================

function showAllNodes() {

    mapState.nodeElements
        .attr(
            "opacity",
            1
        );


    mapState.labelElements
        .attr(
            "opacity",
            1
        );


    mapState.linkElements
        .attr(
            "opacity",
            0.65
        );

}


// ============================================================
// LAYER FILTERS
// ============================================================

function setupLayerFilters() {

    /*
     * HTML buttons can continue using:

         onclick="filterLayer('isp')"

     * because filterLayer is exposed globally below.
     */

}


// ============================================================
// GLOBAL FILTER FUNCTION
// ============================================================

window.filterLayer = function (layer) {

    if (!mapState.nodeElements) {

        return;

    }


    if (!layer || layer === "all") {

        showAllNodes();

        return;

    }


    const normalizedLayer =
        String(layer)
            .trim()
            .toLowerCase();


    // --------------------------------------------------------
    // NODES
    // --------------------------------------------------------

    mapState.nodeElements

        .attr(
            "opacity",
            node => {

                const nodeLayer =
                    String(node.layer || "")
                        .toLowerCase();


                return nodeLayer === normalizedLayer
                    ? 1
                    : 0.10;

            }
        );


    // --------------------------------------------------------
    // LABELS
    // --------------------------------------------------------

    mapState.labelElements

        .attr(
            "opacity",
            node => {

                const nodeLayer =
                    String(node.layer || "")
                        .toLowerCase();


                return nodeLayer === normalizedLayer
                    ? 1
                    : 0.10;

            }
        );


    // --------------------------------------------------------
    // LINKS
    // --------------------------------------------------------

    mapState.linkElements

        .attr(
            "opacity",
            link => {

                const source =
                    getNodeFromLink(
                        link.source
                    );

                const target =
                    getNodeFromLink(
                        link.target
                    );


                const sourceLayer =
                    String(
                        source?.layer || ""
                    ).toLowerCase();


                const targetLayer =
                    String(
                        target?.layer || ""
                    ).toLowerCase();


                if (
                    sourceLayer === normalizedLayer ||
                    targetLayer === normalizedLayer
                ) {

                    return 0.75;

                }


                return 0.04;

            }
        );

};


// ============================================================
// LINK NODE RESOLUTION
// ============================================================

function getNodeFromLink(value) {

    /*
     * d3.forceLink converts source/target IDs
     * into node objects.

     * During early initialization they may
     * still be strings.

     * Handle BOTH cases safely.
     */

    if (!value) {

        return null;

    }


    if (
        typeof value === "object" &&
        value.id
    ) {

        return value;

    }


    return mapState.nodeMap.get(
        value
    ) || null;

}


// ============================================================
// DETAILS PANEL
// ============================================================

function showDetails(event, node) {

    const details =
        document.querySelector("#details");


    if (!details || !node) {

        return;

    }


    const connectedNodes =
        getConnectedNodes(node);


    const connectionsHTML =

        connectedNodes.length

            ? connectedNodes
                .map(other => {

                    return `
                        <div class="connection">
                            <strong>
                                ${escapeHTML(
                                    other.name ||
                                    other.id
                                )}
                            </strong>
                            <span>
                                ${escapeHTML(
                                    other.layer ||
                                    "unknown"
                                )}
                            </span>
                        </div>
                    `;

                })
                .join("")

            : `
                <div class="connection">
                    No known connections
                </div>
            `;


    details.innerHTML = `

        <div class="node-details">

            <h2>
                ${escapeHTML(
                    node.name ||
                    node.id
                )}
            </h2>

            <div>
                <strong>Type</strong>
                <br>
                ${escapeHTML(
                    node.type ||
                    "Unknown"
                )}
            </div>

            <div>
                <strong>Layer</strong>
                <br>
                ${escapeHTML(
                    node.layer ||
                    "Unknown"
                )}
            </div>

            <div>
                <strong>Region</strong>
                <br>
                ${escapeHTML(
                    node.region ||
                    "Global"
                )}
            </div>

            <div>
                <strong>Importance</strong>
                <br>
                ${escapeHTML(
                    String(
                        node.importance ??
                        "Unknown"
                    )
                )}
            </div>

            <div>
                <strong>Network Role</strong>
                <br>
                ${escapeHTML(
                    node.network_role ||
                    ""
                )}
            </div>

            <div>
                <strong>Description</strong>
                <br>
                ${escapeHTML(
                    node.description ||
                    ""
                )}
            </div>

            <div>

                <strong>
                    Connected Infrastructure
                </strong>

                <div class="connections">

                    ${connectionsHTML}

                </div>

            </div>

        </div>

    `;

}


// ============================================================
// CONNECTED NODES
// ============================================================

function getConnectedNodes(node) {

    if (!node) {

        return [];

    }


    const results = [];

    const seen = new Set();


    mapState.links.forEach(link => {

        const source =
            getNodeFromLink(
                link.source
            );

        const target =
            getNodeFromLink(
                link.target
            );


        let other = null;


        if (
            source &&
            source.id === node.id
        ) {

            other = target;

        }

        else if (
            target &&
            target.id === node.id
        ) {

            other = source;

        }


        if (
            other &&
            !seen.has(other.id)
        ) {

            seen.add(
                other.id
            );

            results.push(
                other
            );

        }

    });


    return results;

}


// ============================================================
// HTML ESCAPING
// ============================================================

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// ============================================================
// RESET VIEW
// ============================================================

window.resetView = function () {

    if (
        !mapState.svg ||
        !mapState.zoom
    ) {

        return;

    }


    mapState.svg

        .transition()

        .duration(600)

        .call(
            mapState.zoom.transform,
            d3.zoomIdentity
        );

};


// ============================================================
// GLOBAL FUNCTIONS
// ============================================================

function setupGlobalFunctions() {

    /*
     * These functions intentionally live on
     * window because the existing HTML uses
     * inline onclick handlers.
     */

    window.resetView =
        window.resetView;

    window.filterLayer =
        window.filterLayer;

}


// ============================================================
// STATISTICS
// ============================================================

function updateStatistics() {

    const statsBox =
        document.querySelector("#stats");


    if (!statsBox) {

        return;

    }


    const nodes =
        mapState.nodes;


    const links =
        mapState.links;


    const regions =
        new Set(
            nodes
                .map(
                    node =>
                        node.region
                )
                .filter(Boolean)
        );


    const critical =
        nodes.filter(
            node =>
                Number(
                    node.importance
                ) >= 9
        )
        .length;


    statsBox.innerHTML = `

        <div>
            NODES:
            ${nodes.length}
        </div>

        <div>
            CONNECTIONS:
            ${links.length}
        </div>

        <div>
            REGIONS:
            ${regions.size}
        </div>

        <div>
            CRITICAL NODES:
            ${critical}
        </div>

    `;


    console.log(
        "Network Statistics",
        {
            nodes:
                nodes.length,

            links:
                links.length,

            regions:
                regions.size,

            critical:
                critical
        }
    );

}


// ============================================================
// ERROR HANDLING
// ============================================================

function handleMapError(error) {

    console.error(
        "MAP FAILURE:",
        error
    );


    const details =
        document.querySelector("#details");


    if (!details) {

        return;

    }


    details.innerHTML = `

        <div class="system-error">

            <h2>
                SYSTEM FAILURE
            </h2>

            <p>
                ${escapeHTML(
                    error.message ||
                    String(error)
                )}
            </p>

            <p>
                Check the browser console
                for additional information.
            </p>

        </div>

    `;

}

