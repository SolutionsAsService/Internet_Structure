import Link from 'next/link';
import { loadAtlas } from '../../lib/data.js';
import { STRATUM_BY_ID } from '../../lib/strata.js';

export const metadata = {
  title: 'All organisations',
  description: 'Every organisation in the Internet Structure dataset, A to Z, with its stratum and type.',
};

export default function OrganisationsIndex() {
  const atlas = loadAtlas();
  const sorted = [...atlas.nodes].sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
  const groups = new Map();
  for (const n of sorted) {
    const letter = /[a-z]/i.test(n.name[0]) ? n.name[0].toUpperCase() : '#';
    if (!groups.has(letter)) groups.set(letter, []);
    groups.get(letter).push(n);
  }
  return (
    <main className="wrap">
      <header className="page-head">
        <p className="crumbs"><Link href="/">Home</Link> / Organisations</p>
        <h1>{atlas.nodes.length} organisations</h1>
        <p className="lede">Every entry in the dataset, A to Z. Each one has its own page with its role and every recorded connection.</p>
        <nav aria-label="Letters" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px', fontWeight: 700 }}>
          {[...groups.keys()].map(l => <a key={l} href={`#l-${l}`} style={{ display: 'inline-grid', placeItems: 'center', minWidth: 28, minHeight: 36 }}>{l}</a>)}
        </nav>
      </header>
      {[...groups.entries()].map(([letter, list]) => (
        <section key={letter} id={`l-${letter}`} className="section" style={{ padding: '20px 0' }}>
          <h2 style={{ fontSize: 40, fontVariationSettings: "'wdth' 62", marginBottom: 10 }}>{letter}</h2>
          <ul className="link-list">
            {list.map(n => (
              <li key={n.id}>
                <Link href={`/organisations/${n.id}`}>{n.name}</Link>
                <small>{STRATUM_BY_ID[n.stratum].n} {STRATUM_BY_ID[n.stratum].name} · {n.type}</small>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
