# Internet Structure

An atlas of the organisations that hold the internet up: chip foundries and subsea cables, exchanges and carriers,
DNS and registries, standards bodies and clouds, plus the history they were built on. Built with Next.js; every page
is pre-rendered from the JSON in `data/`.

## Run locally

Requires Node.js 20.9 or newer.

```sh
npm install
npm run dev        # development server
npm run build      # pre-renders all 283 pages
npm start          # serves the production build
npm test           # data, figure and layout checks
npm run validate:data
```

Set `NEXT_PUBLIC_SITE_URL` at build time to emit absolute URLs in the sitemap and social metadata.

## The site

| Route | What it is |
|---|---|
| `/` | The landing cross-section: every organisation as one dot in seven strata, a red line of recorded connections through all seven, and the history dossiers as bedrock |
| `/atlas` | The whole network, stratum by stratum; select or search to light up connections |
| `/strata`, `/strata/[id]` | The seven strata: who is in each and where its connections go |
| `/organisations`, `/organisations/[id]` | A to Z, and one page per organisation with every recorded connection |
| `/history`, `/history/[slug]` | Eleven dossiers, from the Bell System (1877) to Verizon (2000) |
| `/how-it-works` | One request end to end, from `data/HowTheInternetWorks.json` |
| `/about` | How the data is processed: merged records, repaired and unresolved references |

## Why it is fast

- Every page is static HTML generated at build time (`dynamicParams = false`); data is read by server components, so the
  160 KB dataset is never sent to the browser.
- The atlas layout is computed once at build time with `d3-force` (`lib/layout.js`). The browser receives finished SVG
  and a small interaction script; there is no client-side d3 and no simulation.
- One self-hosted variable font, preloaded by `next/font`; no third-party requests.
- The landing and every inner page work with JavaScript disabled.

## Project structure

- `app/`: routes, layout and styles (`globals.css`).
- `components/`: `StrataFigure` (landing graphic, server-rendered SVG), `AtlasView` (the only client component),
  `Dossier` (renders a JSON dossier as readable sections), `StratumStrip`.
- `lib/data.js`: loads `data/internet.json`, merges duplicate ids, resolves misspelt references, builds links.
- `lib/strata.js`: the seven strata and the mapping from the dataset's layer tags.
- `lib/figure.js`, `lib/layout.js`: geometry for the landing figure and the atlas.
- `lib/dossiers.js`: the history manifest and dossier helpers.
- `test/data.test.js`: checks that every file parses, every layer has a stratum, the red line is made of real links,
  every figure dot is inside the drawing, and the atlas layout is deterministic.
- `DESIGN-LOG.md`, `design/`: the design run's decisions, critic reports, screenshots and measurement script.

## Data

`data/internet.json` holds 274 records (253 distinct organisations). Companion dossiers in `data/` are rendered on the
history pages. When adding a record with a new `layer` value, add it to a stratum in `lib/strata.js`; `npm test` fails
until you do.
