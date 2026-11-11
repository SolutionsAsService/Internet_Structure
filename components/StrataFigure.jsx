import Link from 'next/link';
import { figureGeometry } from '../lib/figure.js';

// The landing graphic: every organisation in the dataset as one dot, filed into seven
// strata, hubs in ink, one real chain of recorded connections drawn through them in red,
// and the history dossiers as the bedrock beneath. Server-rendered; ships no JavaScript.
export default function StrataFigure({ atlas, size, id }) {
  const g = figureGeometry(atlas, size);
  const s = g.size;
  const wide = size === 'wide';
  const pts = list => list.map(d => `${d.x},${d.y}`).join(' ');
  const badgeR = wide ? 8 : 7;
  const labelY = d => d.y - d.r - (wide ? 8 : 7);
  const clampX = x => Math.min(Math.max(x, g.plotX + 12), s.width - 90);
  const hubTotal = atlas.hubs.size;

  return (
    <svg
      className={`strata-figure strata-figure--${size}`}
      viewBox={`0 0 ${s.width} ${g.height}`}
      width={s.width}
      height={g.height}
      role="img"
      aria-labelledby={`${id}-title ${id}-desc`}
    >
      <title id={`${id}-title`}>The internet in seven strata</title>
      <desc id={`${id}-desc`}>
        {`${atlas.nodes.length} organisations, one dot each, filed into seven strata from Serve at the top to Make at the bottom. ` +
          `${hubTotal} of them, drawn as filled dots, together account for half of all recorded connection ends; the rest are rings. ` +
          `A red line traces recorded connections: ${g.route.map(d => d.name).join(', then ')}; a dashed branch runs from Google to ${g.branch.slice(1).map(d => d.name).join(' and ')}. ` +
          `Beneath, ${g.history.ticks.length} history dossiers from ${g.history.minYear} to ${g.history.maxYear}.`}
      </desc>

      {g.bands.map(b => (
        <Link key={b.id} href={`/strata/${b.id}`} className={`band st-${b.id}`} aria-label={`Stratum ${b.n}, ${b.name}: ${b.title}, ${b.count} organisations, ${b.hubs} hubs`}>
          <rect className="band-wash" x={g.plotX - 6} y={b.y0 + 1} width={s.width - g.plotX + 6} height={b.h - 1} />
          <rect className="band-hit" x="0" y={b.y0} width={s.width} height={b.h} />
          <line className="band-rule" x1="0" x2={s.width} y1={b.y0} y2={b.y0} />
          <text className="band-n" x="0" y={b.y0 + b.h - (wide ? 9 : 7)}>{b.n}</text>
          <text className="band-name" x={wide ? 36 : 22} y={b.y0 + (wide ? 21 : 16)}>{b.name}<tspan className="band-arrow" dx="4">→</tspan></text>
          <text className="band-count" x={wide ? 36 : 22} y={b.y0 + (wide ? 38 : 31)}>
            {wide ? `${b.count} · ${b.title}` : b.count}
          </text>
          {b.dots.map(d => (
            <circle key={d.id} className={d.hub ? 'dot dot--hub' : 'dot'} cx={d.x} cy={d.y} r={d.r} />
          ))}
        </Link>
      ))}

      <polyline className="route-line" points={pts(g.route)} />
      <polyline className="route-line route-line--branch" points={pts(g.branch)} />
      {[...g.route, ...g.branch.slice(1)].map(d => (
        <circle key={`${d.id}-ring`} className="route-ring" cx={d.x} cy={d.y} r={d.r + 2.4} />
      ))}
      {g.route.map((d, i) => {
        const x = clampX(d.x);
        return (
          <g key={d.id}>
            <text className="route-label" x={x + badgeR + 3} y={labelY(d)} dominantBaseline="central">{d.name}</text>
            <circle className="route-badge" cx={x} cy={labelY(d)} r={badgeR} />
            <text className="route-badge-n" x={x} y={labelY(d)} textAnchor="middle" dominantBaseline="central">{i + 1}</text>
          </g>
        );
      })}
      {g.branch.slice(1).map((d, i) => (
        <text key={d.id} className="route-label route-label--branch" x={i === 0 ? d.x - d.r - 5 : d.x + d.r + 5} y={labelY(d)} textAnchor={i === 0 ? 'end' : 'start'} dominantBaseline="central">{d.name}</text>
      ))}

      <Link href="/history" className="band bedrock" aria-label={`History: ${g.history.ticks.length} dossiers, ${g.history.minYear} to ${g.history.maxYear}`}>
        <rect className="band-hit" x="0" y={g.history.y0} width={s.width} height={s.historyH} />
        <line className="band-rule band-rule--heavy" x1="0" x2={s.width} y1={g.history.y0} y2={g.history.y0} />
        <text className="band-name" x="0" y={g.history.y0 + (wide ? 21 : 16)}>History<tspan className="band-arrow" dx="4">→</tspan></text>
        <text className="band-count" x="0" y={g.history.y0 + (wide ? 38 : 31)}>
          {`${g.history.ticks.length} dossiers`}
        </text>
        <line className="axis" x1={g.plotX} x2={s.width - s.pad} y1={g.history.axisY} y2={g.history.axisY} />
        {g.history.marks.map(m => (
          <g key={m.year}>
            <line className="axis-mark" x1={m.x} x2={m.x} y1={g.history.axisY} y2={g.history.axisY + 4} />
            <text className="axis-year" x={m.x} y={g.history.axisY + 16} textAnchor="middle">{m.year}</text>
          </g>
        ))}
        {g.history.ticks.map(t => {
          const top = g.history.axisY - 14 - t.lift * 7;
          return (
            <g key={t.slug}>
              <line className="tick" x1={t.x} x2={t.x} y1={g.history.axisY} y2={top} />
              <circle className="tick-head" cx={t.x} cy={top} r={wide ? 3.4 : 2.8} />
              {t.short && t.lift === 0 && (
                <text className={t.year === g.history.minYear ? 'tick-label tick-label--first' : 'tick-label'} x={t.x} y={g.history.axisY - 14 - 2 * 7 - 9} textAnchor={t.year === g.history.minYear ? 'start' : 'end'} dx={t.year === g.history.minYear ? -3 : 4}>
                  {t.short} {t.year}
                </text>
              )}
            </g>
          );
        })}
      </Link>
    </svg>
  );
}
