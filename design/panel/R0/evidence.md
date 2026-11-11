# R0 evidence (premortem on the inherited site, main @ 5759ba9), measured 2026-11-11 before any move

Artifact: Next.js 16.3.8 App Router site, ONE route `/` (plus _not-found). Screenshots:
- design/shots/r0__1280.png (1280x800), design/shots/r0__375.png (375x812, isMobile)

Measured:
- Routes: 1 page. Whole site = one force-directed D3 map + side panel ("Network brief").
- Client JS shipped (all chunks in .next/static/chunks): 652,567 bytes uncompressed; largest chunk 229,156 B. The map is drawn only after client JS runs: initial HTML is 8,828 bytes and contains a spinner "Preparing network map", no node names.
- Data: client fetches /data/internet.json (162,658 bytes) with `cache: "no-store"` (js/app.js), then runs a force simulation in the browser.
- Time to networkidle: 1,605 ms at 1280, 1,392 ms at 375 (local server, no throttling).
- Dataset (data/internet.json): 274 nodes, 52 distinct `layer` values, 648 unique resolvable links, 231 connection ids that resolve to no node, 38 isolated nodes.
- 12 companion dossiers in data/ (ARPANET, AT&T, Bell System, DNS, How the Internet Works, IMP, PRNET, Packet Radio Van, Packet Switching, RBOC, SATNET, Verizon), 25-77 KB each; NONE are displayed anywhere on the site. 4 of them (DNS, IMP, PacketSwitching, Verizon) are invalid JSON (unescaped quotes in `:chatgpt-content-reference{index="1"}` citation tokens).
- Horizontal overflow at 1280 and 375: 0 px.
- First screen at 375: the map is the only graphic; node labels render at ~3-4 px (visible in r0__375.png), unreadable. At 1280 labels ~6-7 px. Filter strip scrolls sideways at 375 ("Exchang" cut off).
- Colour encodes ~20 categories with no legend beyond one blue "Infrastructure" dot.
- Aesthetic: dark zinc dashboard (#09090b), Inter/system sans, 8-9 px uppercase micro-labels throughout.
