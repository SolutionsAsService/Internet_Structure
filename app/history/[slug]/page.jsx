import Link from 'next/link';
import { notFound } from 'next/navigation';
import Dossier, { dossierToc } from '../../../components/Dossier.jsx';
import { DOSSIERS, DOSSIER_BY_SLUG, loadDossier } from '../../../lib/dossiers.js';

export const dynamicParams = false;

export function generateStaticParams() {
  return DOSSIERS.map(d => ({ slug: d.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const d = DOSSIER_BY_SLUG[slug];
  return d ? { title: `${d.title} (${d.year})`, description: d.dek } : {};
}

export default async function DossierPage({ params }) {
  const { slug } = await params;
  const d = DOSSIER_BY_SLUG[slug];
  if (!d) notFound();
  const record = loadDossier(d.file);
  const toc = dossierToc(record);
  const i = DOSSIERS.indexOf(d);
  const prev = DOSSIERS[i - 1];
  const next = DOSSIERS[i + 1];

  return (
    <div className="copper full-bleed">
    <main className="wrap">
      <header className="page-head">
        <p className="crumbs"><Link href="/">Home</Link> / <Link href="/history">History</Link> / {d.title}</p>
        <p className="kicker"><span style={{ color: 'var(--signal)' }}>{d.year}</span> · {d.marks} · {d.era}</p>
        <h1>{d.title}</h1>
        <p className="lede">{d.dek}</p>
      </header>
      <div className="two-col" style={{ gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 1fr)' }}>
        <Dossier record={record} />
        <aside>
          <nav className="toc" aria-label="In this dossier">
            <p className="kicker">In this dossier</p>
            <ol>{toc.map(t => <li key={t.id}><a href={`#${t.id}`}>{t.label}</a></li>)}</ol>
          </nav>
        </aside>
      </div>
      <nav className="section" aria-label="More history" style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        {prev ? <Link href={`/history/${prev.slug}`}>← {prev.year} {prev.title}</Link> : <span />}
        {next ? <Link href={`/history/${next.slug}`}>{next.year} {next.title} →</Link> : <Link href="/history">All history →</Link>}
      </nav>
      <p className="muted" style={{ fontSize: 14 }}>Rendered from <code>data/{d.file}</code>; provenance fields are omitted here and kept in the source file.</p>
    </main>
    </div>
  );
}
