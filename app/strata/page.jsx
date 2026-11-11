import Link from 'next/link';
import { loadAtlas } from '../../lib/data.js';

export const metadata = {
  title: 'Strata',
  description: 'The seven strata of the internet, from clouds and content down to silicon, machines and power.',
};

export default function StrataIndex() {
  const atlas = loadAtlas();
  const max = Math.max(...atlas.strata.map(s => s.count));
  const maxCrossing = Math.max(...Object.values(atlas.crossings));
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
          <Link key={s.id} href={`/strata/${s.id}`} className={`stratum-card st-${s.id}`}>
            <span className="num" aria-hidden="true">{s.n}</span>
            <h2 style={{ fontSize: 24, textTransform: 'uppercase' }}>{s.name} <span className="muted">· {s.title}</span></h2>
            <p className="q">{s.blurb}</p>
            <div className={`bar-row st-${s.id}`} style={{ gridTemplateColumns: 'minmax(0,1fr) 40px' }} aria-hidden="true">
              <span className="bar" style={{ width: `${(s.count / max) * 100}%` }} />
              <span className="n">{s.count}</span>
            </div>
            <p className="count"><span>{s.count}</span> organisations · {s.layers.length} source layer tags</p>
          </Link>
        ))}
      </div>

      <section className="section" id="matrix" aria-labelledby="matrix-title">
        <div className="section-head">
          <h2 id="matrix-title">Who connects to whom</h2>
          <p>
            Recorded links between each pair of strata ({atlas.links.length} in all; each link counted once). The bar under each number is drawn to one scale
            across the table. The diagonal is links inside one stratum.
          </p>
        </div>
        <div className="table-wrap">
          <table className="matrix">
            <thead>
              <tr><th scope="col"><span className="visually-hidden">From</span></th>{atlas.strata.map(s => <th key={s.id} scope="col" className="num">{s.n} {s.name}</th>)}</tr>
            </thead>
            <tbody>
              {atlas.strata.map(a => (
                <tr key={a.id} className={`st-${a.id}`}>
                  <th scope="row"><Link href={`/strata/${a.id}`}>{a.n} {a.name}</Link></th>
                  {atlas.strata.map(b => {
                    const v = atlas.crossings[[a.id, b.id].sort().join('|')] || 0;
                    const t = v / maxCrossing;
                    return <td key={b.id} className={a.id === b.id ? 'num heat heat--self' : 'num heat'} style={{ '--t': t.toFixed(3) }}><span>{v}</span></td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
