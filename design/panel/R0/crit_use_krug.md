**Critic: Usability (Krug)**

- Anchor used: Five-second test ("What is this, and what do I do next?"), plus what-is-clickable and needless-words checks. Trunk test not applicable: evidence says one route only.
- Observed: At 1280 the header says "Internet Structure / Global Infrastructure Atlas"; the map is a cloud of ~270 coloured dots with labels of 6-7 px. The right panel says "Select a node" and shows 274/648/52/38. At 375 the labels are 3-4 px and unreadable, the filter strip is cut off ("Exchang"), and the search box placeholder is truncated ("Find a network, exchange, or sys"). Initial HTML is a spinner with no node names. Instruction text ("DRAG TO EXPLORE / SCROLL TO ZOOM / SELECT A NODE...") sits in 8-9 px micro-type over the map at the bottom edge. The 12 dossiers are shown nowhere.

Findings:
- F1 [defect] Five-second test fails: "Atlas" and a dot cloud do not say what it is for. No one-line purpose statement anywhere on the first screen.
- F2 [defect] Next action is not obvious. The only invitation is 8-9 px grey text overlapping the map bottom; the search box is the best first action but is not named as such.
- F3 [defect] Nothing reads as clickable: dots look like decoration; labels are 3-7 px, so the visitor cannot even decode what a dot is without clicking blind.
- F4 [defect] Colour carries ~20 categories with one legend entry ("Infrastructure"), so the visitor must guess the code. Forced thinking.
- F5 [defect] Needless words and noise: "LIVE GRAPH / REPOSITORY DATA", "NODE INTELLIGENCE", "NETWORK READY" (twice), "231 UNRESOLVED REFERENCES", "NO EXTERNAL DATA REQUESTS" are builder talk, not visitor value. The stats (52 layers, 38 isolated) mean nothing to a visitor.
- F6 [defect] At 375 the filter row is cut mid-word and the placeholder is clipped, so the controls look broken. Spinner-only HTML shows an empty page before JS runs.
- F7 [claim] "Select a node" empty state is clear and tells the visitor what to do, but it sits in a side panel, below the fold on mobile.
- F8 [premise] The whole site is assumed to be one map; a visitor who wants an explanation (the unshown dossiers, e.g. "How the Internet Works") has no path to one.

- Verdict: OBJECT
- Requested change: Put one plain sentence of purpose and one obvious first action ("Search a network or tap a dot") above the map, at readable size. Make labels at least 11-12 px by showing fewer labels (zoom to reveal the rest). Give a real legend, or cut the colours down to a few. Strip the builder jargon. Fix the 375 controls so nothing is cut off.
