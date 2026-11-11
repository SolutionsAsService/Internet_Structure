# Carry-forward: facts this site's medium established by measurement

Read before any later design run on Internet Structure.

- **CSS pasted outside its media query is inert where intended and live everywhere else.** A `.tick-label--first { display: none }` meant for <=760 px landed at file scope after a string replace hit the wrong block; the 375 capture still showed the collision (Krug, Holmes, Shklovsky, Nietzsche R1). Grep the computed style at the target width, not the file. (M11)
- **A percentage width on an inline `<span>` is ignored.** Wrapping a grid-item bar in a track span made `.bar` inline, and every stratum-page bar rendered 0 px despite `width: 53%` (Tufte R2). Grid items are blockified, their children are not. Fix: `display: block`. (M13a)
- **An SVG drawn with a viewBox scales its text.** The landing figure is drawn twice (720 and 343 wide) at 1:1 and swapped by media query, so no label falls below 12 px; a single scaled SVG would have put labels at ~6 px on a phone. (M3)
- **Atlas labels must be sized in screen pixels.** Set `--fs = 12.5 / (screenCTM.a * zoom)` on the viewport group; a fixed font-size in user units rendered labels at 5-7 px. (M6)
- **The contrast probe reads SVG text against the page, not its badge.** White numerals on red badges report 1.15:1; measured directly they are 5.89:1. Exclude or special-case badge text. (R2, R3)
- **Hub/other by pale tint fails; by fill/ring passes.** 45 % tints measured 1.6-2.1:1 on paper; a full-colour ring keeps the stratum hue at 3.3:1+ and adds a shape cue. (M13)
- **A gradient underline on inline text wraps with the text.** The hub bar splits across headline lines; segment widths still sum to the data (Cairo, Tufte R4), but readers must add two pieces. A block-level bar is the fix if the headline reflows. (M14, deferred)
- **Next.js App Router ships ~176 KB gzip of runtime even for all-server pages.** The saving came from removing client d3, the runtime fetch and the simulation, and from rendering content into the HTML. (M9)
- **`color-mix()` computes to `color(srgb r g b)` with 0-1 channels.** A probe that parsed digits as 0-255 read tinted cards as 1.11:1 (real ~6:1). `design/measure.cjs` now scales them. (M15)
- **A bar inside a card scaled to the card's width lies when cards differ in width.** Double-width cards drew Name at 10x Serve for a 4.1x ratio. Use a fixed unit (3 px per organisation). (M15, Tufte R5)
- **A skip link that floats over a dark header needs a ring that works on both grounds.** White outline plus blue shadow; a single #1d4ed8 ring measured 2.5:1 on #0e1117. (M15, Mace R5)
- **`body:has(.night)` scopes a page-specific header theme with no client code;** a spread `box-shadow` plus `clip-path: inset(0 -100vmax)` makes the header background full-bleed. (M15)
