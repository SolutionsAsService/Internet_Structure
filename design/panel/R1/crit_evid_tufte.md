- Anchor used: Tufte, data-ink, graphical integrity (lie factor), small multiples, no chartjunk. Evidence: design/panel/R1/evidence.md; shots r1__1280, r1_atlas_1280, r1_strata_carry_1280; source StrataFigure.jsx, figure.js, layout.js, strata/[id]/page.jsx.
- Observed:
  - Landing: 253 dots, band row length = count (Serve 11 dots, Carry 77 on two rows), a good, countable encoding. Route stops are placed at hand-set x fractions (ROUTE_X in figure.js), not data. Radius is linear in importance (rMin 2, rMax 4.2): area ratio 4.4x for a 10x score range. 11 history ticks, 2 labelled, ticks lifted by 6 px per same-year stack, red like the route.
  - Atlas: x is force layout, stated on the page; 691 links drawn at one hairline weight; the band labels at 1280 are pale grey; first viewport shows only 4 of 7 bands.
  - Bar rows: zero-based, direct-labelled integers, honest within a page. Carry scales to its own max (135 self-links); other pages scale to theirs.
- Findings:
  F1 [defect] Bar widths on /strata/[id] are normalised per page (maxReach), so 13 on Carry and 13 on another stratum draw different lengths; seven pages that are one small multiple do not share a scale.
  F2 [defect] The self-link bar (135, red) sets the scale and squeezes the cross-stratum values the heading promises ("where its connections go"); 206 off-stratum links are drawn at 1-122 px against a 135 ceiling.
  F3 [defect] Dot radius is linear in importance, so area understates the score 10x vs 4.4x (lie factor ~0.4); size is the only per-dot variable and it is misdrawn.
  F4 [defect] Route x positions are scripted (ROUTE_X); the polyline's slope and length (Google to NVIDIA/TSMC spans six bands) look measured but encode nothing; only the path order is data.
  F5 [defect] History ticks: red duplicates the route's meaning, 9 of 11 ticks are unlabelled, same-year lift is decoration, and the axis shows only 1877 and 2000, so no tick can be read as a year.
  F6 [claim] "Each dot is one of the 253 organisations" holds, but x within a band is importance fill order, never stated; a reader will assume x means something, as the atlas rightly warns it does not.
  F7 [defect] Atlas: 691 links at equal weight form a hairball in Carry/Meet; the edges carry no layering (the selected edge set is the only fix), and the band labels are the faintest ink on the page.
  F8 [premise] A force layout whose x is meaningless is a poor encoding for a "structure" atlas; a matrix or per-stratum small multiples of crossings would show 691 links without occlusion.
- Verdict: OBJECT
- Requested change: Put all seven bar charts on one shared axis (max over the 7x7 crossing matrix), draw self-links in a separate, labelled column; scale dot area (not radius) to importance; label every history tick or drop the unlabelled ones and print 4-5 year ticks, in ink not red; mark route x as arbitrary in the caption; darken the atlas band labels and thin or rank edges by layer.
