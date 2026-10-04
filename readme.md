# Internet Structure Atlas

An interactive Next.js and D3 atlas for exploring internet infrastructure and the connections recorded in this repository. The interface combines a force-directed map, infrastructure-layer filters, fast search, network statistics, and a focused node brief.

## Run locally

Requires Node.js 20.9 or newer.

```sh
npm install
npm run dev
```

Open the local URL printed by Next.js. `npm run build` creates a production build, and `npm start` serves it. The build/dev pre-step copies repository JSON files into ignored `public/data/` assets; the map loads `/data/internet.json` locally, with no third-party map, font, or data service.

## Explore the map

- Drag the canvas to pan, scroll to zoom, and drag a node to reposition it.
- Select a node to emphasize its direct connections and open its network brief.
- Search by name, type, identifier, or infrastructure layer; layer buttons filter the map without removing the remaining context.
- Important labels remain visible at overview scale. Zooming in reveals more labels, and selecting a node labels its immediate neighborhood.

The layout starts from a deterministic, evenly distributed spiral, then balances gentle link springs with global repulsion, collision spacing, and soft individual home anchors. That preserves connected clusters without pulling every node into one central knot; dragging a node updates its preferred position.

## Data and validation

The main graph is `data/internet.json`; companion repository dossiers are copied alongside it for future detail views. The separate architecture explainer is `data/HowTheInternetWorks.json`. It was renamed from `data/Internet.json` because those two names differ only by capitalization and cannot coexist on case-insensitive Windows filesystems.

The current network dataset contains 274 nodes and has unresolved connection IDs. The map safely skips missing endpoints and reports their count in the map footer rather than failing to load. Check the source data with:

```sh
npm run validate:data
npm test
```

## Project structure

- `app/` contains the Next.js App Router shell and responsive styles.
- `src/Atlas.jsx` provides the client-side interface.
- `js/app.js` mounts the D3 map and controls within the React shell.
- `js/physics.js` contains the deterministic force-layout and drag behavior.
- `data/` holds the source network model and supporting dossiers.
- `scripts/copy-data.mjs` stages local JSON datasets as Next.js public assets.
- `test/` exercises layout behavior and app integration assumptions.
