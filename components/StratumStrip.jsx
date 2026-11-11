import Link from 'next/link';
import { STRATA } from '../lib/strata.js';

// Seven-cell locator used on inner pages: where in the stack this page sits.
export default function StratumStrip({ current }) {
  return (
    <nav className="strip" aria-label="Strata">
      {STRATA.map(s => (
        <Link key={s.id} href={`/strata/${s.id}`} aria-current={s.id === current ? 'true' : undefined}>
          {s.n} {s.name}
        </Link>
      ))}
    </nav>
  );
}
