import React, { useEffect, useRef, useState } from 'react';

// Each dataset is a dynamic import so the JSON (and Leaflet itself) only
// load for posts that actually render a map.
const datasets = {
  'nyc-2026': () => import('../../data/places/nyc-2026.json'),
};

const COLORS = {
  event: '#d46d3a',
  food: '#2aa8a2',
};

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const popupHtml = (place) => {
  const dates = place.dates.map(escapeHtml).join(', ');
  const note = place.note ? `<br>${escapeHtml(place.note)}` : '';
  const approx = place.approx ? '<br><em>Pin is approximate.</em>' : '';
  return `<strong>${escapeHtml(place.name)}</strong><br>${dates}${note}${approx}`;
};

const PlacesMap = ({ dataset, height = 560 }) => {
  const canvasRef = useRef(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    if (!datasets[dataset]) {
      setStatus('error');
      return undefined;
    }

    let map;
    let cancelled = false;

    (async () => {
      try {
        const [leafletModule, dataModule] = await Promise.all([
          import('leaflet'),
          datasets[dataset](),
          import('leaflet/dist/leaflet.css'),
        ]);
        if (cancelled || !canvasRef.current) return;

        const L = leafletModule.default || leafletModule;
        const places = dataModule.default || dataModule;

        // zoomSnap 0.5 lets fitBounds land on a half-step instead of flooring
        // to a whole level, which otherwise leaves the cluster far too zoomed out.
        map = L.map(canvasRef.current, { scrollWheelZoom: false, zoomSnap: 0.5 });
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        const bounds = [];
        places.forEach((place) => {
          L.circleMarker([place.lat, place.lng], {
            radius: 7,
            color: '#112027',
            weight: 1,
            fillColor: COLORS[place.type] || '#112027',
            fillOpacity: 0.9,
          })
            .addTo(map)
            .bindPopup(popupHtml(place));
          if (!place.outlying) bounds.push([place.lat, place.lng]);
        });

        // Fit to the dense cluster; outlying pins (Harriman) stay on the map
        // but don't blow the initial zoom out to the whole region.
        map.invalidateSize();
        if (bounds.length) map.fitBounds(bounds, { padding: [16, 16] });
        setStatus('ready');
      } catch (err) {
        if (!cancelled) setStatus('error');
      }
    })();

    return () => {
      cancelled = true;
      if (map) map.remove();
    };
  }, [dataset]);

  return (
    <div className="places-map">
      <div ref={canvasRef} className="places-map__canvas" style={{ height }} role="region" aria-label="Map of places" />
      <p className="places-map__legend">
        <span className="places-map__key" style={{ background: COLORS.event }} /> Events
        <span className="places-map__key" style={{ background: COLORS.food }} /> Food &amp; drink
        <span className="muted"> — click a pin. Harriman is up north; zoom out to see it.</span>
      </p>
      {status === 'error' ? <p className="muted">The map couldn't load.</p> : null}
    </div>
  );
};

export default PlacesMap;
