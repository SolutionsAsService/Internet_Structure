# Critic: Usability (Krug) - R2

- Anchor used: Krug, Don't Make Me Think: five-second test, what is clickable, first action's visibility, needless words.

- Observed: Legibility probe from the first screen alone (r2__1280.png, r2__375.png). Site: PASS at both widths; eyebrow "An atlas of who holds the internet up" plus h1 "253 organisations hold the internet up. 43 of them hold half of it." Three topics: PASS (Serve, Govern, Name, Carry, Meet, Wire, Make all labelled; at 1280 with plain subtitles "Clouds & content"). Trace one mark: PASS at both widths; red badges 1-6 Comcast, Equinix, Grace Hopper, Google, Verisign, ICANN; Comcast touches Equinix; Equinix touches Comcast and Grace Hopper. Key "one chain of recorded links" sits above the figure. First action: "Explore the atlas" is in the first screen at both widths (1280 bottom-left at ~740 px; 375 directly under the h1). Red arrows after every band name sign them as links; the History band shows an arrow too.

- Findings:
1. [defect resolved] R1 F1 (first action below fold at 375): button under the h1.
2. [defect resolved] R1 F2 (two numbering systems): red badges vs black stratum numerals.
3. [defect resolved] R1 F3 (history label collision at 375): only "ARPANET 1969" remains, legible.
4. [defect resolved] R1 F4 (unsigned links): red arrows.
5. [claim resolved] R1 F6 (unexplained red/dashed line): key above the figure; the dashed NVIDIA/TSMC branch is still only explained in the lede.
6. [claim] R1 F5 stays overruled, but at 375 the subtitles are gone (counts only), so "Wire", "Meet" and "Carry" stand bare. I accept: the three-topics test still passes, and the verbs are guessable.
7. [claim] Needless words: the 1280 lede is about 80 words, the caption another 30. Neither blocks the five-second read, which the h1 and figure carry. "11 dossiers" (1280) vs "11 files" (375) is a small inconsistency.

- Verdict: PASS (nothing remaining is a defect; items 5-7 are not defects).

- Requested change: None required. Optional: halve the lede; use one word for the History count at both widths.
