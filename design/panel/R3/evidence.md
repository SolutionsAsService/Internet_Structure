# R3 evidence: WHOLE round after the owner's feedback (move M13, colour)

Measured 2026-11-11T16:48Z on a production build made after the last edit. Raw: design/panel/measure-R3.json. Live: http://localhost:3100.
Screenshots: design/shots/R3/r3_<page>_<width>.png; atlas with Equinix selected: r3_atlas_sel_1280.png / _375.png.

## Why this round
The site owner graded the R2 design "Very very good design A would be a plus but colors are just a bit too similar" and asked that colours be chosen from the site's topic and mixed up. R2 had seated 6 of 8 (Krug, Cairo, Shklovsky, Holmes PASS; Debord, Tufte OBJECT); Mace and Nietzsche had not sat R2. R2 objections fixed: Tufte (stratum bars rendered 0 px wide: `.bar` was an inline span; now display:block, measured visible); Debord (red headline phrase meant "hubs" while red elsewhere means the route; the phrase is now ink with a fibre-colour underline); Cairo wording (lede: "account for half of all connection ends in this dataset; they touch 594 of its 691 recorded links"; ties disclosed on /about#counting).

## Move M13: palette from the topic
- Each stratum takes a colour from the TIA-598 fibre-optic colour code (the code that identifies strands inside fibre cables): Make brown #6e4526, Wire blue #2a55d0, Meet green #2f8a3a, Carry orange #c96200, Name yellow #9a8200, Govern violet #9b2fae, Serve aqua #0d8f99. Red (fibre 7) stays the route only. Dark-mode set: #c99572 #7da2ff #6fcf6a #ff9a3c #e0c23a #d07ae0 #3cc4cf.
- Distinctness: minimum CIE76 ΔE between any two of the 8 hues (7 strata + route) = 31 (carry vs route); light-mode contrast on paper 3.28-7.19:1 (graphics/large text need 3:1); dark 6.1-10.7:1.
- Hub vs other is now SHAPE: hub = filled dot, other = ring in the stratum colour (not a pale tint, which measured 1.6-2.1:1).
- Applied: landing figure (dots, band numerals), key ("hub (filled) / other (ring) / stratum, in fibre colours / a chain of recorded links"), wordmark and headline underline as a 7-colour fibre ribbon, stratum cards (top rule + numeral), stratum strip (bottom rule), stratum page numeral and bars (bar colour = target stratum), crossings table bars, atlas nodes (filled/ring by stratum) and band swatches, organisation kicker swatch. /about#colours documents the code.

## Measurements
- First screen union bottom: 656 px at 1280x800; 801 px at 375x812 (fold 812). No sideways scroll.
- HTML text contrast failures: 0. SVG text below 4.5:1: band numerals 7, 5, 4, 3 at 3.28-3.79:1. These are 44 px (1280) / 30 px (375) bold numerals, large text, threshold 3:1: pass. Badge numerals "1.15" are the known false positive (white on red badge = 5.89:1).
- Atlas band labels: now ink text with a colour swatch (coloured text measured 3.28:1 at ~15 px, so it was changed).
- Overflow 0, small targets 0, broken links 0 of 278, probe fixtures fire. Tests 12/12.
