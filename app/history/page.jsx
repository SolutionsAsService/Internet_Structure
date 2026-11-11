import Link from 'next/link';
import { DOSSIERS } from '../../lib/dossiers.js';

export const metadata = {
  title: 'History',
  description: 'Dossiers on the networks and companies the internet was built on: the Bell System, AT&T, packet switching, ARPANET, the IMP, packet radio, SATNET, DNS, the Baby Bells and Verizon.',
};

export default function HistoryIndex() {
  const eras = [...new Set(DOSSIERS.map(d => d.era))];
  return (
    <main className="wrap">
      <header className="page-head">
        <p className="crumbs"><Link href="/">Home</Link> / History</p>
        <h1>Bedrock</h1>
        <p className="lede">
          {DOSSIERS.length} dossiers, {DOSSIERS[0].year} to {DOSSIERS[DOSSIERS.length - 1].year}: the telephone monopoly the
          first packets ran over, the experiments that proved packets work, and the break-up that made today’s carriers.
        </p>
      </header>
      {eras.map(era => (
        <section key={era} className="section" style={{ paddingTop: 24 }}>
          <h2 className="kicker">{era}</h2>
          <ol className="timeline">
            {DOSSIERS.filter(d => d.era === era).map(d => (
              <li key={d.slug}>
                <span className="year">{d.year}</span>
                <div>
                  <h3><Link href={`/history/${d.slug}`}>{d.title}</Link></h3>
                  <p>{d.dek}</p>
                  <p style={{ fontSize: 13 }}>{d.year}: {d.marks}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      ))}
      <p style={{ marginTop: 32 }}>
        Looking for the present-day picture instead? <Link href="/how-it-works">How the internet works</Link> walks one request end to end.
      </p>
    </main>
  );
}
