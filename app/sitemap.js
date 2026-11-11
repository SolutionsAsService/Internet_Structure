import { loadAtlas } from '../lib/data.js';
import { STRATA } from '../lib/strata.js';
import { DOSSIERS } from '../lib/dossiers.js';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || '';

export default function sitemap() {
  const paths = [
    '/', '/atlas', '/strata', '/organisations', '/history', '/how-it-works', '/about',
    ...STRATA.map(s => `/strata/${s.id}`),
    ...DOSSIERS.map(d => `/history/${d.slug}`),
    ...loadAtlas().nodes.map(n => `/organisations/${n.id}`),
  ];
  return paths.map(p => ({ url: `${BASE}${p}` }));
}
