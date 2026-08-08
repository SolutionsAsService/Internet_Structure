// ============================================
// PHYSICS ENGINE
// Internet Infrastructure Map
// ============================================

function createPhysics({
    nodes,
    links,
    width,
    height
}) {

    const centerX = width / 2;
    const centerY = height / 2;

    // --------------------------------------------
    // INITIAL POSITIONING
    // --------------------------------------------
    //
    // Give nodes a broad starting distribution.
    // This prevents the entire graph from spawning
    // directly on top of itself.
    //

    const radius =
        Math.min(width, height) * 0.38;

    nodes.forEach((node, i) => {

        const angle =
            (i / Math.max(nodes.length, 1)) *
            Math.PI * 2;

        // Small deterministic variation.
        const variation =
            0.90 + ((i % 7) * 0.025);

        node.x =
            centerX +
            Math.cos(angle) *
            radius *
            variation;

        node.y =
            centerY +
            Math.sin(angle) *
            radius *
            variation;

        // Clear any previous simulation state.
        node.vx = 0;
        node.vy = 0;

    });


    // --------------------------------------------
    // SIMULATION
    // --------------------------------------------

    const simulation =
        d3.forceSimulation(nodes)


            // ------------------------------------
            // CONNECTION FORCE
            // ------------------------------------
            //
            // Connected infrastructure stays
            // reasonably close together.
            //

            .force(
                "link",

                d3.forceLink(links)

                    .id(d => d.id)

                    .distance(190)

                    .strength(0.30)
            )


            // ------------------------------------
            // NODE REPULSION
            // ------------------------------------
            //
            // Prevents the map from becoming
            // one giant pile of circles.
            //

            .force(
                "charge",

                d3.forceManyBody()

                    .strength(-420)

                    .distanceMin(35)

                    .distanceMax(900)
            )


            // ------------------------------------
            // COLLISION
            // ------------------------------------
            //
            // Physical spacing between nodes.
            //

            .force(
                "collision",

                d3.forceCollide()

                    .radius(d => {

                        const nodeRadius =
                            ((d.importance || 5) * 2) + 8;

                        return nodeRadius + 25;

                    })

                    .strength(0.95)

                    .iterations(4)
            )


            // ------------------------------------
            // CENTERING
            // ------------------------------------
            //
            // Keeps the overall network together
            // without forcing everything into one
            // exact point.
            //

            .force(
                "x",

                d3.forceX(centerX)
                    .strength(0.018)
            )

            .force(
                "y",

                d3.forceY(centerY)
                    .strength(0.018)
            )


            // ------------------------------------
            // SIMULATION ENERGY
            // ------------------------------------

            .alpha(0.8)

            .alphaDecay(0.025)

            .velocityDecay(0.68);


    return {
        simulation,
        centerX,
        centerY
    };

}


// ============================================
// DRAG BEHAVIOR
// ============================================

function createDragBehavior(simulation) {

    return d3.drag()


        // ----------------------------------------
        // START
        // ----------------------------------------

        .on("start", function(event, d) {

            if (!event.active) {

                simulation
                    .alphaTarget(0.12)
                    .restart();

            }

            d.fx = d.x;
            d.fy = d.y;

        })


        // ----------------------------------------
        // MOVE
        // ----------------------------------------

        .on("drag", function(event, d) {

            d.fx = event.x;
            d.fy = event.y;

        })


        // ----------------------------------------
        // END
        // ----------------------------------------

        .on("end", function(event, d) {

            if (!event.active) {

                simulation
                    .alphaTarget(0);

            }

            // Release the node back into
            // the simulation.
            d.fx = null;
            d.fy = null;

        });

}


// ============================================
// RESET PHYSICS
// ============================================

function restartPhysics(simulation) {

    simulation
        .alpha(0.35)
        .restart();

}

