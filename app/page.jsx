import Link from 'next/link';
import StrataFigure from '../components/StrataFigure.jsx';
import { loadAtlas, ROUTE_IDS, ROUTE_BRANCH_IDS } from '../lib/data.js';
import { STRATUM_BY_ID } from '../lib/strata.js';
import { DOSSIERS } from '../lib/dossiers.js';

export default function Home() {
  const atlas = loadAtlas();
  const route = ROUTE_IDS.map(id => atlas.nodeById.get(id));
  const branch = ROUTE_BRANCH_IDS.slice(1).map(id => atlas.nodeById.get(id));
  const total = atlas.nodes.length;
  const lede = (
    <p className="lede">
      Each dot is one of the {total} companies, cables, exchanges and standards bodies in this atlas, filed by what it
      does. The red line follows recorded connections through all seven strata: a {route[0].name} home, {route[1].name},
      the {route[2].name} cable, {route[3].name}, {route[4].name} and {route[5].name}, with {branch.map(n => n.name).join(' and ')} underneath.
    </p>
  );

  return (
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="kicker"><span className="red">■</span> An atlas of the internet’s owners</p>
          <h1 id="hero-title">No one owns the internet. <em>{total} organisations</em> hold it up.</h1>
          {lede}
          <div className="hero-ctas">
            <Link className="button button--primary" href="/atlas">Explore the atlas →</Link>
            <Link className="button" href="/how-it-works">How a request travels</Link>
          </div>
        </div>
        <figure className="hero-figure">
          <StrataFigure atlas={atlas} size="wide" id="fig-wide" />
          <StrataFigure atlas={atlas} size="narrow" id="fig-narrow" />
          <figcaption>Tap a stratum to open it. Dot size is the dataset’s importance score (1–10).</figcaption>
        </figure>
      </section>

      <div className="hero-after">
        {lede}
        <div className="hero-ctas">
          <Link className="button button--primary" href="/atlas">Explore the atlas →</Link>
          <Link className="button" href="/how-it-works">How a request travels</Link>
        </div>
      </div>

      <div className="wrap">
        <section className="section" aria-labelledby="strata-title">
          <div className="section-head">
            <h2 id="strata-title">Seven strata</h2>
            <p>
              The source data files every organisation under one of {atlas.layerCount} layer tags. The atlas folds those
              tags into seven strata, ordered from the person using the internet down to the ground it is built from.
            </p>
          </div>
          <div className="strata-grid">
            {atlas.strata.map(s => (
              <Link key={s.id} href={`/strata/${s.id}`} className="stratum-card">
                <span className="num" aria-hidden="true">{s.n}</span>
                <h3>{s.name} <span className="muted">· {s.title}</span></h3>
                <p className="q">{s.question}</p>
                <p className="count"><span>{s.count}</span> organisations · e.g. {s.members.slice(0, 3).map(id => atlas.nodeById.get(id).name).join(', ')}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="section" aria-labelledby="route-title">
          <div className="section-head">
            <h2 id="route-title">Follow the red line</h2>
            <p>
              Every step below is a connection recorded in the dataset, not an illustration. Open any stop to see
              everything else it connects to.
            </p>
          </div>
          <ol className="route-steps">
            {[...route, ...branch].map((n, i) => (
              <li key={n.id}>
                <span className="step" aria-hidden="true">{i < route.length ? i + 1 : '↳'}</span>
                <h3><Link href={`/organisations/${n.id}`}>{n.name}</Link></h3>
                <span className="where">{STRATUM_BY_ID[n.stratum].n} · {STRATUM_BY_ID[n.stratum].name} · {n.type}</span>
                <p>{n.role}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="section" aria-labelledby="history-title">
          <div className="section-head">
            <h2 id="history-title">Bedrock</h2>
            <p>
              {DOSSIERS.length} dossiers on the networks and companies the present one was built on, from the telephone
              monopoly to the first packet.
            </p>
          </div>
          <ol className="timeline">
            {DOSSIERS.map(d => (
              <li key={d.slug}>
                <span className="year">{d.year}</span>
                <div>
                  <span className="era">{d.era}</span>
                  <h3><Link href={`/history/${d.slug}`}>{d.title}</Link></h3>
                  <p>{d.dek}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  );
}
