console.log("Internet Infrastructure Map Starting");


fetch("data/internet.json")

.then(response=>{

    if(!response.ok){

        throw new Error(
            "internet.json failed loading"
        );

    }

    return response.json();

})


.then(data=>{


console.log(
"Database Loaded",
data
);



const network =
document.querySelector("#network");


const details =
document.querySelector("#details");



if(!network){

throw new Error(
"#network missing"
);

}



let width =
network.clientWidth;


let height =
network.clientHeight;



if(width < 500){

width=1000;

}


if(height < 500){

height=700;

}



// =================================
// BUILD GRAPH
// =================================


const nodes =
data.nodes || [];



const nodeMap =
new Map();


nodes.forEach(node=>{

nodeMap.set(
node.id,
node
);

});



const links=[];



nodes.forEach(node=>{


if(!node.connections)
return;



node.connections.forEach(connection=>{


if(nodeMap.has(connection)){


links.push({

source:node.id,

target:connection

});


}


else{


console.warn(

"Missing connection:",

node.id,

"->",

connection

);


}



});



});



console.log(
"Nodes",
nodes.length
);


console.log(
"Links",
links.length
);





// =================================
// COLORS
// =================================

const layerColors = {

    // ==============================
    // PHYSICAL / FACILITIES
    // ==============================

    physical: "#6B7280",
    power: "#F59E0B",
    datacenter: "#8B5CF6",
    colocation: "#A78BFA",
    edge: "#7C3AED",
    pop: "#8B5CF6",

    // ==============================
    // CONNECTIVITY
    // ==============================

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

    // ==============================
    // INTERNET EXCHANGE
    // ==============================

    ixp: "#06B6D4",
    route_server: "#0891B2",
    peering: "#0E7490",
    internet_exchange_fabric: "#155E75",
    internet_exchange_operator: "#06B6D4",

    // ==============================
    // ROUTING
    // ==============================

    routing: "#3B82F6",
    routing_security: "#2563EB",
    routing_measurement: "#1D4ED8",
    routing_software: "#2563EB",
    network_operations: "#1E40AF",
    network_automation: "#4F46E5",

    // ==============================
    // DNS
    // ==============================

    dns: "#F97316",
    dns_root: "#EA580C",
    dns_authoritative: "#C2410C",
    dns_recursive: "#9A3412",
    dns_registry: "#7C2D12",

    // ==============================
    // ADDRESSING / COORDINATION
    // ==============================

    registry: "#14B8A6",
    rir: "#0D9488",
    rir_database: "#0F766E",
    internet_coordination: "#14B8A6",
    internet_governance: "#0D9488",
    standards: "#0F766E",
    web_standards: "#115E59",

    // ==============================
    // CDN / EDGE
    // ==============================

    cdn: "#EC4899",
    edge_compute: "#DB2777",
    web_acceleration: "#BE185D",
    anycast: "#F43F5E",
    geodns: "#E11D48",

    // ==============================
    // CLOUD / COMPUTE
    // ==============================

    cloud: "#6366F1",
    compute: "#4F46E5",
    gpu_compute: "#4338CA",
    server: "#3730A3",
    storage: "#312E81",

    // ==============================
    // NETWORK HARDWARE
    // ==============================

    network_hardware: "#64748B",
    router: "#475569",
    switching: "#334155",
    firewall: "#1E293B",
    load_balancing: "#0F172A",

    // ==============================
    // OPTICAL / FIBER
    // ==============================

    optical: "#EAB308",
    fiber: "#CA8A04",
    longhaul: "#A16207",
    metro: "#854D0E",
    optical_transport: "#713F12",

    // ==============================
    // SUBMARINE
    // ==============================

    submarine: "#090088",
    subsea: "#090088",
    cable_landing: "#0369A1",
    submarine_operator: "#075985",

    // ==============================
    // SATELLITE
    // ==============================

    satellite: "#FFBF00",
    leo: "#7C3AED",
    geo_satellite: "#6D28D9",
    ground_station: "#5B21B6",
    satellite_ground: "#7C3AED",

    // ==============================
    // MOBILE
    // ==============================

    mobile_core: "#84CC16",
    radio_access: "#65A30D",
    cell_tower: "#4D7C0F",
    spectrum: "#9333EA",

    // ==============================
    // SECURITY
    // ==============================

    security: "#EF4444",
    ddos: "#DC2626",
    waf: "#B91C1C",
    incident_response: "#991B1B",

    // ==============================
    // PKI
    // ==============================

    pki: "#EF4444",
    certificate_authority: "#DC2626",
    certificate_transparency: "#B91C1C",

    // ==============================
    // TIME
    // ==============================

    time: "#FACC15",
    ntp: "#EAB308",
    ptp: "#CA8A04",
    gps_timing: "#A16207",

    // ==============================
    // RESEARCH / MEASUREMENT
    // ==============================

    research_network: "#A855F7",
    national_research: "#9333EA",
    measurement: "#D946EF",
    topology: "#C026D3",
    traffic_measurement: "#A21CAF",

    // ==============================
    // SOFTWARE
    // ==============================

    ixp_software: "#0891B2",
    server_oem: "#64748B",
    server_odm: "#475569",
    storage_hardware: "#334155",

    // ==============================
    // SEMICONDUCTORS
    // ==============================

    semiconductor: "#F43F5E",
    semiconductor_design: "#E11D48",
    semiconductor_fab: "#BE123C",
    semiconductor_equipment: "#9F1239",
    semiconductor_materials: "#881337",
    chip_packaging: "#701A75",

    memory: "#1E293B",

    // ==============================
    // ELECTRONICS
    // ==============================

    pcb: "#78716C",
    electronics_manufacturing: "#57534E",

    // ==============================
    // POWER / COOLING
    // ==============================

    cooling: "#06B6D4",
    liquid_cooling: "#0891B2",
    backup_power: "#F59E0B",
    generator: "#D97706",
    ups: "#B45309",

    // ==============================
    // PHYSICAL OPERATIONS
    // ==============================

    physical_security: "#52525B",
    construction: "#71717A",
    fiber_construction: "#A1A1AA",
    tower_infrastructure:"#84CC16",

    // ==============================
    // GOVERNMENT / CRITICAL INFRA
    // ==============================

    government_network: "#475569",
    critical_infrastructure: "#334155",

    // ==============================
    // CONTENT
    // ==============================

    content_provider: "#EC4899",
    application: "#F43F5E",

    // ==============================
    // OPERATORS
    // ==============================

    network_operator: "#10B981",


    
    content_provider:"#EC4899",
    telecom_equipment:"#64748B"
      
};



// =================================
// SVG
// =================================


const svg = d3.select(network)

.append("svg")

.attr(
"width",
"100%"
)

.attr(
"height",
"100%"
);





// THIS IS THE IMPORTANT FIX


const viewport =

svg.append("g")

.attr(
"class",
"viewport"
);


// Zoom everything

// =================================
// ZOOM
// =================================

const zoom =
    d3.zoom()
        .scaleExtent([0.2, 4])
        .on("zoom", event => {

            viewport.attr(
                "transform",
                event.transform
            );

        });

svg.call(zoom);


svg.call(
    zoom.transform,
    d3.zoomIdentity
        .translate(0, 0)
        .scale(0.7)
);


// groups INSIDE viewport


const linkLayer =

viewport.append("g")
.attr(
"class",
"links"
);



const nodeLayer =

viewport.append("g")
.attr(
"class",
"nodes"
);



const labelLayer =

viewport.append("g")
.attr(
"class",
"labels"
);



// =================================
// FORCE SIMULATION
// =================================

const centerX = width / 2;
const centerY = height / 2;


// ---------------------------------
// INITIAL NODE POSITIONS
// ---------------------------------

const initialRadius =
    Math.min(width, height) * 0.32;

nodes.forEach((node, i) => {

    const angle =
        (i / Math.max(nodes.length, 1)) *
        Math.PI * 2;

    const radius =
        initialRadius *
        (0.75 + Math.random() * 0.35);

    node.x =
        centerX +
        Math.cos(angle) * radius;

    node.y =
        centerY +
        Math.sin(angle) * radius;

});


// ---------------------------------
// FORCE SIMULATION
// ---------------------------------

const simulation =
    d3.forceSimulation(nodes)

        // Connected nodes stay reasonably close
        // without creating a giant pile.
        .force(
            "link",

            d3.forceLink(links)

                .id(d => d.id)

                .distance(180)

                .strength(0.45)
        )


        // Moderate node repulsion.
        .force(
            "charge",

            d3.forceManyBody()

                .strength(-300)

                .distanceMin(40)

                .distanceMax(750)
        )


        // Keep the graph centered.
        .force(
            "center",

            d3.forceCenter(
                centerX,
                centerY
            )
        )


        // Give every circle physical space.
        .force(
            "collision",

            d3.forceCollide()

                .radius(d => {

                    const visualRadius =
                        ((d.importance || 5) * 2) + 8;

                    return visualRadius + 18;

                })

                .strength(0.9)

                .iterations(3)
        )


        // Very gentle centering forces.
        .force(
            "x",

            d3.forceX(centerX)
                .strength(0.012)
        )

        .force(
            "y",

            d3.forceY(centerY)
                .strength(0.012)
        )


        // Smooth startup.
        .alpha(0.65)

        .alphaDecay(0.018)

        .velocityDecay(0.60);

        // ---------------------------------
        // NODE REPULSION
        // ---------------------------------

        .force(
            "charge",

            d3.forceManyBody()

                // More space between nodes.
                .strength(-300)

                // Prevent extremely close
                // nodes from behaving violently.
                .distanceMin(40)

                // Don't allow distant nodes
                // to influence each other.
                .distanceMax(750)
        )


        // ---------------------------------
        // CENTER
        // ---------------------------------

        .force(
            "center",

            d3.forceCenter(
                centerX,
                centerY
            )
        )


        // ---------------------------------
        // COLLISION
        // ---------------------------------

        .force(
            "collision",

            d3.forceCollide()

                // Physical space around each
                // circle.
                .radius(d => {

                    const visualRadius =
                        ((d.importance || 5) * 2) + 8;

                    return visualRadius + 18;

                })

                .strength(0.9)

                .iterations(3)
        )


        // ---------------------------------
        // GENTLE CENTERING
        // ---------------------------------

        .force(
            "x",

            d3.forceX(centerX)

                // Very gentle.
                .strength(0.012)
        )

        .force(
            "y",

            d3.forceY(centerY)

                .strength(0.012)
        )


        // ---------------------------------
        // SIMULATION ENERGY
        // ---------------------------------

        // Start with moderate energy.
        .alpha(0.65)

        // Let the graph settle slowly.
        .alphaDecay(0.018)

        // Heavy damping makes movement
        // smooth rather than twitchy.
        .velocityDecay(0.60);


// =================================
// LINKS
// =================================


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

d=>{

return 1.5;

}

)

.attr(

"opacity",

0.7

);







// =================================
// NODES
// =================================



const nodeElements =


nodeLayer

.selectAll("circle")

.data(nodes)

.enter()

.append("circle")





.attr(

"r",

d=>{


return (

(d.importance || 5)

*2

)+8;


}

)





.attr(

"fill",

d=>{


return (

layerColors[d.layer]

||

"#888"

);


}

)





.attr(

"stroke",

"#000"

)



.attr(

"stroke-width",

2





)





// glow effect

.style(

"filter",

"drop-shadow(0px 0px 8px currentColor)"

)





.on(

"mouseenter",

function(){

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

function(){

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

)





.call(


d3.drag()

.on(

"start",

dragStart

)

.on(

"drag",

dragMove

)

.on(

"end",

dragEnd

)



);







// =================================
// LABELS
// =================================



const labelElements =


labelLayer

.selectAll("text")

.data(nodes)

.enter()

.append("text")

.text(

d=>d.name

)



.attr(

"fill",

"#d0d7de"

)



.attr(

"font-size",

d=>{


if((d.importance||0)>=9)

return "14px";


return "11px";


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







// =================================
// SIMULATION UPDATE LOOP
// =================================


simulation.on(

"tick",

()=>{



linkElements



.attr(

"x1",

d=>d.source.x

)



.attr(

"y1",

d=>d.source.y

)



.attr(

"x2",

d=>d.target.x

)



.attr(

"y2",

d=>d.target.y

);







nodeElements



.attr(

"cx",

d=>d.x

)



.attr(

"cy",

d=>d.y

);






labelElements



.attr(

"x",

d=>d.x

)



.attr(

"y",

d=>d.y-35

);


});




// =================================
// DRAG FUNCTIONS
// =================================

function dragStart(event, d) {

    if (!event.active) {

        simulation
            .alphaTarget(0.08)
            .restart();

    }

    d.fx = d.x;
    d.fy = d.y;

}


function dragMove(event, d) {

    // Smoothly follow the cursor.
    d.fx = event.x;
    d.fy = event.y;

}


function dragEnd(event, d) {

    if (!event.active) {

        simulation
            .alphaTarget(0);

    }

    d.fx = null;
    d.fy = null;

}

// =================================
// DETAILS PANEL
// =================================


function showDetails(event,d){


const connected = links

.filter(link=>{


return (

link.source.id === d.id ||

link.target.id === d.id

);


})

.map(link=>{


let other;


if(link.source.id === d.id)

{

other = link.target;

}

else

{

other = link.source;

}



return `

<div class="connection">

<strong>

${other.name}

</strong>

<br>

<span>

${other.layer}

</span>

</div>


`;



})

.join("");






details.innerHTML = `


<div class="intel-card">


<h2>

${d.name}

</h2>



<div class="tag">

${d.type}

</div>



<hr>


<p>

<b>Layer</b>

<br>

${d.layer}

</p>



<p>

<b>Region</b>

<br>

${d.region || "Global"}

</p>



<p>

<b>Importance Score</b>

<br>

${d.importance || "Unknown"}

</p>




<p>

<b>Network Role</b>

<br>

${d.network_role || ""}

</p>





<p>

${d.description || ""}

</p>





<h3>

Connected Infrastructure

</h3>


<div>

${

connected ||

"No known connections"

}

</div>


</div>


`;


}


// =================================
// SEARCH SYSTEM
// =================================


const searchBox =
document.querySelector("#search");



if(searchBox){


searchBox.addEventListener(

"input",

()=>{


const value =

searchBox.value

.toLowerCase();




nodeElements

.attr(

"opacity",

d=>{


if(

d.name

.toLowerCase()

.includes(value)

)

return 1;



return 0.15;



}

);



labelElements

.attr(

"opacity",

d=>{


if(

d.name

.toLowerCase()

.includes(value)

)

return 1;


return 0.15;



}

);



}



);



}










// =================================
// LAYER FILTERS
// =================================


window.filterLayer=function(layer){



nodeElements.attr(

"opacity",

d=>{


if(layer==="all")

return 1;



return d.layer===layer

?1

:0.1;



}

);




labelElements.attr(

"opacity",

d=>{


if(layer==="all")

return 1;



return d.layer===layer

?1

:0.1;



}

);




linkElements.attr(

"opacity",

d=>{


if(layer==="all")

return .7;



if(

d.source.layer===layer ||

d.target.layer===layer

)

return .8;



return .05;



}

);



}









// =================================
// RESET CAMERA
// =================================


window.resetView = function() {

    svg
        .transition()
        .duration(750)
        .call(
            zoom.transform,
            d3.zoomIdentity
        );

};




// =================================
// DATABASE STATISTICS
// =================================


const stats = {


nodes:nodes.length,


links:links.length,


regions:

new Set(

nodes.map(

d=>d.region

)

)

.size,



critical:

nodes.filter(

d=>

(d.importance||0)>=9

)

.length



};




console.log(

"Network Statistics",

stats

);







const statsBox =

document.querySelector("#stats");



if(statsBox){


statsBox.innerHTML=`

<div>

NODES:

${stats.nodes}

</div>


<div>

CONNECTIONS:

${stats.links}

</div>


<div>

REGIONS:

${stats.regions}

</div>


<div>

CRITICAL NODES:

${stats.critical}

</div>

`;


}





// =================================
// INITIAL CAMERA POSITION
// =================================



svg.call(

d3.zoom()

.transform,

d3.Identity

.translate(

width/2,

height/2

)

.scale(

0.7

)

);





console.log(

"Internet Infrastructure Map Ready"

);



})



.catch(error=>{


console.error(

"MAP FAILURE:",

error

);



const details =
document.querySelector("#details");



if(details){


details.innerHTML=`

<div class="intel-card">

<h2>

SYSTEM FAILURE

</h2>


<p>

${error.message}

</p>


</div>

`;

}



});
