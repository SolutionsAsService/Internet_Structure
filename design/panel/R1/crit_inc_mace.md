# Critic: Inclusion (Mace), R1

- Anchor used: Mace, Principle 7 (size and space for approach and use), Principle 3 (simple and intuitive), Principle 5 (tolerance for error), Principle 2 (flexibility in use).
- Observed: Real Tab presses at 1280x800 show a solid 3px rgb(29,78,216) outline on every header link, both buttons and all 7 stratum bands. A band's outline is none; its hit rect takes a blue 3px stroke and a darker fill, plainly visible in the screenshot. Atlas: search input, Reset, Zoom in and Zoom out all show the 3px outline. Atlas has 253 SVG nodes and none is focusable (tabIndex>=0 count: 0). Selecting via search (Enter) works, and the panel then lists 80 neighbours as buttons. I tabbed to a neighbour and pressed Enter. The panel updated to the neighbour, but document.activeElement became BODY, so focus restarted from the page top. History tick links on the landing measure 6x17 px (some 6x23).
- Findings:
1. [defect] After a neighbour button is activated, focus drops to BODY. A keyboard user cannot step through neighbours without re-tabbing roughly 90 stops each time (P3, P5, P7).
2. [defect] The map nodes are unreachable by keyboard. The only keyboard route to an organisation is typing a name; Enter takes matches[0] only, so a second match cannot be picked (P2, P1).
3. [defect] The 11 History tick links on the landing are 6 px wide and 17-23 px tall, with neighbours about 5-15 px away. This contradicts the evidence line "targets <24 px: 0", which did not cover SVG ticks (P7).
4. [claim] Evidence "focus after a real Tab: outline on the first link" is true but narrow. It omits the bands, which I confirmed visible, and the atlas controls, which I also confirmed.
5. [premise] The panel shows "Charter Spectrum" twice in the neighbour list, so a screen-reader or keyboard user meets an unexplained duplicate (P3).
- Verdict: OBJECT
- Requested change: (a) After setting the selection, move focus to the panel heading, or keep it on a stable "next neighbour" control. (b) Make search show a listbox of matches, selectable by arrow keys or Tab. (c) Give the tick links a 24x24 invisible hit rect, or a list alternative. (d) Disambiguate or merge the duplicate neighbour rows.
