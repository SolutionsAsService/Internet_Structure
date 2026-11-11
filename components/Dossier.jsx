import { anchorId, cleanText, humanize, isObject, isProvenanceKey, isScalar, sectionsOf } from '../lib/dossiers.js';

// Renders a JSON dossier as readable sections: scalars become definition lists, lists of
// scalars become bullet lists, nested objects become sub-sections. Server-only.
function formatScalar(value) {
  if (value === true) return 'Yes';
  if (value === false) return 'No';
  if (value === null) return '—';
  return cleanText(value);
}

function Value({ value, depth }) {
  if (isScalar(value)) return <>{formatScalar(value)}</>;
  if (Array.isArray(value)) {
    if (value.every(isScalar)) {
      const items = value.map(formatScalar).filter(Boolean);
      if (items.length === 1) return <>{items[0]}</>;
      return <ul>{items.map((v, i) => <li key={i}>{v}</li>)}</ul>;
    }
    return (
      <div>
        {value.map((item, i) => (
          <div className="nested" key={i}>
            <Value value={item} depth={depth + 1} />
          </div>
        ))}
      </div>
    );
  }
  return <Block record={value} depth={depth + 1} />;
}

function Block({ record, depth }) {
  const entries = Object.entries(record).filter(([k, v]) => !isProvenanceKey(k) && !(typeof v === 'string' && !cleanText(v)));
  const flat = entries.filter(([, v]) => isScalar(v) || (Array.isArray(v) && v.every(isScalar) && v.length <= 1));
  const rich = entries.filter(e => !flat.includes(e));
  const H = depth <= 1 ? 'h3' : 'h4';
  return (
    <>
      {flat.length > 0 && (
        <dl>
          {flat.map(([k, v]) => (
            <div key={k} style={{ display: 'contents' }}>
              <dt>{humanize(k)}</dt>
              <dd><Value value={v} depth={depth} /></dd>
            </div>
          ))}
        </dl>
      )}
      {rich.map(([k, v]) =>
        Array.isArray(v) && v.every(isScalar) ? (
          <div key={k}>
            <H>{humanize(k)}</H>
            <Value value={v} depth={depth} />
          </div>
        ) : (
          <div key={k} className={depth >= 2 ? 'nested' : undefined}>
            <H>{humanize(k)}</H>
            <Value value={v} depth={depth} />
          </div>
        ),
      )}
    </>
  );
}

export function dossierToc(record) {
  return sectionsOf(record).map(([key]) => ({ id: anchorId(key), label: humanize(key) }));
}

export default function Dossier({ record }) {
  return (
    <article className="dossier">
      {sectionsOf(record).map(([key, value]) => (
        <section key={key} id={anchorId(key)}>
          <h2>{humanize(key)}</h2>
          {isObject(value) ? <Block record={value} depth={1} /> : <Value value={value} depth={1} />}
        </section>
      ))}
    </article>
  );
}
