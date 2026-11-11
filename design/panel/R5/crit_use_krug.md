# Critic: Usability (Krug) - R5

- Anchor used: Krug, Don't Make Me Think: five-second test, legibility probe, first action visible, trunk test on inner pages (colour zones checked against all four).

- Observed (r5__1280/375, r5_strata_1280, r5_strata_carry_1280, r5_organisations_equinix_1280, r5_history_arpanet_1280):
  Five seconds on the dark hero: h1 "253 organisations hold the internet up. 43 of them hold half of it." and seven labelled coloured bands read at once; the washes make bands easier to tell apart.
  Trace a mark: badge 2 Equinix, filled dot in green Meet. Line arrives from 1 Comcast (Carry), leaves to 3 Grace Hopper (Wire). Colour zone adds nothing to decode.
  First action: "Explore the atlas" (cream button, ~714 px at 1280; directly under h1 at 375). Strongest contrast on the dark slab.
  Trunk test: every inner page keeps the same logo, nav, breadcrumb and (strata/org) the seven-tab stratum strip with the current tab raised. Carry, Equinix (green, Meet) and ARPANET (copper) all say where I am. Colour only reinforces; each page also names itself in a huge h1.
  Strata grid: Name and Carry span two columns, order 7,6,5 still reads left to right.

- Findings:
1. [claim] The nav does not mark the current section (Strata, History) on inner pages; breadcrumb and h1 carry it. Not blocking.
2. [claim] Dark landing to light inner pages is a zone jump, but header position and nav are unchanged, so nothing is relearned.
3. [claim] Equinix header's green and its "3 Meet" tab match; stratum colour is a redundant cue, never the only one.
4. [premise] "(TIA-598)" still in the key; one glance of noise (R4 optional, not taken).
5. [claim] Lede is still ~60 words, skipped without loss.

- Verdict: PASS (the zones do not add thinking; what remains is not a defect).

- Requested change: None required. Optional: highlight the current nav item; drop "(TIA-598)".
