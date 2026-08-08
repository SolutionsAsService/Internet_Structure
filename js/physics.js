// ============================================
// PHYSICS ENGINE
// Internet Infrastructure Map
// D3 Force Simulation
// ============================================
//
// Design goals:
//
// 1. Connected infrastructure pulls together.
// 2. Unrelated infrastructure pushes apart.
// 3. The graph occupies the available canvas.
// 4. The center does NOT become a giant pile.
// 5. Movement feels smooth and organic.
// 6. Large networks form recognizable clusters.
// 7. Dragging feels natural.
// 8. The simulation settles instead of jittering forever.
//
// This file intentionally contains NO colors.
// Visual styling belongs in colors.js.
//
// ============================================


// ============================================
// CREATE PHYSICS
// ============================================

function createPhysics({
    nodes,
    links,
    width,
    height
}) {

    const centerX = width / 2;
    const centerY = height / 2;

    const graphSize = Math.min(width, height);

    // ----------------------------------------
    // NODE SIZE
    // ----------------------------------------

    function nodeRadius(d) {

        const importance =
            Number(d.importance) || 5;

        return Math.max(
            7,
            Math.min(
                28,
                7 + importance * 1.8
            )
        );
    }


    // ----------------------------------------
    // INITIAL POSITIONING
    // ----------------------------------------
    //
    // Do NOT start everything at the center.
    //
    // Use a deterministic pseudo-random
    // distribution across the canvas.
    //
    // This makes large datasets immediately
    // readable before the simulation settles.
    //

    const padding = Math.max(
        80,
        graphSize * 0.08
    );

    const usableWidth =
        Math.max(
            200,
            width - padding * 2
        );

    const usableHeight =
        Math.max(
            200,
            height - padding * 2
        );


    // Deterministic pseudo-random generator.
    //
    // This gives stable layouts between reloads
    // without using Math.random().

    function seeded(index) {

        const value =
            Math.sin(index * 12.9898) *
            43758.5453;

        return value - Math.floor(value);

    }


    nodes.forEach((node, i) => {

        const horizontal =
            seeded(i + 17);

        const vertical =
            seeded(i + 91);

        const jitterX =
            (seeded(i + 151) - 0.5) *
            80;

        const jitterY =
            (seeded(i + 231) - 0.5) *
            80;


        node.x =
            padding +
            horizontal * usableWidth +
            jitterX;

        node.y =
            padding +
            vertical * usableHeight +
            jitterY;


        // Keep initial positions inside canvas.

        node.x =
            Math.max(
                padding,
                Math.min(
                    width - padding,
                    node.x
                )
            );

        node.y =
            Math.max(
                padding,
                Math.min(
                    height - padding,
                    node.y
                )
            );


        // Clear previous simulation state.

        node.vx = 0;
        node.vy = 0;

        node.fx = null;
        node.fy = null;

    });


    // ========================================
    // SIMULATION
    // ========================================

    const simulation =
        d3.forceSimulation(nodes);


    // ========================================
    // CONNECTION FORCE
    // ========================================
    //
    // THIS is the important part.
    //
    // Connected nodes should visibly want to
    // live near one another.
    //
    // Stronger than the previous 0.30.
    //

    simulation.force(
        "link",

        d3.forceLink(links)

            .id(d => d.id)

            // Long enough to see infrastructure
            // relationships clearly.

            .distance(link => {

                // Allow individual links to specify
                // their preferred distance.

                if (
                    typeof link.distance === "number"
                ) {
                    return link.distance;
                }

                // More important relationships get
                // slightly more visual space.

                const sourceImportance =
                    Number(
                        link.source?.importance
                    ) || 5;

                const targetImportance =
                    Number(
                        link.target?.importance
                    ) || 5;

                const importance =
                    (
                        sourceImportance +
                        targetImportance
                    ) / 2;


                return Math.max(
                    110,
                    Math.min(
                        240,
                        175 + importance * 4
                    )
                );

            })

            // Strong attraction.

            .strength(link => {

                // Explicit link strength wins.

                if (
                    typeof link.strength === "number"
                ) {
                    return link.strength;
                }

                return 0.72;

            })

            .iterations(2)
    );


    // ========================================
    // NODE REPULSION
    // ========================================
    //
    // Nodes that are NOT connected should have
    // plenty of room between them.
    //
    // This creates the "network breathing"
    // effect.
    //

    simulation.force(
        "charge",

        d3.forceManyBody()

            .strength(d => {

                const importance =
                    Number(d.importance) || 5;

                // Important nodes get more
                // repulsive space.

                return -520 -
                    importance * 35;

            })

            .distanceMin(30)

            .distanceMax(
                Math.max(
                    700,
                    graphSize * 1.4
                )
            )

            .theta(0.85)
    );


    // ========================================
    // COLLISION
    // ========================================
    //
    // Keeps nodes visually separated without
    // making them behave like hard billiard balls.
    //

    simulation.force(
        "collision",

        d3.forceCollide()

            .radius(d =>
                nodeRadius(d) + 18
            )

            .strength(0.75)

            .iterations(3)
    );


    // ========================================
    // WEAK CENTER GRAVITY
    // ========================================
    //
    // IMPORTANT:
    //
    // The old center force was part of why the
    // network wanted to collapse into the middle.
    //
    // Keep this VERY weak.
    //
    // It acts as a safety net rather than a
    // primary positioning force.
    //

    simulation.force(
        "x",

        d3.forceX(centerX)
            .strength(0.004)
    );

    simulation.force(
        "y",

        d3.forceY(centerY)
            .strength(0.004)
    );


    // ========================================
    // OUTER BOUNDARY
    // ========================================
    //
    // Keeps the graph from permanently flying
    // outside the visible map.
    //
    // This is implemented as a custom force
    // instead of a hard clamp.
    //

    function boundaryForce() {

        const margin = 70;

        const strength = 0.035;

        for (const node of nodes) {

            if (node.fx != null) {
                continue;
            }

            if (node.x < margin) {

                node.vx +=
                    (margin - node.x) *
                    strength;

            }

            else if (
                node.x >
                width - margin
            ) {

                node.vx +=
                    (
                        width -
                        margin -
                        node.x
                    ) *
                    strength;

            }


            if (node.y < margin) {

                node.vy +=
                    (margin - node.y) *
                    strength;

            }

            else if (
                node.y >
                height - margin
            ) {

                node.vy +=
                    (
                        height -
                        margin -
                        node.y
                    ) *
                    strength;

            }

        }

    }


    simulation.force(
        "boundary",
        boundaryForce
    );


    // ========================================
    // SIMULATION ENERGY
    // ========================================
    //
    // Higher starting energy lets the network
    // actually reorganize itself.
    //

    simulation
        .alpha(1)

        // Slower cooling = more time for the
        // network to find a good arrangement.

        .alphaDecay(0.018)

        // Damping.
        //
        // Lower = more movement.
        // Higher = smoother / calmer.

        .velocityDecay(0.72);


    // ========================================
    // INITIAL KICK
    // ========================================
    //
    // Give the network a small initial motion
    // so the force system starts breathing.
    //

    nodes.forEach((node, i) => {

        const angle =
            seeded(i + 500) *
            Math.PI *
            2;

        const velocity =
            0.4 +
            seeded(i + 700) * 0.7;

        node.vx =
            Math.cos(angle) *
            velocity;

        node.vy =
            Math.sin(angle) *
            velocity;

    });


    // ========================================
    // RETURN ENGINE
    // ========================================

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

        // ====================================
        // START
        // ====================================

        .on("start", function(event, d) {

            if (!event.active) {

                simulation
                    .alphaTarget(0.22)
                    .restart();

            }


            d.fx = d.x;
            d.fy = d.y;

            // Remember previous velocity.

            d.__dragVx =
                d.vx || 0;

            d.__dragVy =
                d.vy || 0;

        })


        // ====================================
        // MOVE
        // ====================================

        .on("drag", function(event, d) {

            d.fx = event.x;
            d.fy = event.y;


            // Kill excessive velocity while
            // directly dragging the node.

            d.vx *= 0.35;
            d.vy *= 0.35;

        })


        // ====================================
        // END
        // ====================================

        .on("end", function(event, d) {

            if (!event.active) {

                simulation
                    .alphaTarget(0);

            }


            // Release the node.

            d.fx = null;
            d.fy = null;


            // Give the node a tiny amount of
            // inherited motion so releasing it
            // doesn't feel like hitting a wall.

            d.vx =
                Math.max(
                    -2,
                    Math.min(
                        2,
                        d.vx || d.__dragVx || 0
                    )
                );

            d.vy =
                Math.max(
                    -2,
                    Math.min(
                        2,
                        d.vy || d.__dragVy || 0
                    )
                );


            delete d.__dragVx;
            delete d.__dragVy;


            // Wake the network slightly.

            simulation
                .alpha(0.16)
                .restart();

        });

}


// ============================================
// RESET PHYSICS
// ============================================
//
// Completely reheat the simulation.
//
// Useful after:
//
// - Adding nodes
// - Removing nodes
// - Loading another dataset
// - Changing filters
// - Changing canvas size
//

function restartPhysics(
    simulation,
    strength = 0.55
) {

    simulation
        .alpha(
            Math.max(
                0.15,
                Math.min(
                    1,
                    strength
                )
            )
        )
        .alphaTarget(0)
        .restart();

}


// ============================================
// RESIZE PHYSICS
// ============================================
//
// Call this when the SVG/canvas changes size.
//

function resizePhysics(
    simulation,
    width,
    height
) {

    const centerX = width / 2;
    const centerY = height / 2;


    simulation
        .force("x")
        .x(centerX);

    simulation
        .force("y")
        .y(centerY);


    // Wake gently rather than exploding the
    // entire graph.

    simulation
        .alpha(0.18)
        .restart();

}


// ============================================
// EXPORTS
// ============================================

export {
    createPhysics,
    createDragBehavior,
    restartPhysics,
    resizePhysics
};

