import Link from 'next/link';
import { loadAtlas } from '../../lib/data.js';

export const metadata = {
  title: 'Strata',
  description: 'The seven strata of the internet, from clouds and content down to silicon, machines and power.',
};

export default function StrataIndex() {
  const atlas = loadAtlas();
  const max = Math.max(...atlas.strata.map(s => s.count));
  return (
    <main className="wrap">
      <header className="page-head">
        <p className="crumbs"><Link href="/">Home</Link> / Strata</p>
        <h1>Seven strata</h1>
        <p className="lede">
          The dataset tags each organisation with one of {atlas.layerCount} layers. Those tags are folded here into seven
          strata, top to bottom: from where the content lives down to what the hardware is made of.
        </p>
      </header>
      <div className="strata-grid">
        {atlas.strata.map(s => (
          <Link key={s.id} href={`/strata/${s.id}`} className="stratum-card">
            <span className="num" aria-hidden="true">{s.n}</span>
            <h2 style={{ fontSize: 24, textTransform: 'uppercase' }}>{s.name} <span className="muted">· {s.title}</span></h2>
            <p className="q">{s.blurb}</p>
            <div className="bar-row" style={{ gridTemplateColumns: 'minmax(0,1fr) 40px' }} aria-hidden="true">
              <span className="bar" style={{ width: `${(s.count / max) * 100}%` }} />
              <span className="n">{s.count}</span>
            </div>
            <p className="count"><span>{s.count}</span> organisations · {s.layers.length} source layer tags</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
