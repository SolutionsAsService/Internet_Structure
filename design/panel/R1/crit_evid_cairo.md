# Critic: Evidence (Cairo), R1

- Anchor used: Alberto Cairo, The Truthful Art and How Charts Lie. A graphic is truthful only if each visual channel means one stated thing; the viewer should be told what is not measured.
- Observed: I re-ran the counts from data/internet.json with my own script. 274 records, 253 distinct ids (21 duplicates), 52 layers, 691 undirected deduplicated links and 181 unresolved references all match /about. My repaired count was 50, against the 49 printed, because I counted per raw record. Every red step is a link in the data: comcast-equinix, equinix-grace_hopper, grace_hopper-google, google-verisign, verisign-icann, google-nvidia and nvidia-tsmc. The landing has 544 circles, and the stratum counts sum to 253. Screenshot r1__1280.png and lib/figure.js, StrataFigure.jsx.

Findings
F1 [defect] Size is not drawn as importance for the 8 red dots. figure.js sets r = max(r(n), rMax)+0.6 for route members, so Comcast and Grace Hopper (importance 9) are drawn larger than other importance-10 dots, while the caption says size is importance.
F2 [defect] Size barely discriminates. 224 of 253 nodes score 8-10 (distribution 5:1, 6:9, 7:40, 8:87, 9:82, 10:55), so radius spans about 3.5-4.2 px for most dots. The legend names no scale or range.
F3 [defect] Horizontal position inside a band is only fill order, with route stops pinned at hard-coded fractions (ROUTE_X). The red polyline's slopes and lengths therefore look like measured distance, and the landing caption does not say so. The atlas page does disclose this; the landing does not.
F4 [premise] Red marks two things: the route and the history ticks. The "red = recorded links" key is in the paragraph, not the figure, and does not cover the red ticks.
F5 [claim] "Touches all seven strata" depends on a type rule that files Verisign (layer "cloud") under Name. The rule is disclosed only on /about, not beside the figure.
F6 [claim] The headline "253 organisations hold it up" presents a curated dataset as the whole. The page shows 181 unresolved references and 17 unlinked nodes only on /about.
F7 [defect] /about gives 691 and 49 but not the procedure (undirected, deduplicated, repaired counted after merge). I could reproduce them only by reading lib/data.js.
F8 [claim] The history band's 1877-2000 axis mixes year meanings (founded, introduced, project start, demonstration). Only two ticks are labelled, and the axis says nothing about what a year marks.

Verdict: OBJECT

Requested change
F1: Draw route dots at their importance radius and mark them with the ring only.
F2: Add a size key ("importance 5-10") and widen the radius range, or state in the caption that most scores are 8-10.
F3: Add "Left-right within a band carries no meaning; read the red line by stratum" to the landing caption.
F4: Keep red for the route only; draw ticks in ink, and put a key for the red line inside the SVG.
F5: Add a footnote beside the figure: "Verisign is filed under Name by a type rule (see About)".
F6: Add to the lede or caption: "253 organisations in this dataset; 181 references are unresolved (About)".
F7: Add one sentence on /about for each number's counting rule, plus the command that reproduces it.
F8: Add a caption note on what each year marks, with a link to the dossier list.
