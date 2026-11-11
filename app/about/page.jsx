import Link from 'next/link';
import { ALIASES, loadAtlas } from '../../lib/data.js';
import { STRATA, TYPE_OVERRIDES } from '../../lib/strata.js';

export const metadata = {
  title: 'About the data',
  description: 'How the Internet Structure atlas is built: sources, the seven strata, merged records, repaired and unresolved references.',
};

export default function About() {
  const atlas = loadAtlas();
  const overridden = atlas.nodes.filter(n => TYPE_OVERRIDES.some(r => r.pattern.test(n.type)) && !STRATA.find(s => s.id === n.stratum).layers.includes(n.layer));
  return (
    <main className="wrap">
      <header className="page-head">
        <p className="crumbs"><Link href="/">Home</Link> / About</p>
        <h1>About the data</h1>
        <p className="lede">
          Everything on this site is computed at build time from the JSON files in the repository. Nothing is fetched from
          a third party, and the pages are static HTML.
        </p>
      </header>

      <dl className="facts">
        <div><dt>Source records</dt><dd>{atlas.sourceRecords}</dd></div>
        <div><dt>Organisations after merging</dt><dd>{atlas.nodes.length}</dd></div>
        <div><dt>Recorded connections</dt><dd>{atlas.links.length}</dd></div>
        <div><dt>References repaired</dt><dd>{atlas.repaired.length}</dd></div>
        <div><dt>References unresolved</dt><dd>{atlas.unresolved.length}</dd></div>
        <div><dt>Hubs holding half the links</dt><dd>{atlas.hubs.size}</dd></div>
        <div><dt>No recorded connection</dt><dd>{atlas.isolated}</dd></div>
      </dl>

      <div className="dossier">
        <section id="counting">
          <h2>How each number is counted</h2>
          <dl>
            <dt>{atlas.sourceRecords} source records</dt><dd>Entries in the <code>nodes</code> array of <code>data/internet.json</code>.</dd>
            <dt>{atlas.nodes.length} organisations</dt><dd>Distinct <code>id</code> values after merging records that share one.</dd>
            <dt>{atlas.links.length} recorded connections</dt><dd>Every <code>connections</code> entry that resolves to another organisation, treated as undirected and counted once per pair (A→B and B→A are one link). Self-references are dropped.</dd>
            <dt>{atlas.repaired.length} references repaired</dt><dd>Connection entries, counted after merging, whose written id differs from the id they resolve to.</dd>
            <dt>{atlas.unresolved.length} references unresolved</dt><dd>Connection entries, counted after merging, that resolve to nothing; one entry per occurrence.</dd>
            <dt>{atlas.hubs.size} hubs</dt><dd>Rank organisations by recorded connections (ties: importance, then name) and take them from the top until their connections, counted at both ends, reach half of all link endpoints ({atlas.hubEndpoints} of {atlas.links.length * 2}). Together they touch {atlas.hubLinks} of the {atlas.links.length} links.</dd>
            <dt>{atlas.isolated} with no connection</dt><dd>Organisations with no resolvable connection in either direction.</dd>
          </dl>
          <p>Reproduce them with <code>npm run validate:data</code>; the code is <code>lib/data.js</code>.</p>
        </section>
        <section>
          <h2>Strata</h2>
          <p>
            The source tags each record with one of {atlas.layerCount} <code>layer</code> values. The atlas folds them into
            seven strata (<Link href="/strata">see them</Link>). The mapping is in <code>lib/strata.js</code> and a test fails
            if a new layer tag arrives without one. One rule overrides the tag: a record whose type names DNS or a registry is
            filed under Name. That moves {overridden.length} record{overridden.length === 1 ? '' : 's'}:{' '}
            {overridden.map((n, i) => <span key={n.id}>{i ? ', ' : ''}<Link href={`/organisations/${n.id}`}>{n.name}</Link></span>)}.
          </p>
        </section>
        <section>
          <h2>Merged records</h2>
          <p>
            {atlas.duplicates.length} ids appear more than once in <code>data/internet.json</code> ({atlas.sourceRecords} records,{' '}
            {atlas.nodes.length} distinct ids). Each set is merged into one organisation: the record with the higher importance
            supplies the name, type and description, and connections and classifications are combined. Merged ids:{' '}
            {atlas.duplicates.map((id, i) => <span key={id}>{i ? ', ' : ''}<Link href={`/organisations/${id}`}>{id}</Link></span>)}.
          </p>
        </section>
        <section id="gaps">
          <h2>Repaired and unresolved references</h2>
          <p>
            {atlas.repaired.length} connection references use a spelling of an existing id (<code>de-cix</code> for{' '}
            <code>decix</code>) and are resolved automatically or by an explicit alias ({Object.entries(ALIASES).map(([a, b]) => `${a} → ${b}`).join(', ')}).
          </p>
          <p>
            {atlas.unresolved.length} references still match no entry. Most are category words such as “fiber” or “routing”
            rather than organisations, or organisations not yet in the dataset. They are left out of the map rather than
            guessed. By reference:
          </p>
          <ul style={{ columns: '3 180px', fontSize: 14 }}>
            {atlas.unresolvedByTarget.map(([t, c]) => <li key={t}><code>{t}</code> × {c}</li>)}
          </ul>
        </section>
        <section>
          <h2>The red line</h2>
          <p>
            The landing graphic’s route is a chain of connections recorded in the data, picked by hand so that it passes
            through all seven strata. A test checks every step is a real link. It shows dependency, not a measured
            traceroute, and where each stop sits along its band is chosen for legibility, not measured.
          </p>
        </section>
        <section>
          <h2>Speed</h2>
          <p>
            Every page is pre-rendered. The atlas layout is computed once at build time, so the browser draws finished
            coordinates and runs no physics. The landing page and every inner page work with JavaScript turned off; the
            atlas needs it only for pan, zoom, search and selection.
          </p>
        </section>
        <section>
          <h2>Check it yourself</h2>
          <p><code>npm test</code> runs the data and figure checks; <code>npm run validate:data</code> reports references that do not resolve.</p>
        </section>
      </div>
    </main>
  );
}
