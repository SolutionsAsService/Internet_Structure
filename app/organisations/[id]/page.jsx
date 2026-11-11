import Link from 'next/link';
import { notFound } from 'next/navigation';
import StratumStrip from '../../../components/StratumStrip.jsx';
import { loadAtlas } from '../../../lib/data.js';
import { STRATA, STRATUM_BY_ID } from '../../../lib/strata.js';

export const dynamicParams = false;

export function generateStaticParams() {
  return loadAtlas().nodes.map(n => ({ id: n.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const n = loadAtlas().nodeById.get(id);
  return n ? { title: n.name, description: `${n.name}: ${n.type}. ${n.role}` } : {};
}

export default async function OrganisationPage({ params }) {
  const { id } = await params;
  const atlas = loadAtlas();
  const n = atlas.nodeById.get(id);
  if (!n) notFound();
  const stratum = STRATUM_BY_ID[n.stratum];
  const neighbours = [...atlas.neighbours.get(n.id)].map(x => atlas.nodeById.get(x));
  const byStratum = STRATA.map(s => ({ ...s, list: neighbours.filter(x => x.stratum === s.id).sort((a, b) => a.name.localeCompare(b.name)) })).filter(s => s.list.length);
  const unresolved = atlas.unresolved.filter(u => u.from === n.id).map(u => u.target);

  return (
    <main className="wrap">
      <header className="page-head">
        <p className="crumbs">
          <Link href="/">Home</Link> / <Link href={`/strata/${stratum.id}`}>{stratum.n} {stratum.name}</Link> / {n.name}
        </p>
        <StratumStrip current={stratum.id} />
        <p className="kicker">{n.type}</p>
        <h1>{n.name}</h1>
        <p className="lede">{n.description}</p>
      </header>

      <dl className="facts">
        <div><dt>Stratum</dt><dd><Link href={`/strata/${stratum.id}`}>{stratum.n} {stratum.name}</Link></dd></div>
        <div><dt>Region</dt><dd>{n.region}</dd></div>
        <div><dt>Importance</dt><dd>{n.importance} / 10</dd></div>
        <div><dt>Recorded connections</dt><dd>{neighbours.length}</dd></div>
      </dl>

      <div className="two-col">
        <section aria-labelledby="role">
          <h2 id="role" className="kicker">Role in the network</h2>
          <p style={{ fontSize: 20 }}>{n.role}</p>
          {n.classification?.length > 0 && (
            <p className="muted">{n.classification.join(' · ')}</p>
          )}

          <h2 className="kicker" style={{ marginTop: 32 }}>Connected to, by stratum</h2>
          {byStratum.length === 0 && <p>No connections to other entries are recorded for {n.name} yet.</p>}
          {byStratum.map(s => (
            <div key={s.id} style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, textTransform: 'uppercase', marginBottom: 6 }}>
                <Link href={`/strata/${s.id}`}>{s.n} {s.name}</Link> <span className="muted">· {s.list.length}</span>
              </h3>
              <ul className="link-list">
                {s.list.map(x => (
                  <li key={x.id}><Link href={`/organisations/${x.id}`}>{x.name}</Link><small>{x.type}</small></li>
                ))}
              </ul>
            </div>
          ))}
        </section>
        <aside>
          <p><Link className="button button--primary" href={`/atlas?o=${n.id}`}>See it on the atlas →</Link></p>
          <p className="kicker" style={{ marginTop: 24 }}>Source record</p>
          <p style={{ fontSize: 14 }}>
            id <code>{n.id}</code> · layer tag <code>{n.layer}</code>
            {n.records > 1 ? ` · merged from ${n.records} records that share this id` : ''}
          </p>
          {unresolved.length > 0 && (
            <>
              <p className="kicker" style={{ marginTop: 24 }}>Unresolved references</p>
              <p style={{ fontSize: 14 }}>
                The source also lists {unresolved.map(u => <code key={u}>{u} </code>)} which match no entry in the dataset.{' '}
                <Link href="/about#gaps">What this means</Link>.
              </p>
            </>
          )}
        </aside>
      </div>
    </main>
  );
}
