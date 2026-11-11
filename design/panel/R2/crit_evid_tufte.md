- Anchor used: Tufte, graphical integrity (lie factor), data-ink, small multiples, "show the data".
- Observed:
  - Landing (r2__1280.png): all dots one size, so the misdrawn radius is gone; 43 ink / 210 grey is a countable encoding; the key and the caption ("position along a band means nothing") disclose the route and fill order; ticks are ink with 1900-2000 axis marks.
  - /strata/carry at 1280 (r2_strata_carry_1280.png; my own screenshot): "Where its connections go" shows names and integers only (13, 1, 5, 122, 37, 28) and no bars. Measured in Chromium: `.bar` has style width 10.66%, 0.82%, 100% ... but a rendered width of 0 px. In app/globals.css `.bar-row .bar` sets height and background but no display, and the element is an inline span, so width is ignored. /strata/serve is the same.
  - Atlas (r2_atlas_1280.png): band labels now dark and legible; edges lighter; hairball in Carry persists.
- Findings:
  F1 [defect] NEW: the shared-scale bars the caption promises ("full width = 122 links") are invisible on every stratum page. The text states a scale that is not drawn; the small multiple does not exist. The R1 F1/F2 resolution holds in the data (one 122 ceiling, self-links split into "Plus 135 links") but fails on the rendered page.
  F2 [defect] R1 F1/F2: logic resolved, unverifiable visually until F1 is fixed.
  F3 R1 F3 [resolved]: size channel removed; hubs in ink.
  F4 R1 F4/F6 [resolved]: caption discloses arbitrary x; the route slope still reads as measured, minor.
  F5 R1 F5 [resolved in part]: ink ticks and year axis; 9 of 11 ticks remain unlabelled but link to /history; acceptable.
  F6 R1 F7 [resolved in part]: labels fixed; edge occlusion remains.
  F7 R1 F8 [premise]: overruled with a matrix on /strata; I accept (not re-raised).
- Verdict: OBJECT
- Requested change: give `.bar-row .bar` `display:block` (or make the track a flex/grid with the bar as a block), re-measure that the Carry/Meet bar is the full track (122/122) and Serve/Govern is about 1 px at 1 link, then re-screenshot /strata/carry.
