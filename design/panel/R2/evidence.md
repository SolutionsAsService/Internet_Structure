# R2 evidence: WHOLE round after the R1 fixes (moves M10-M12)

Measured 2026-11-11T16:40Z on a production build made after the last edit. Raw numbers: design/panel/measure-R2.json (design/measure.cjs).
What changed since R1 and why, finding by finding: DESIGN-LOG.md section 4, "Resolutions, R1". Your own R1 report: design/panel/R1/<your seat>.md.
Screenshots (first viewport only): design/shots/R2/r2_<page>_<width>.png; atlas with Equinix selected: r2_atlas_sel_1280.png / _375.png; keyboard focus on a landing band: r2_focus_band_1280.png. Live site: http://localhost:3100.

## Landing now
- h1: "253 organisations hold the internet up. 43 of them hold half of it." Hubs = the fewest organisations, ranked by recorded connections, whose connections reach half of all link endpoints (696 of 1,382); they touch 594 of 691 links. Procedure on /about#counting; test/data.test.js asserts the set is minimal.
- Figure: all dots one size; 43 hubs in ink, 210 others grey (#8a8579, 3.2:1 on paper); band height grows with rows (1280: Serve 49, Govern 49, Name 65, Carry 81, Meet 49, Wire 65, Make 65 px); key above the figure; route stops ringed in red with numbered red badges; NVIDIA/TSMC branch dashed; history ticks in ink with 1900/1925/1950/1975/2000 marks; caption: "Bands are strata, heaviest where most organisations sit; position along a band means nothing. Verisign counts as Name by its type. About the data".
- At 375: "Explore the atlas" button directly under the h1; key, figure, caption follow; lede and two more links below the figure.
- First screen union (h1 + figure + caption): bottom 656 px at 1280x800; 781 px at 375x812. Sideways scroll inside the figure: 0.
- Smallest SVG text: 12 px rendered at both widths.
- SVG contrast probe flags the white badge numerals at 1.15:1, a false positive: the probe measures against the page, not the red badge. Measured directly: white on #c8150b = 5.89:1; dark mode #121110 on #ff5a4c = 6.12:1.

## Keyboard (real Tab presses, Chromium)
- Landing: Tab order skip link, wordmark, 5 nav links, 2 buttons, then the 7 bands and the History band, each showing a 3px rgb(29,78,216) stroke on its hit area, then "About the data". The 6x17 px tick links no longer exist: the whole History band (720x76 px at 1280) is one link to /history.
- Atlas: typing "telia" shows a listbox (role=option, aria-selected); ArrowDown/Enter selects; focus moves to the panel heading (H2 "Telia"); Tab twice reaches a neighbour button; Enter selects it and focus returns to the new heading (H2 "Arelion", solid outline). 18 connected nodes gain an ink stroke (non-colour cue).

## Site-wide probes (10 pages x 2 widths)
Overflow 0 everywhere; HTML text below 4.5:1: 0; targets <24 px with a neighbour within 24 px: 0; [hidden] leaks 0; 278 internal links, 0 broken; no-JS landing renders 253 dots and the h1; no-JS atlas renders 253 nodes and 691 links; probe fixtures all fire.

## Other changes
- /strata/[id]: bars to other strata on one scale shared by all seven pages (full width = 122 links, the largest off-diagonal crossing); links inside the stratum stated separately; hub tags in the member table; hub count in the facts row.
- /strata: new 7x7 crossings table with one-scale bars.
- Stratum strip on inner pages shows each stratum's count.
- Atlas: hubs in ink; band labels in muted ink (was 16 % opacity); edges lighter; A-Z offered above the map; "Clear selection" button; duplicate names show their type.
- /about: "How each number is counted", one rule per figure.

## Speed (unchanged in kind)
All 283 pages pre-rendered; client JS 469,842 B raw (Next/React runtime, ~176 KB gzip); landing HTML 164,836 B raw; font 90,104 B; load event ~120 ms locally.
