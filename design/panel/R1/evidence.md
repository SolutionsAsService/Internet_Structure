# R1 evidence: WHOLE round on the redesigned site (branch claude/site-redesign-nextjs-vgji7d)

Measured 2026-11-11T16:32Z, after the last edit (production build, `next start`, Chromium via Playwright).
Raw numbers: design/panel/measure-R1.json (script: design/measure.cjs). Source: /home/user/internet_structure.

## What exists now
- 283 static pages: / (landing), /atlas, /strata + 7 stratum pages, /organisations (A-Z) + 253 profiles, /history + 11 dossiers, /how-it-works, /about, 404.
- Screenshots (1280x800 and 375x812, first viewport only): design/shots/R1/r1_<page>_<width>.png, pages: _ (landing), atlas, strata, strata_carry, organisations_equinix, history, history_arpanet, how_it_works, about. Atlas with Equinix selected: design/shots/R1/atlas_sel_1280.png and atlas_sel_375.png.
- Palette: paper #f2efe7, ink #121110, muted #57534b, signal red #c8150b (dark-mode tokens exist). Font: Archivo variable (self-hosted, 90,104 B).

## Landing (First screen rule)
- Hero = headline + one figure: 7 strata bands (numeral, name, count; one dot per organisation, 253 dots) + a "History" bedrock band (time axis 1877-2000, 11 ticks, one per dossier). A red polyline joins recorded connections: 1 Comcast (Carry) -> 2 Equinix (Meet) -> 3 Grace Hopper (Wire) -> 4 Google (Serve) -> 5 Verisign (Name) -> 6 ICANN (Govern); dashed branch Google -> NVIDIA -> TSMC (Make). test/data.test.js asserts every step is a link in data/internet.json.
- Union bounding box of h1 + visible figure + caption: bottom 678 px at 1280x800; 685 px at 375x812 (both under the fold). Figure sideways scroll: 0 at both.
- Smallest SVG text: 14 px at 1280, 12 px at 375 (measured rendered height of text boxes; the CSS sets 11.5-13 px).
- At 375 the explanatory paragraph and the two buttons are moved below the figure (they are in the first screen at 1280).
- With JavaScript disabled the landing renders all 253 dots and the h1.

## Site-wide probes (10 pages x 2 widths)
- Horizontal overflow: 0 px everywhere.
- HTML text below 4.5:1 (3:1 large): 0 findings. SVG text below 4.5:1: 0.
- Targets <24 px with another target within 24 px: 0 (after the A-Z and how-it-works sidebar fixes).
- Focus after a real Tab: solid 3px rgb(29,78,216) outline on the first link.
- Internal links: 278 checked, 0 broken.
- [hidden] leaks: 0.
- Probe fixtures (must fail): overflow, contrast and small-target probes all fire on a fixture page.

## Speed (local, unthrottled)
- Before (R0): one route; HTML 8,828 B containing only a spinner; client JS 652,567 B raw; d3 force simulation in the browser after a 162,658 B fetch; networkidle 1,605 ms.
- Now: every page pre-rendered; client JS 469,118 B raw (~176 KB gzip, the Next/React runtime; no d3); landing HTML 154,591 B raw / 23,277 B gzip including the figure; atlas HTML 356,354 B raw / 54,346 B gzip including all 253 nodes and 691 links as SVG; load event ~120 ms.

## Data honesty
- 274 source records -> 253 organisations (21 duplicate ids merged). 691 links. 49 references repaired by spelling or alias; 181 unresolved, listed on /about#gaps with the reason. 2 records filed to Name by a disclosed type rule (Verisign, Amazon Route 53).
- Atlas: y = stratum band (clamped); x = force layout only, and the page says so: "Left and right is only where its connections pull it, so read the lines, not the distances."
