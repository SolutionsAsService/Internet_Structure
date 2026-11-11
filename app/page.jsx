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
  const hubs = atlas.hubs.size;
  // The headline underline is a stacked bar of the hubs by stratum, in stratum colours.
  const hubStrata = atlas.strata.slice().reverse().map(s => ({ id: s.id, name: s.name, n: s.members.filter(id => atlas.nodeById.get(id).hub).length }));
  let acc = 0;
  const stops = hubStrata.filter(s => s.n).map(s => { const a = (acc / hubs) * 100; acc += s.n; return `var(--s-${s.id}) ${a.toFixed(2)}% ${((acc / hubs) * 100).toFixed(2)}%`; });
  const noHub = hubStrata.filter(s => !s.n).map(s => s.name);
  const lede = (
    <p className="lede">
      Every dot is one organisation in this dataset, filed by what it does. The {hubs} filled dots are the fewest that
      together account for half of all connection ends; they touch {atlas.hubLinks} of {atlas.links.length} recorded
      links. The bar under the headline splits them by stratum{noHub.length ? ` (none in ${noHub.join(' or ')})` : ''}.
      The red line is one chain of recorded links, picked to pass through every stratum.
    </p>
  );

  return (
    <main>
      <div className="night">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="kicker"><span className="red">■</span> An atlas of who holds the internet up</p>
          <h1 id="hero-title">{total} organisations hold the internet up. <em className="hub-bar" style={{ backgroundImage: `linear-gradient(90deg, ${stops.join(', ')})` }}>{hubs} of them hold half of it.</em></h1>
          <p className="hero-mobile-cta"><Link className="button button--primary" href="/atlas">Explore the atlas →</Link></p>
          {lede}
          <div className="hero-ctas">
            <Link className="button button--primary" href="/atlas">Explore the atlas →</Link>
            <Link className="button" href="/how-it-works">How a request travels</Link>
          </div>
        </div>
        <figure className="hero-figure">
          <ul className="legend" aria-label="Key">
            <li><span className="key key--hub" aria-hidden="true" />hub (filled)</li>
            <li><span className="key key--other" aria-hidden="true" />other (ring)</li>
            <li><span className="key key--strata fibre-ribbon" aria-hidden="true" />stratum, in fibre-cable colours (TIA-598)</li>
            <li><span className="key key--route" aria-hidden="true" />a chain of recorded links</li>
          </ul>
          <StrataFigure atlas={atlas} size="wide" id="fig-wide" />
          <StrataFigure atlas={atlas} size="narrow" id="fig-narrow" />
          <figcaption>
            Bands are strata, heaviest where most organisations sit; position along a band means nothing.
            Verisign counts as Name by its type. <Link href="/about">About the data</Link>
          </figcaption>
        </figure>
      </section>

      <div className="hero-after">
        {lede}
        <div className="hero-ctas">
          <Link className="button" href="/how-it-works">How a request travels</Link>
          <Link className="button" href="/about#gaps">What the data leaves out</Link>
        </div>
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
              <Link key={s.id} href={`/strata/${s.id}`} className={`stratum-card st-${s.id}${s.count >= 40 ? ' stratum-card--wide' : ''}`}>
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

        <section className="section copper copper-block" aria-labelledby="history-title">
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
