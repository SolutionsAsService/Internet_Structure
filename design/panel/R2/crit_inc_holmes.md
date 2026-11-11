Critic: Inclusion (Holmes), R2

- Anchor used: Recognize exclusion; permanent/temporary/situational mismatch; solve for one, extend to many.

- Observed: r2__375.png: the history labels no longer collide (only "ARPANET 1969" remains, above its tick); a one-handed phone reader gets "Explore the atlas" directly under the h1; every band carries a red arrow; the key is above the figure. r2_atlas_sel_375.png: A-Z link and search sit above the map, Reset and Clear selection are full-width buttons, and connected nodes carry an ink ring (so the cue no longer depends on red). Evidence: real Tab presses show 3px focus on each band; the listbox search has role=option and aria-selected; focus moves to the panel H2; 0 targets under 24 px; no-JS landing and atlas still render.

- Findings:
F1 [claim] 12 px SVG text at 375 (raised from 11) meets no failing criterion, and the 14 px request was overruled to keep the figure on the first screen (781 px). It is a trade, not exclusion, and it is stated. Pinch-zoom is untouched.
F2 [premise] The atlas nodes are still pointer-only. Search, listbox, A-Z and neighbour buttons give keyboard, switch and screen-reader users an equal path to every organisation and connection. The one-for-many test is met.
F3 [claim] The selected atlas at 375 is still dense (about 60 edges, overlapping labels at left). It is legible by ink stroke and Clear selection, and it is not the only route to the facts.

Resolved from R1: F1 (label collision), F3 (A-Z above the map, focus to the panel), F4 (listbox), F5 (arrows on the bands), F6 (ink stroke). F2 is partly resolved and the rest is overruled with a measured reason, which I accept.

- Verdict: PASS

- Requested change: None blocking. Optional: ship a reduced-edge option (selected node plus its neighbours only) for the dense 375 atlas.
