
fetch(
"data/internet.json"
)

.then(r=>r.json())

.then(data=>{


const width =
document
.querySelector("#network")
.clientWidth;


const height =
document
.querySelector("#network")
.clientHeight;



const svg =
d3.select("#network")
.append("svg")
.attr("width",width)
.attr("height",height);



const simulation =
d3.forceSimulation(data.nodes)

.force(
"link",
d3.forceLink(data.links)
.id(d=>d.id)
.distance(180)
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
);



const links =
svg.selectAll("line")

.data(data.links)

.enter()

.append("line");




const nodes =
svg.selectAll("circle")

.data(data.nodes)

.enter()

.append("circle")

.attr("r",18)

.attr(
"fill",
d=>{

if(d.layer==="Cloud Provider")
return "#ff9900";

if(d.layer==="Edge Network")
return "#00ff88";

if(d.layer==="IXP")
return "#00aaff";

return "#aaaaaa";

}

)

.call(

d3.drag()

.on(
"start",
dragstarted
)

.on(
"drag",
dragged
)

.on(
"end",
dragended
)

);



nodes.on(
"click",

(event,d)=>{


document
.querySelector("#details")
.innerHTML=

`

<div class="card">

<div class="node-title">

${d.name}

</div>


<p>
TYPE:
${d.type}
</p>


<p>
LAYER:
${d.layer}
</p>


<p>
${d.description}
</p>


</div>

`;


}

);



simulation.on(
"tick",

()=>{


links

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



nodes

.attr(
"cx",
d=>d.x
)

.attr(
"cy",
d=>d.y
);



}

);



function dragstarted(event,d){

if(!event.active)
simulation.alphaTarget(.3).restart();

d.fx=d.x;
d.fy=d.y;

}



function dragged(event,d){

d.fx=event.x;
d.fy=event.y;

}



function dragended(event,d){

if(!event.active)
simulation.alphaTarget(0);

d.fx=null;
d.fy=null;

}


});
