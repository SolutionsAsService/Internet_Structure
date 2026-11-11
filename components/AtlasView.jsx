'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

// Interaction for the server-rendered atlas SVG: pan, zoom, search and selection. The SVG
// arrives finished in the HTML; this component only toggles classes and a transform.
export default function AtlasView({ meta, children }) {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const view = useRef({ k: 1, x: 0, y: 0 });
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const headingRef = useRef(null);
  const declutterRef = useRef(() => {});

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return meta
      .map((n, i) => ({ ...n, i }))
      .filter(n => n.name.toLowerCase().includes(q) || n.type.toLowerCase().includes(q) || n.s.toLowerCase() === q)
      .slice(0, 12);
  }, [meta, query]);

  // Choose an organisation from a list or the search, then move focus to its heading so a
  // keyboard user continues from the panel instead of the top of the page.
  const choose = i => {
    setSelected(i);
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  // Pan and zoom.
  useEffect(() => {
    const stage = stageRef.current;
    const g = stage.querySelector('[data-viewport]');
    const svg = stage.querySelector('svg');
    const apply = () => {
      const { k, x, y } = view.current;
      g.setAttribute('transform', `translate(${x} ${y}) scale(${k})`);
      // Keep labels and dots a readable on-screen size whatever the zoom and viewport.
      const s = svg.getScreenCTM()?.a || 1;
      g.style.setProperty('--fs', `${(12.5 / (s * k)).toFixed(2)}px`);
      g.style.setProperty('--grow', Math.max(1, 0.55 / (s * k)).toFixed(2));
    };
    const toSvg = (cx, cy) => {
      const pt = svg.createSVGPoint();
      pt.x = cx; pt.y = cy;
      return pt.matrixTransform(svg.getScreenCTM().inverse());
    };
    const zoomAt = (factor, cx, cy) => {
      const v = view.current;
      const k = Math.min(8, Math.max(1, v.k * factor));
      const p = toSvg(cx, cy);
      v.x = p.x - ((p.x - v.x) * k) / v.k;
      v.y = p.y - ((p.y - v.y) * k) / v.k;
      v.k = k;
      if (k === 1) { v.x = 0; v.y = 0; }
      apply();
    };
    const onWheel = e => { e.preventDefault(); zoomAt(e.deltaY < 0 ? 1.18 : 1 / 1.18, e.clientX, e.clientY); };

    const pointers = new Map();
    let last = null;
    let pinch = null;
    let moved = 0;
    const onDown = e => {
      pointers.set(e.pointerId, e);
      moved = 0;
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        pinch = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      } else {
        last = toSvg(e.clientX, e.clientY);
      }
    };
    const onMove = e => {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, e);
      if (pointers.size === 2 && pinch) {
        const [a, b] = [...pointers.values()];
        const d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
        zoomAt(d / pinch, (a.clientX + b.clientX) / 2, (a.clientY + b.clientY) / 2);
        pinch = d;
        moved += 10;
        return;
      }
      if (!last) return;
      const p = toSvg(e.clientX, e.clientY);
      const v = view.current;
      v.x += p.x - last.x;
      v.y += p.y - last.y;
      moved += Math.abs(p.x - last.x) + Math.abs(p.y - last.y);
      if (moved > 4) { stage.setPointerCapture?.(e.pointerId); stage.classList.add('dragging'); }
      last = toSvg(e.clientX, e.clientY);
      apply();
    };
    const onUp = e => {
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinch = null;
      if (pointers.size === 0) {
        last = null;
        stage.classList.remove('dragging');
        if (moved <= 4) {
          const i = e.target?.closest?.('.a-node')?.dataset.i;
          setSelected(i === undefined ? null : Number(i));
        }
      }
    };

    stage.addEventListener('wheel', onWheel, { passive: false });
    stage.addEventListener('pointerdown', onDown);
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerup', onUp);
    stage.addEventListener('pointercancel', onUp);
    stage.zoomBy = f => { const r = stage.getBoundingClientRect(); zoomAt(f, r.left + r.width / 2, r.top + r.height / 2); };
    stage.reset = () => {
      view.current = { k: 1, x: 0, y: 0 };
      apply();
      // On a narrow screen the whole map is too small to read: open at 2.4x, centred.
      const r = stage.getBoundingClientRect();
      if (r.width < 640) zoomAt(2.4, r.left + r.width / 2, r.top + r.height / 2);
    };
    stage.reset();
    const onResize = () => apply();
    stage.addEventListener('pointerup', () => requestAnimationFrame(declutterRef.current));
    stage.addEventListener('wheel', () => requestAnimationFrame(declutterRef.current), { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      stage.removeEventListener('wheel', onWheel);
      stage.removeEventListener('pointerdown', onDown);
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerup', onUp);
      stage.removeEventListener('pointercancel', onUp);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // Selection from the URL (?o=id), and Escape to clear.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('o');
    const i = meta.findIndex(n => n.id === id);
    if (i >= 0) setSelected(i);
    const onKey = e => { if (e.key === 'Escape') setSelected(null); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [meta]);

  // Reflect selection and search matches in the SVG.
  useEffect(() => {
    const root = rootRef.current;
    root.querySelectorAll('.on, .sel, .match').forEach(el => el.classList.remove('on', 'sel', 'match'));
    root.classList.toggle('has-focus', selected !== null);
    const url = new URL(window.location.href);
    if (selected === null) url.searchParams.delete('o'); else url.searchParams.set('o', meta[selected].id);
    window.history.replaceState(null, '', url);
    for (const m of matches) root.querySelector(`.a-node[data-i="${m.i}"]`)?.classList.add('match');
    if (selected === null) return;
    const lit = [selected, ...meta[selected].nb];
    for (const i of lit) {
      root.querySelector(`.a-node[data-i="${i}"]`)?.classList.add('on');
      root.querySelector(`.a-label[data-i="${i}"]`)?.classList.add('on');
    }
    root.querySelector(`.a-node[data-i="${selected}"]`)?.classList.add('sel');
    root.querySelectorAll(`.a-link[data-s="${selected}"], .a-link[data-t="${selected}"]`).forEach(el => el.classList.add('on'));
    declutter();
  }, [selected, matches, meta]);

  // Hide lit labels that would overlap one already placed (selected first, then by connections).
  function declutter() {
    const root = rootRef.current;
    root.querySelectorAll('.a-label.clash').forEach(el => el.classList.remove('clash'));
    if (selected === null) return;
    const order = [selected, ...[...meta[selected].nb].sort((a, b) => meta[b].nb.length - meta[a].nb.length)];
    const placed = [];
    for (const i of order) {
      const el = root.querySelector(`.a-label[data-i="${i}"]`);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (placed.some(p => r.left < p.right + 2 && r.right > p.left - 2 && r.top < p.bottom && r.bottom > p.top)) el.classList.add('clash');
      else placed.push(r);
    }
  }

  declutterRef.current = declutter;
  const node = selected === null ? null : meta[selected];
  const neighbours = node ? node.nb.map(i => ({ ...meta[i], i })).sort((a, b) => a.s.localeCompare(b.s) || a.name.localeCompare(b.name)) : [];

  return (
    <div ref={rootRef}>
      <div className="atlas-tools" role="search">
        <label htmlFor="atlas-q" className="kicker" style={{ margin: 0, width: '100%' }}>Find an organisation</label>
        <input
          id="atlas-q"
          type="search"
          role="combobox"
          aria-expanded={matches.length > 0 && selected === null}
          aria-controls="atlas-results"
          aria-activedescendant={matches[active] && selected === null ? `opt-${matches[active].id}` : undefined}
          aria-describedby="atlas-q-hint"
          value={query}
          placeholder="e.g. Equinix, subsea, DNS"
          autoComplete="off"
          onChange={e => { setQuery(e.target.value); setActive(0); setSelected(null); }}
          onKeyDown={e => {
            if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, matches.length - 1)); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); }
            else if (e.key === 'Enter' && matches[active]) { e.preventDefault(); choose(matches[active].i); }
          }}
        />
        <span id="atlas-q-hint" className="visually-hidden">Use the up and down arrows to move through matches, Enter to choose.</span>
        <button type="button" onClick={() => { setSelected(null); setQuery(''); stageRef.current.reset(); }}>Reset</button>
        {node && <button type="button" onClick={() => setSelected(null)}>Clear selection</button>}
      </div>
      <div className="atlas">
        <div className="atlas-stage" ref={stageRef}>
          {children}
          <div className="zoom">
            <button type="button" aria-label="Zoom in" onClick={() => stageRef.current.zoomBy(1.4)}>+</button>
            <button type="button" aria-label="Zoom out" onClick={() => stageRef.current.zoomBy(1 / 1.4)}>−</button>
          </div>
        </div>
        <aside className="atlas-panel" aria-live="polite">
          {node ? (
            <>
              <p className="meta">{node.s} · {node.type}{node.hub ? ' · hub' : ''}</p>
              <h2 ref={headingRef} tabIndex={-1}>{node.name}</h2>
              <p><Link href={`/organisations/${node.id}`}>Open the full profile →</Link></p>
              <p className="meta">{neighbours.length} recorded connections</p>
              <ul>
                {neighbours.map(n => (
                  <li key={n.id}>
                    <button type="button" onClick={() => choose(n.i)}>{n.name}</button>
                    <small>{n.s}</small>
                  </li>
                ))}
              </ul>
            </>
          ) : matches.length ? (
            <>
              <p className="meta">{matches.length === 12 ? 'First 12 matches' : `${matches.length} matches`}</p>
              <ul id="atlas-results" role="listbox" aria-label="Matches">
                {matches.map((n, k) => (
                  <li key={n.id} id={`opt-${n.id}`} role="option" aria-selected={k === active} className={k === active ? 'active' : undefined}>
                    <button type="button" tabIndex={-1} onClick={() => choose(n.i)}>{n.name}</button>
                    <small>{n.s}</small>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <h2>Pick a dot</h2>
              <p className="atlas-hint">
                Select any organisation to light up everything it connects to, then step from neighbour to neighbour.
                Drag to pan, scroll or pinch to zoom, Escape to clear. Labels show the most-connected organisations
                that fit without overlapping; zoom in or select a dot for the rest.
              </p>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
