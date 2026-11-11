import Link from 'next/link';
import { notFound } from 'next/navigation';
import StratumStrip from '../../../components/StratumStrip.jsx';
import { loadAtlas } from '../../../lib/data.js';
import { STRATA, STRATUM_BY_ID } from '../../../lib/strata.js';

export const dynamicParams = false;

export function generateStaticParams() {
  return STRATA.map(s => ({ id: s.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const s = STRATUM_BY_ID[id];
  return s ? { title: `${s.n} ${s.name}: ${s.title}`, description: s.blurb } : {};
}

export default async function StratumPage({ params }) {
  const { id } = await params;
  const atlas = loadAtlas();
  const stratum = atlas.strata.find(s => s.id === id);
  if (!stratum) notFound();
  const members = stratum.members.map(m => atlas.nodeById.get(m));

  // Where this stratum's connections go.
  const reach = atlas.strata.map(other => ({
    ...other,
    links: atlas.crossings[[stratum.id, other.id].sort().join('|')] || 0,
  }));
  // One scale for all seven stratum pages: the largest link count between two different strata.
  const sharedMax = Math.max(1, ...Object.entries(atlas.crossings).filter(([k]) => { const [a, b] = k.split('|'); return a !== b; }).map(([, v]) => v));
  const within = reach.find(r => r.id === stratum.id).links;
  const others = reach.filter(r => r.id !== stratum.id);
  const tags = [...new Set(members.map(m => m.layer))];
  const regions = [...new Set(members.map(m => m.region))];

  return (
    <main className="wrap">
      <header className="page-head">
        <p className="crumbs"><Link href="/">Home</Link> / <Link href="/strata">Strata</Link> / {stratum.name}</p>
        <StratumStrip current={stratum.id} />
        <h1>{stratum.n} · {stratum.name}</h1>
        <p className="lede"><strong>{stratum.title}.</strong> {stratum.blurb}</p>
      </header>

      <dl className="facts">
        <div><dt>Organisations</dt><dd>{stratum.count}</dd></div>
        <div><dt>Source layer tags</dt><dd>{tags.length}</dd></div>
        <div><dt>Regions named</dt><dd>{regions.length}</dd></div>
        <div><dt>Hubs</dt><dd>{members.filter(m => m.hub).length} of {atlas.hubs.size}</dd></div>
        <div><dt>Links to other strata</dt><dd>{others.reduce((a, r) => a + r.links, 0)}</dd></div>
      </dl>

      <div className="two-col">
        <section aria-labelledby="who">
          <h2 id="who" className="kicker">Who is in it, by importance</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Organisation</th><th>Type</th><th>Region</th><th className="num">Links</th></tr>
              </thead>
              <tbody>
                {members.map(m => (
                  <tr key={m.id}>
                    <td><Link href={`/organisations/${m.id}`}>{m.name}</Link>{m.hub && <span className="hub-tag">hub</span>}</td>
                    <td>{m.type}</td>
                    <td>{m.region}</td>
                    <td className="num">{m.degree}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <aside aria-labelledby="reach">
          <h2 id="reach" className="kicker">Where its connections go</h2>
          <p className="muted" style={{ fontSize: 14 }}>
            Recorded links from {stratum.name} to each other stratum. All seven stratum pages share one scale (full width = {sharedMax} links).
          </p>
          {others.map(r => (
            <div className="bar-row" key={r.id}>
              <Link href={`/strata/${r.id}`}>{r.n} {r.name}</Link>
              <span className="bar-track"><span className="bar" style={{ width: `${(r.links / sharedMax) * 100}%` }} aria-hidden="true" /></span>
              <span className="n">{r.links}</span>
            </div>
          ))}
          <p style={{ fontSize: 14, marginTop: 8 }}>Plus <strong>{within}</strong> links between organisations inside {stratum.name}.</p>
          <p style={{ fontSize: 14 }}><Link href="/strata#matrix">All crossings as one table</Link></p>
          <p className="kicker" style={{ marginTop: 24 }}>Source tags folded in</p>
          <p style={{ fontSize: 14 }}>{tags.join(', ')}</p>
        </aside>
      </div>
    </main>
  );
}
