# Critic: Inclusion (Mace), R4

- Anchor used: Mace P4 (perceptible information), P3 (simple, intuitive), P2 (flexibility in use), P7 (size and space).
- Observed: Playwright, real Tab, 1280x800, port 3100. Landing: skip link, wordmark, 5 nav links, both buttons show solid 3px rgb(29,78,216). Bands are SVG links (computed outline none) but a blue rectangle frames the focused band (screenshot, Serve band): visible. Atlas: skip, wordmark, nav show 3px ring. Typing "equin", ArrowDown, Enter selects; activeElement is the panel H2 "Equinix Ashburn IX" (3px ring); Tab reaches "Open the full profile", then neighbour buttons (AT&T, Lumen). Enter on Lumen moves focus to H2 "Lumen". Neighbour buttons measured 24.0 px tall; Reset and Clear 46, zoom 44. Hub = filled, other = ring, stated in the landing key and the figure text; the new stratum bar omits Wire honestly.
- Findings:
1. [resolved] R3 F4: neighbour buttons are exactly 24 px.
2. [resolved] Focus is visible at every landing and atlas stop tested; the atlas keyboard path (search, listbox, heading focus, neighbour stepping) is complete.
3. [claim] Hub/other survives without colour: shape (filled vs ring) carries it.
4. [premise] Atlas nodes stay pointer-only; the search plus neighbour route is an adequate equivalent (P2). Not a defect.
- Verdict: PASS
- Requested change: None. Optional: give band links a CSS outline so the ring does not depend on SVG rendering.
