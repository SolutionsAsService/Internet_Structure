# R6 evidence: confirmation round for the two R5 objections

Measured 2026-11-11T17:11Z after the last edit. Raw: design/panel/measure-R6.json. Live: http://localhost:3100.
- Tufte R5 F1 (card bars on two scales): every strata card bar is now 3 px per organisation, independent of card width; the /strata lede says so. Measured rendered widths at 1280 and 375: Serve 11 -> 33 px, Govern 15 -> 45, Name 45 -> 135, Carry 77 -> 231, Meet 30 -> 90, Wire 36 -> 108, Make 39 -> 117 (ratio exact). Screenshot design/shots/R6/r6_strata_1280.png / _375.png.
- Mace R5 F1 (skip-link ring 2.5:1 on the dark header): `.skip:focus-visible` now draws a 3 px white outline inside a 6 px #1d4ed8 ring. After a real Tab on /: outline rgb(255,255,255) 3px, box-shadow rgb(29,78,216) 0 0 0 6px. White on #0e1117 is about 18:1. Screenshot design/shots/R6/r6_skip_1280.png.
- All probes: 0 contrast failures, 0 small targets, 0 overflow, 0 broken links; first screen bottoms 662 / 799 px.
