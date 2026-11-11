import AtlasView from '../../components/AtlasView.jsx';
import { loadAtlas } from '../../lib/data.js';
import { atlasLayout } from '../../lib/layout.js';
import { STRATUM_BY_ID } from '../../lib/strata.js';

export const metadata = {
  title: 'Atlas',
  description: 'Every organisation in the dataset and every recorded connection between them, arranged by stratum.',
};

export default function AtlasPage() {
  const atlas = loadAtlas();
  const layout = atlasLayout(atlas);
  const pos = new Map(layout.nodes.map(n => [n.id, n]));
  const index = new Map(atlas.nodes.map((n, i) => [n.id, i]));

  // Compact data for the browser: names and neighbour indices only.
  const meta = atlas.nodes.map(n => ({
    id: n.id,
    name: n.name,
    type: n.type,
    s: STRATUM_BY_ID[n.stratum].name,
    nb: [...atlas.neighbours.get(n.id)].map(id => index.get(id)),
  }));

  return (
    <main className="wrap">
      <header className="page-head" style={{ paddingBottom: 8 }}>
        <p className="kicker">Atlas · {atlas.nodes.length} organisations · {atlas.links.length} recorded connections</p>
        <h1>The whole map</h1>
        <p className="lede">
          Height is stratum: each organisation stays inside its band. Left and right is only where its connections pull
          it, so read the lines, not the distances. Select any dot, or search, to light up what it touches.
        </p>
      </header>
      <AtlasView meta={meta}>
        <svg viewBox={`0 0 ${layout.width} ${layout.height}`} preserveAspectRatio="xMidYMid meet" role="img" aria-label={`Network of ${atlas.nodes.length} organisations in seven strata`}>
          <g data-viewport="">
            {layout.bands.map(b => (
              <g key={b.id}>
                <line className="atlas-band-rule" x1="0" x2={layout.width} y1={b.y0} y2={b.y0} />
                <text className="atlas-band-label" x="8" y={b.y0 + 34}>{b.n} {b.name}</text>
              </g>
            ))}
            <g>
              {atlas.links.map(l => {
                const a = pos.get(l.source);
                const b = pos.get(l.target);
                return <line key={`${l.source}|${l.target}`} className="a-link" data-s={index.get(l.source)} data-t={index.get(l.target)} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />;
              })}
            </g>
            <g>
              {atlas.nodes.map((n, i) => {
                const p = pos.get(n.id);
                return <circle key={n.id} className="a-node" data-i={i} cx={p.x} cy={p.y} r={p.r} tabIndex={-1}><title>{n.name}</title></circle>;
              })}
            </g>
            <g>
              {atlas.nodes.map((n, i) => {
                const p = pos.get(n.id);
                return (
                  <text key={n.id} className={layout.labelled.has(n.id) ? 'a-label a-label--key' : 'a-label'} data-i={i} x={p.x} y={p.y - p.r - 4} textAnchor="middle">
                    {n.name}
                  </text>
                );
              })}
            </g>
          </g>
        </svg>
      </AtlasView>
    </main>
  );
}
