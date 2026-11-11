# Critic: Usability (Krug) - R3

- Anchor used: Krug, Don't Make Me Think: five-second test, self-evident vs. needs-thought, first action's visibility, needless words.

- Observed (r3__1280.png, r3__375.png, first screen only):
  Site: PASS at both widths. Eyebrow "An atlas of who holds the internet up"; h1 "253 organisations hold the internet up. 43 of them hold half of it."
  Three topics: PASS. Serve, Govern, Name, Carry, Meet, Wire, Make all labelled; 1280 adds plain subtitles ("Clouds & content").
  Trace a mark: PASS. Red badges 1-6 Comcast, Equinix, Grace Hopper, Google, Verisign, ICANN; the line runs Comcast to Equinix to Grace Hopper. Comcast touches Equinix; Equinix touches Comcast and Grace Hopper.
  Colour key: key row above the figure reads "hub (filled) / other (ring) / stratum, in fibre colours / a chain of recorded links". Colour sits on the row it belongs to, and the row label already names the stratum, so nobody has to decode hue to read anything. Filled versus ring is a shape cue and reads at once. Red is still the route only, with no collision. Seven hues beside a label is redundant coding, which is safe.
  First action: "Explore the atlas" is on the first screen at both widths (1280 at ~765 px; 375 under the h1, ~257 px).

- Findings:
1. [claim] The key swatch "stratum, in fibre colours" is a multicolour strip and decodes nothing by itself. It is decoration, and harmless because the row labels do the work. It costs one glance, not a thought.
2. [claim] "hub (filled) / other (ring)": "hub" is jargon. The lede explains it ("the 43 filled dots are the fewest that account for half"), but a five-second visitor sees filled dots and still reads fine. Not blocking.
3. [claim] Carried over from R2: the 1280 lede is about 85 words; "11 dossiers" at 1280 vs "11 files" at 375. Not blocking.
4. [claim] At 375 the subtitles are still absent, so "Wire", "Meet" and "Carry" stand bare. Guessable and already accepted.
5. [premise] The fibre-colour-code rationale (TIA-598) is invisible to a first-time visitor. It does not need to be seen; the colours work as plain separation (min dE 31).

- Verdict: PASS (nothing remaining is a defect; the recolour added no thinking).

- Requested change: None required. Optional: halve the lede; one word for the History count at both widths.
