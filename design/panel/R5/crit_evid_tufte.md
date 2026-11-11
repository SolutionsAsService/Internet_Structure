- Anchor used: Tufte, graphical integrity (lie factor), data-ink, colour as layering ("first, do no harm").
- Observed (r5__1280.png, r5_strata_1280.png, measured from pixels):
  - Landing: band heights track counts (Carry 3 rows, Serve 1). The 15% washes tint the bands without hiding dots. Washes repeat the label colour, so they are redundant but quiet.
  - Strata page: Name (45) is 580 px wide, Serve (11) and Govern (15) 290 px. Data ratio is 4.1 and 3.0; card ratio is 2.0.
  - Inside cards the count bar is a second encoding: Name 285 px, Govern 38, Serve 28. That is 6.3 px per org in the wide card and 2.5 px in the narrow ones.
- Findings:
  1. [defect] The bars use a different scale in 2-column and 1-column cards. Name vs Serve is 285/28 = 10x for a 4.1x data ratio (lie factor about 2.5). Name vs Govern is 7.5x for 3x. The bar fills a share of card width, so doubling the card width inflates the bar.
  2. [claim] Card width is a coarse two-step size (1 or 2 columns). It is not proportional (45 and 77 get the same width), so it implies membership order only. Mild chartjunk, but the numbers are printed.
  3. [claim] On the night slab, the red route (#ff5a4c) sits next to Carry orange (#ff9a3c). They separate by saturation and the 4 px width, but this is the weakest layer.
  4. [premise] Colour zones (night, copper, header washes) are decoration, not data. They cost no contrast (0 failures) and encode stratum consistently. I do not object.
- Verdict: OBJECT. Finding 1 is a true scale distortion, on a card meant to carry size.
- Requested change: give the card bars one shared scale, with px per organisation fixed (for example 77 = full width of a 2-column card), or delete the bars and let card width plus the printed count carry it. Do not use two scales on one page.
