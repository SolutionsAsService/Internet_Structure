# Critic: Evidence (Cairo), R4

- Anchor used: Cairo, The Truthful Art and How Charts Lie: a mark's size must be proportional to the quantity it stands for, and the reader must be told what it encodes.
- Observed: r4__1280.png; live DOM of `/` (h1 > em.hub-bar, one linear-gradient). Data via lib/data.js: hubs by stratum make 6, meet 7, carry 15, name 7, govern 3, serve 5, wire 0 (total 43). Gradient stops: 13.95 / 30.23 / 65.12 / 81.40 / 88.37 / 100%, which equal cumulative 6, 13, 28, 35, 38, 43 of 43 exactly. Rendered pixels in the screenshot, summed across both wrapped lines (578 px): brown 81 (14.0%), green 94 (16.3%), orange 62+138=200 (34.6%), olive 95 (16.4%), violet 40 (6.9%), aqua 68 (11.8%). All within about 0.3 points of the data. Order matches the figure's bands (Make to Serve). Wire absent, and the lede says "none in Wire".
Findings
1. [claim] The bar is truthful: widths are proportional to hub counts, with no stratum padded or invented. This repairs the R3 ornament problem.
2. [defect, minor] The bar wraps with the headline, so it reads as two bars and Carry orange appears at the end of line 1 and the start of line 2. It is one continuous bar (the widths only add up when summed), but nothing signals that. Cause: gradient on an inline box that breaks across lines.
3. [premise] The segments carry no counts. A reader can compare lengths but cannot read 15 vs 7. The lede names the encoding and the figure's filled dots give the same numbers per band, so it is redundant, not misleading.
4. [claim] The underline sits under "43 of them hold half of it", but the bar encodes the 43 hubs by stratum, not the half of connection ends. The lede's sentence separates the two.
Verdict: PASS (what remains is a presentational quirk, not a misreading).
Requested change: Optional. Set the bar as a single non-wrapping strip (for example a block-level 6 px element under the headline), or add counts to the segment titles.
