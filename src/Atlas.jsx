'use client';

import { useEffect, useRef } from 'react';

const filters = [
  ['all', 'All systems'],
  ['cloud', 'Cloud'],
  ['backbone', 'Backbone'],
  ['carrier', 'Carriers'],
  ['ixp', 'Exchanges'],
  ['dns', 'DNS'],
  ['satellite', 'Satellite'],
  ['submarine', 'Subsea'],
];

export default function Atlas() {
  const rootRef = useRef(null);

  useEffect(() => {
    let dispose;
    let cancelled = false;

    import('../js/app.js').then(({ mountAtlas }) => {
      if (!cancelled && rootRef.current) dispose = mountAtlas(rootRef.current);
    }).catch(error => {
      const status = rootRef.current?.querySelector('#runtime-label');
      if (status) status.textContent = `APP ERROR · ${error.message}`;
    });

    return () => {
      cancelled = true;
      dispose?.();
    };
  }, []);

  return (
    <div className="app-shell" ref={rootRef}>
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true"><span>IS</span><i /></div>
          <div>
            <div className="brand-name">INTERNET <span>STRUCTURE</span></div>
            <div className="brand-subtitle">GLOBAL INFRASTRUCTURE ATLAS</div>
          </div>
        </div>
        <div className="topbar-context"><span className="live-pip" />NETWORK RELATIONSHIP MAP</div>
        <div className="runtime-pill" id="runtime-state" aria-live="polite"><i /><span id="runtime-label">LOADING DATA</span></div>
      </header>

      <section className="toolbar" aria-label="Map controls">
        <label className="search-box" htmlFor="search">
          <span aria-hidden="true">⌕</span>
          <input id="search" type="search" placeholder="Find a network, exchange, or system…" autoComplete="off" />
          <kbd>⌘ K</kbd>
        </label>
        <div className="filter-strip" role="group" aria-label="Filter by infrastructure layer">
          {filters.map(([layer, label]) => (
            <button key={layer} className={layer === 'all' ? 'filter-button active' : 'filter-button'} data-layer={layer} type="button">{label}</button>
          ))}
        </div>
        <button className="reset-button" id="reset-view" type="button"><span aria-hidden="true">↺</span> Reset view</button>
      </section>

      <main className="workspace">
        <section className="map-panel panel" aria-label="Internet infrastructure connection map">
          <div className="map-heading">
            <div>
              <div className="eyebrow">LIVE GRAPH / REPOSITORY DATA</div>
              <h1>Infrastructure network</h1>
            </div>
            <div className="map-legend"><span><i className="legend-node" /> Infrastructure</span><span><i className="legend-link" /> Known connection</span></div>
          </div>
          <div className="map-frame">
            <div id="network" aria-label="Interactive network map">
              <div id="map-loading" className="map-loading"><span className="spinner" /><strong>Preparing network map</strong><span>Loading repository connections…</span></div>
            </div>
          <div className="map-hint"><span>DRAG TO EXPLORE</span><span>SCROLL TO ZOOM</span><span>SELECT A NODE FOR DETAILS</span><span>ESC · OVERVIEW</span></div>
          </div>
          <div className="map-footer"><span id="network-summary">Loading source data…</span><span id="layer-summary">SOURCE DATA ONLY</span></div>
        </section>

        <aside id="panel" className="detail-panel panel" aria-label="Selected infrastructure details">
          <div className="panel-heading"><div className="eyebrow">NODE INTELLIGENCE</div><h2>Network brief</h2></div>
          <div id="stats" className="stats-grid"><div className="stat-card"><span>NODES</span><strong>—</strong></div><div className="stat-card"><span>LINKS</span><strong>—</strong></div><div className="stat-card"><span>LAYERS</span><strong>—</strong></div><div className="stat-card"><span>ISOLATED</span><strong>—</strong></div></div>
          <div id="details" className="details-content"><div className="empty-detail"><span className="empty-mark">IS</span><h3>Select a node</h3><p>Choose an infrastructure node to inspect its layer, role, and connected systems.</p></div></div>
        </aside>
      </main>

      <footer className="statusbar"><span><b>DATASET</b> Internet infrastructure model</span><span id="status-records">LOCAL REPOSITORY</span><span className="status-end">NO EXTERNAL DATA REQUESTS</span></footer>
    </div>
  );
}
