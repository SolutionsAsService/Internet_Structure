- Anchor used: Tufte, graphical integrity (lie factor = size of effect shown / size in data).
- Observed (live /strata, rendered getBoundingClientRect of .bar, 1280 and 375):
  - 1280: Serve 33, Govern 45, Name 135, Carry 231, Meet 90, Wire 108, Make 39x3=117 px (cards 249 or 539 px wide).
  - 375: identical widths (cards all 301 px).
  - Counts 11, 15, 45, 77, 30, 36, 39 give exactly 3.00 px per organisation in every card at both widths. Name/Serve = 4.09, Govern/Serve = 1.36, matching the data. Lie factor 1.00. No bar is clipped at 375 (Carry 231 fits).
- Findings:
  1. [defect, R5 F1] CLOSED. Two scales are gone; one fixed scale, stated in the lede.
  2. [claim] Card width is still a coarse 1-or-2 column step, not proportional. The printed count and the now-honest bar carry the quantity, so this is no longer a distortion.
  3. [claim] Red route beside Carry orange stays the weakest colour layer. Not blocking.
- Verdict: PASS
- Requested change: None required. Optional: add a faint 100-org scale tick or caption so the 3 px unit is visible on the chart itself, not only in the lede.
