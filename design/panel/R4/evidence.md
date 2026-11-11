# R4 evidence: WHOLE round on the final state (after R3 fixes and the S4 push)

Measured 2026-11-11T16:52Z on a production build made after the last edit. Raw: design/panel/measure-R4.json. Live: http://localhost:3100.
Screenshots: design/shots/R4/r4_<page>_<width>.png; atlas with Equinix selected: r4_atlas_sel_1280.png / _375.png. R3 reports: design/panel/R3/<seat>.md (7 PASS, Debord OBJECT).

## Changes since R3
- Debord R3 F2: the headline underline was a 7-colour ornament implying hubs in all seven strata. It is now a stacked bar of the 43 hubs by stratum, computed from the data (Make 6, Meet 7, Carry 15, Name 7, Govern 3, Serve 5; Wire 0, so Wire's blue is absent). The lede says "The bar under the headline splits them by stratum (none in Wire)." The wordmark keeps the 7-colour fibre ribbon as identity (not a data claim).
- Debord R3 F3: the screen-reader figure description now says "drawn as filled dots ... the rest are rings".
- Shklovsky R3 (optional): key now reads "stratum, in fibre-cable colours (TIA-598)".
- Krug (optional, R2/R3): lede shortened from ~85 to ~60 words; History count reads "11 dossiers" at both widths.
- Mace R3 F4: atlas neighbour buttons min-height 24 px.
- S4 ambition push on the Breaker (the red line): route stroke 3 -> 4.2 px, rings 2.4 -> 3 px, branch 2.2 -> 3 px (computed values measured: 4.2px / 3px). It separates further from the Carry orange it crosses.

## Measurements
- First screen union (h1 + figure + caption): bottom 656 px at 1280x800; 801 px at 375x812. "Explore the atlas" at 1280 sits at ~714 px (first screen); at 375 directly under the h1.
- HTML contrast failures 0; small targets 0; overflow 0; [hidden] leaks 0; 278 internal links, 0 broken; no-JS landing 253 dots, no-JS atlas 253 nodes / 691 links; probe fixtures fire. Band numerals 3.28-3.79:1 at 44/30 px bold (large text, 3:1).
- Tests: 12/12 pass.
