import Link from 'next/link';
import Dossier, { dossierToc } from '../../components/Dossier.jsx';
import { EXPLAINER, cleanText, loadDossier } from '../../lib/dossiers.js';
import { STRATUM_BY_ID } from '../../lib/strata.js';

export const metadata = {
  title: 'How the internet works',
  description: 'One request, end to end: DNS, transport, IP, routers, ISPs, BGP, exchanges, backbones and cables, and the data centre at the other end.',
};

// Explainer topics that have a stratum in the atlas.
const TOPIC_STRATUM = [
  ['DNS', 'name'], ['BGP', 'name'], ['internet_exchange_points', 'meet'], ['peering_and_transit', 'meet'],
  ['ISP_hierarchy', 'carry'], ['cellular_internet', 'carry'], ['satellite_internet', 'carry'],
  ['fiber_optics', 'wire'], ['submarine_cables', 'wire'], ['data_centers', 'meet'], ['cloud_computing', 'serve'],
  ['content_delivery_networks', 'serve'], ['internet_governance_and_standards', 'govern'], ['routers', 'make'],
];

export default function HowItWorks() {
  const record = loadDossier(EXPLAINER.file);
  const exec = record.executive_model;
  const { end_to_end_example: e2e, executive_model: _skip, ...rest } = record;
  const steps = Object.entries(e2e).filter(([k]) => k.startsWith('step_'));
  const toc = dossierToc(rest);

  return (
    <main className="wrap">
      <header className="page-head">
        <p className="crumbs"><Link href="/">Home</Link> / How it works</p>
        <h1>How a request travels</h1>
        <p className="lede">{cleanText(exec.one_sentence_explanation)}</p>
      </header>

      <div className="two-col" style={{ gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 1fr)' }}>
        <div>
          <h2 className="kicker">The short version, in {exec.simple_flow.length} steps</h2>
          <ol className="flow">
            {exec.simple_flow.map((s, i) => <li key={i}><span>{cleanText(s)}</span></li>)}
          </ol>
          <p style={{ fontSize: 20, fontWeight: 650 }}>{cleanText(exec.key_principle)}</p>

          <section className="section" aria-labelledby="e2e">
            <h2 id="e2e" style={{ fontSize: 36, fontVariationSettings: "'wdth' 62", textTransform: 'uppercase' }}>
              {cleanText(e2e.scenario)}
            </h2>
            <ol className="flow" style={{ marginTop: 16 }}>
              {steps.map(([key, step]) => (
                <li key={key}>
                  <div>
                    <strong>{key.replace(/^step_\d+_/, '').replace(/_/g, ' ')}</strong>
                    <dl style={{ display: 'grid', gridTemplateColumns: 'minmax(90px, 160px) minmax(0, 1fr)', gap: '2px 14px', margin: '6px 0 0', fontSize: 15 }}>
                      {Object.entries(step).map(([k, v]) => (
                        <div key={k} style={{ display: 'contents' }}>
                          <dt className="muted">{k.replace(/_/g, ' ')}</dt>
                          <dd style={{ margin: 0 }}>{Array.isArray(v) ? v.map(cleanText).join(', ') : cleanText(v)}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="section" aria-label="Reference">
            <Dossier record={rest} />
          </section>
        </div>
        <aside>
          <div className="toc">
            <p className="kicker">Where it lives in the atlas</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
              {TOPIC_STRATUM.map(([topic, s]) => (
                <li key={topic} className="topic-row">
                  <a href={`#${topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>{topic.replace(/_/g, ' ')}</a>{' '}
                  → <Link href={`/strata/${s}`}>{STRATUM_BY_ID[s].n} {STRATUM_BY_ID[s].name}</Link>
                </li>
              ))}
            </ul>
            <details>
              <summary className="kicker">All {toc.length} sections</summary>
              <ol>{toc.map(t => <li key={t.id}><a href={`#${t.id}`}>{t.label}</a></li>)}</ol>
            </details>
          </div>
        </aside>
      </div>
    </main>
  );
}
