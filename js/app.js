fetch("data/internet.json")

.then(response => {

    if(!response.ok){

        throw new Error(
            "Could not load internet.json"
        );

    }

    return response.json();

})


.then(data=>{


console.log(
    "Loaded Infrastructure Database:",
    data
);



const network =
document.querySelector("#network");


if(!network){

    throw new Error(
        "Missing #network element"
    );

}



const width =
network.clientWidth || 1000;


const height =
network.clientHeight || 700;



// --------------------------------------
// CLEAN DATA
// --------------------------------------


const nodes =
data.nodes || [];

let links=[];

const nodeIds = new Set(
    nodes.map(n=>n.id)
);


nodes.forEach(node=>{

    if(!node.connections)
        return;


    node.connections.forEach(target=>{


        if(nodeIds.has(target)){


            links.push({

                source:node.id,

                target:target

            });


        }
        else{

            console.warn(
                "Missing node:",
                target,
                "referenced by",
                node.id
            );

        }


    });


});




const nodeMap =
new Map(
    nodes.map(
        node=>[
            node.id,
            node
        ]
    )
);



// Remove broken links automatically

links =
links.filter(link=>{


    const sourceExists =
    nodeMap.has(link.source);


    const targetExists =
    nodeMap.has(link.target);


    if(!sourceExists || !targetExists){

        console.warn(
            "Removing invalid link:",
            link
        );

    }


    return sourceExists && targetExists;


});



console.log(
    "Nodes:",
    nodes.length
);


console.log(
    "Valid Links:",
    links.length
);



// --------------------------------------
// COLORS
// --------------------------------------


const colors={

physical:"#777",

colocation:"#00aaff",

backbone:"#ff9900",

carrier:"#ff4444",

isp:"#00dddd",

mobile:"#00ff88",

satellite:"#ffff00",

ixp:"#cc44ff",

cloud:"#3399ff"

};



// --------------------------------------
// SVG
// --------------------------------------


const svg =
d3.select("#network")
.append("svg")
.attr("width",width)
.attr("height",height);



const container =
svg.append("g");



svg.call(

d3.zoom()

.scaleExtent([0.2,5])

.on(
"zoom",
(event)=>{

container.attr(
"transform",
event.transform
);

}

)

);

container.append("g")

.attr(
"width",
width
)

.attr(
"height",
height
);




// --------------------------------------
// SIMULATION
// --------------------------------------


const simulation =

d3.forceSimulation(nodes)

.force(

"link",

d3.forceLink(links)

.id(
d=>d.id
)

.distance(150)

)


.force(

"charge",

d3.forceManyBody()

.strength(-500)

)


.force(

"center",

d3.forceCenter(
width/2,
height/2
)

)



.force(

"collision",

d3.forceCollide()

.radius(35)

);




    

// --------------------------------------
// CONNECTION LINES
// --------------------------------------


const linkGroup =
svg.append("g");


const linkElements =

linkGroup

.selectAll("line")

.data(links)

.enter()

.append("line")

.attr(
"stroke",
"#345"
)

.attr(
"stroke-width",
2
);





// --------------------------------------
// NODES
// --------------------------------------


const nodeGroup =
svg.append("g");



const nodeElements =

nodeGroup

.selectAll("circle")

.data(nodes)

.enter()

.append("circle")


.attr(
"r",
20
)


.attr(
"fill",
d=>

colors[d.layer]
||
"#999"

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




// --------------------------------------
// LABELS
// --------------------------------------


const labels =


svg.append("g")

.selectAll("text")

.data(nodes)

.enter()

.append("text")


.text(
d=>d.name
)


.attr(
"fill",
"#ddd"
)


.attr(
"font-size",
12
)


.attr(
"text-anchor",
"middle"
);





// --------------------------------------
// UPDATE LOOP
// --------------------------------------


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



labels

.attr(
"x",
d=>d.x
)

.attr(
"y",
d=>d.y-30
);



});


 



// --------------------------------------
// SIDEBAR
// --------------------------------------


function showDetails(event,d){



const connections = links

.filter(

link=>

link.source.id===d.id ||

link.target.id===d.id

)



.map(link=>{


let other;


if(link.source.id===d.id)

other=link.target.name;

else

other=link.source.name;



return `

<li>

${other}

<br>

<small>

${link.relationship || "connection"}

</small>

</li>

`;

})


.join("");





document.querySelector("#details")

.innerHTML=`

<div class="card">

<h2>

${d.name}

</h2>


<p>

<b>Type:</b><br>

${d.type || ""}

</p>


<p>

<b>Layer:</b><br>

${d.layer}

</p>


<p>

<b>Region:</b><br>

${d.region || ""}

</p>


<p>

${d.description || ""}

</p>


<h3>

Connections

</h3>


<ul>

${connections || "None"}

</ul>


</div>

`;

}



// --------------------------------------
// DRAGGING
// --------------------------------------


function dragStart(event,d){

if(!event.active)

simulation.alphaTarget(.3).restart();


d.fx=d.x;
d.fy=d.y;

}



function dragMove(event,d){

d.fx=event.x;
d.fy=event.y;

}



function dragEnd(event,d){

if(!event.active)

simulation.alphaTarget(0);


d.fx=null;
d.fy=null;

}



})


.catch(error=>{


console.error(
error
);



document.querySelector("#details")

.innerHTML=

`

<div class="card">

<h2>
SYSTEM ERROR
</h2>


<p>
${error.message}
</p>

</div>

`;


});
