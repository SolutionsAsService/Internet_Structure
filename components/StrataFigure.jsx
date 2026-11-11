import Link from 'next/link';
import { figureGeometry } from '../lib/figure.js';

// The landing graphic: every organisation in the dataset as one dot, filed into seven
// strata, with one real chain of recorded connections drawn through them in red, and the
// history dossiers as the bedrock beneath. Server-rendered; ships no JavaScript.
export default function StrataFigure({ atlas, size, id }) {
  const g = figureGeometry(atlas, size);
  const s = g.size;
  const pts = list => list.map(d => `${d.x},${d.y}`).join(' ');
  const labelY = d => d.y - d.r - 5;
  const clampX = x => Math.min(Math.max(x, g.plotX + 24), s.width - 26);

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
          `A red line traces recorded connections: ${g.route.map(d => d.name).join(', then ')}; a dashed branch runs from Google to ${g.branch.slice(1).map(d => d.name).join(' and ')}. ` +
          `Beneath, ${g.history.ticks.length} history dossiers from ${g.history.minYear} to ${g.history.maxYear}.`}
      </desc>

      {g.bands.map(b => (
        <Link key={b.id} href={`/strata/${b.id}`} className="band" aria-label={`Stratum ${b.n}, ${b.name}: ${b.title}, ${b.count} organisations`}>
          <rect className="band-hit" x="0" y={b.y0} width={s.width} height={s.bandH} />
          <line className="band-rule" x1="0" x2={s.width} y1={b.y0} y2={b.y0} />
          <text className="band-n" x="0" y={b.y0 + s.bandH - 9}>{b.n}</text>
          <text className="band-name" x={size === 'wide' ? 34 : 22} y={b.y0 + (size === 'wide' ? 27 : 21)}>{b.name}</text>
          <text className="band-count" x={size === 'wide' ? 34 : 22} y={b.y0 + (size === 'wide' ? 45 : 37)}>
            {size === 'wide' ? `${b.count} · ${b.title}` : b.count}
          </text>
          {b.dots.map(d => (
            <circle key={d.id} className={d.route ? 'dot dot--route' : 'dot'} cx={d.x} cy={d.y} r={d.r} />
          ))}
        </Link>
      ))}

      <polyline className="route-line" points={pts(g.route)} />
      <polyline className="route-line route-line--branch" points={pts(g.branch)} />
      {g.route.map((d, i) => (
        <text key={d.id} className="route-label" x={clampX(d.x)} y={labelY(d)} textAnchor="middle">
          <tspan className="route-step">{i + 1}</tspan> {d.name}
        </text>
      ))}
      {g.branch.slice(1).map(d => (
        <text key={d.id} className="route-label route-label--branch" x={clampX(d.x)} y={labelY(d)} textAnchor="middle">{d.name}</text>
      ))}
      {[...g.route, ...g.branch.slice(1)].map(d => (
        <circle key={`${d.id}-mark`} className="route-dot" cx={d.x} cy={d.y} r={d.r + 0.8} />
      ))}

      <g className="bedrock">
        <line className="band-rule band-rule--heavy" x1="0" x2={s.width} y1={g.history.y0} y2={g.history.y0} />
        <Link href="/history" aria-label={`History: ${g.history.ticks.length} dossiers, ${g.history.minYear} to ${g.history.maxYear}`}>
          <rect className="band-hit" x="0" y={g.history.y0} width={s.width} height={s.historyH} />
          <text className="band-name" x="0" y={g.history.y0 + (size === 'wide' ? 27 : 21)}>History</text>
          <text className="band-count" x="0" y={g.history.y0 + (size === 'wide' ? 45 : 37)}>
            {size === 'wide' ? `${g.history.ticks.length} dossiers` : `${g.history.ticks.length} files`}
          </text>
        </Link>
        <line className="axis" x1={g.plotX} x2={s.width - s.pad} y1={g.history.axisY} y2={g.history.axisY} />
        {g.history.ticks.map(t => (
          <Link key={t.slug} href={`/history/${t.slug}`} aria-label={`${t.title}, ${t.year}`}>
            <line className="tick" x1={t.x} x2={t.x} y1={g.history.axisY} y2={g.history.axisY - 14 - t.lift * 6} />
            <circle className="tick-head" cx={t.x} cy={g.history.axisY - 14 - t.lift * 6} r={size === 'wide' ? 3.2 : 2.6} />
            {t.short && t.lift === 0 && (
              <text className={t.year === g.history.minYear ? 'tick-label tick-label--first' : 'tick-label'} x={t.x} y={g.history.axisY - 24} textAnchor={t.year === g.history.minYear ? 'start' : 'end'} dx={t.year === g.history.minYear ? -3 : -6}>
                {t.short} {t.year}
              </text>
            )}
          </Link>
        ))}
        <text className="axis-year" x={g.plotX} y={g.history.axisY + 14}>{g.history.minYear}</text>
        <text className="axis-year" x={s.width - s.pad} y={g.history.axisY + 14} textAnchor="end">{g.history.maxYear}</text>
      </g>
    </svg>
  );
}
