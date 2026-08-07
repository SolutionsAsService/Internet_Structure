fetch("data/internet.json")
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to load internet.json");
        }
        return response.json();
    })
    .then(data => {

        const nodeIds = new Set(data.nodes.map(n => n.id));

const invalidLinks = data.links.filter(link =>
    !nodeIds.has(link.source) || !nodeIds.has(link.target)
);

if (invalidLinks.length) {

    console.error("Invalid links found:");

    console.table(invalidLinks);

    throw new Error(
        `${invalidLinks.length} links reference missing nodes.`
    );

}

        console.log("Infrastructure Loaded", data);

        const network = document.querySelector("#network");

        const width = network.clientWidth;
        const height = network.clientHeight;

        const layerColors = {

            physical: "#666666",

            colocation: "#2ec4ff",

            backbone: "#ff9800",

            carrier: "#ff5555",

            isp: "#55ddff",

            mobile: "#3cff88",

            satellite: "#ffe44d",

            ixp: "#d34fff",

            cloud: "#3ea6ff"

        };

        //-------------------------------------------------
        // SVG
        //-------------------------------------------------

        const svg = d3
            .select("#network")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        //-------------------------------------------------
        // FORCE SIMULATION
        //-------------------------------------------------

        const simulation = d3
            .forceSimulation(data.nodes)

            .force(
                "link",
                d3.forceLink(data.links)
                    .id(d => d.id)
                    .distance(170)
            )

            .force(
                "charge",
                d3.forceManyBody()
                    .strength(-900)
            )

            .force(
                "center",
                d3.forceCenter(width / 2, height / 2)
            )

            .force(
                "collision",
                d3.forceCollide()
                    .radius(35)
            );

        //-------------------------------------------------
        // LINKS
        //-------------------------------------------------

        const links = svg

            .append("g")

            .selectAll("line")

            .data(data.links)

            .enter()

            .append("line")

            .attr("stroke", "#38556c")

            .attr("stroke-width", 2)

            .attr("opacity", 0.7);

        //-------------------------------------------------
        // NODES
        //-------------------------------------------------

        const nodes = svg

            .append("g")

            .selectAll("circle")

            .data(data.nodes)

            .enter()

            .append("circle")

            .attr("r", 18)

            .attr("fill", d => layerColors[d.layer] || "#888")

            .attr("stroke", "#111")

            .attr("stroke-width", 2)

            .call(

                d3.drag()

                    .on("start", dragStarted)

                    .on("drag", dragged)

                    .on("end", dragEnded)

            );

        //-------------------------------------------------
        // LABELS
        //-------------------------------------------------

        const labels = svg

            .append("g")

            .selectAll("text")

            .data(data.nodes)

            .enter()

            .append("text")

            .text(d => d.name)

            .attr("font-size", 11)

            .attr("fill", "#cfd8dc")

            .attr("text-anchor", "middle")

            .attr("pointer-events", "none");

        //-------------------------------------------------
        // CLICK EVENTS
        //-------------------------------------------------

        nodes.on("click", (event, d) => {

            const connected = data.links

                .filter(link =>

                    link.source.id === d.id ||

                    link.target.id === d.id ||

                    link.source === d.id ||

                    link.target === d.id

                )

                .map(link => {

                    const other =

                        (link.source.id || link.source) === d.id

                            ? (link.target.name || link.target)

                            : (link.source.name || link.source);

                    return `
                        <li>
                            ${other}
                            <br>
                            <small>${link.relationship || "Connected"}</small>
                        </li>
                    `;

                })

                .join("");

            document.querySelector("#details").innerHTML = `

                <div class="card">

                    <div class="node-title">

                        ${d.name}

                    </div>

                    <hr>

                    <p><strong>Type</strong><br>${d.type || "-"}</p>

                    <p><strong>Layer</strong><br>${d.layer}</p>

                    <p><strong>Region</strong><br>${d.region || "-"}</p>

                    <p>${d.description || ""}</p>

                    <h3>Connections</h3>

                    <ul>

                        ${connected || "<li>No known relationships.</li>"}

                    </ul>

                </div>

            `;

        });

        //-------------------------------------------------
        // TICK
        //-------------------------------------------------

        simulation.on("tick", () => {

            links

                .attr("x1", d => d.source.x)

                .attr("y1", d => d.source.y)

                .attr("x2", d => d.target.x)

                .attr("y2", d => d.target.y);

            nodes

                .attr("cx", d => d.x)

                .attr("cy", d => d.y);

            labels

                .attr("x", d => d.x)

                .attr("y", d => d.y - 24);

        });

        //-------------------------------------------------
        // DRAG
        //-------------------------------------------------

        function dragStarted(event, d) {

            if (!event.active)
                simulation.alphaTarget(0.3).restart();

            d.fx = d.x;
            d.fy = d.y;

        }

        function dragged(event, d) {

            d.fx = event.x;
            d.fy = event.y;

        }

        function dragEnded(event, d) {

            if (!event.active)
                simulation.alphaTarget(0);

            d.fx = null;
            d.fy = null;

        }

    })

    .catch(error => {

        console.error(error);

        document.querySelector("#details").innerHTML = `
            <div class="card">
                <h2>Error Loading Data</h2>
                <p>${error.message}</p>
            </div>
        `;

    });
