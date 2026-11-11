Critic: Evidence (Cairo), R0

Anchor used: Cairo, The Truthful Art / How Charts Lie. A graphic is truthful and functional only if its encodings can be read and checked, and it is enlightening only if it shows the reader a pattern they can verify.

Observed:
- r0__1280.png: the legend has one blue "Infrastructure" dot. The nodes are green, teal, orange, purple, pink, red and grey. The evidence file counts about 20 colour categories and 52 distinct layer values.
- r0__375.png: the map is the only graphic on the first screen. Labels render at about 3-4 px (6-7 px at 1280). The filter strip clips "Exchang".
- Stat tiles show 274 nodes, 648 links, 52 layers and 38 isolated. The footer says "231 UNRESOLVED REFERENCES", but nothing says which references or why.
- The map's positions come from a force simulation (evidence file). 12 dossiers (25-77 KB each) appear nowhere on the site, and 4 of them are invalid JSON.
- Initial HTML is 8,828 B with no node names. The map exists only after 652,567 B of client JS and a 162,658 B fetch.

Findings:
F1 [defect] Colour carries about 20 categories and the legend shows one dot, so no reader can decode the main encoding.
F2 [defect] Labels at 3-7 px are unreadable. At 375 the nodes are unnamed dots, so the graphic cannot be used.
F3 [defect] "231 unresolved references" is shown against 648 links with no explanation. A reader cannot tell whether the map is complete, and the figure suggests it is not.
F4 [claim] "Network relationship map" and "Infrastructure network" imply that position means something. Force-layout position is an artifact of the simulation and cannot be checked.
F5 [claim] The stat tiles (274, 648, 52, 38) are counts with no question behind them. "52 layers" is a symptom of unclean categories, not an insight.
F6 [premise] The site assumes one hairball is the finding. The 12 undisplayed dossiers hold the actual explanation (ARPANET, packet switching, DNS, AT&T), and the page never shows that evidence.
F7 [defect] There is no static or no-JS content. Every claim on the page depends on client JS running.

Verdict: OBJECT

Requested change:
- F1: collapse the layers to a small set (roughly 8 or fewer) and give the page a complete legend, with the colour of each category labelled.
- F2: make labels legible (readable size, shown only for the focused or high-degree nodes), or replace the dots with a ranked, labelled view at 375.
- F3: show the unresolved references as a named list with the reason for each (the source of the data gap), or fix the data.
- F4: drop the implied meaning of position. Use an encoding the reader can measure (ordered, grouped or matrix).
- F5: replace the count tiles with a question and the measured answer to it.
- F6: surface the dossiers as the narrative, and repair the 4 invalid JSON files.
- F7: render the key content as real HTML on first load.
