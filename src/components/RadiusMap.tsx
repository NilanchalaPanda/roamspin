import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const CARTO_API_KEY = import.meta.env.VITE_CARTO_API_KEY?.trim();

export function RadiusMap({ radiusKm, center, label }: { radiusKm: number; center: [number, number]; label: string }) {
  const mapNode = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const centerRef = useRef<L.CircleMarker | null>(null);

  useEffect(() => {
    if (!mapNode.current || mapRef.current) return;

    const map = L.map(mapNode.current, {
      zoomControl: false,
      attributionControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      minZoom: 5,
      maxZoom: 13,
    }).setView(center, 8);

    // CARTO now requires a Basemaps API key for external use. If one is not
    // configured, fall back to OpenStreetMap so local development still works.
    const cartoUrl = CARTO_API_KEY
      ? `https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png?key=${encodeURIComponent(CARTO_API_KEY)}`
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    L.tileLayer(cartoUrl, {
      attribution: CARTO_API_KEY
        ? '&copy; OpenStreetMap contributors &copy; CARTO'
        : '&copy; OpenStreetMap contributors',
      subdomains: CARTO_API_KEY ? 'abcd' : undefined,
      maxZoom: 20,
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    centerRef.current = L.circleMarker(center, {
      radius: 7,
      color: '#ffffff',
      weight: 3,
      fillColor: '#5b6cff',
      fillOpacity: 1,
    }).addTo(map).bindTooltip(`${label} origin`, { permanent: true, direction: 'top', offset: [0, -8], className: 'mumbaiTooltip' });

    circleRef.current = L.circle(center, {
      radius: radiusKm * 1000,
      color: '#9d6cff',
      weight: 2,
      opacity: 0.95,
      fillColor: '#7b4dff',
      fillOpacity: 0.16,
      dashArray: '8 8',
    }).addTo(map).bindTooltip(`${radiusKm} km roulette boundary`, { sticky: true, className: 'radiusTooltip' });

    mapRef.current = map;
    requestAnimationFrame(() => map.invalidateSize());

    return () => {
      map.remove();
      mapRef.current = null;
      circleRef.current = null;
      centerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const circle = circleRef.current;
    const marker = centerRef.current;
    if (!map || !circle || !marker) return;
    const next = L.latLng(center[0], center[1]);
    marker.setLatLng(next);
    marker.setTooltipContent(`${label} origin`);
    circle.setLatLng(next);
    map.fitBounds(circle.getBounds(), { padding: [24, 24], maxZoom: radiusKm <= 150 ? 10 : radiusKm <= 350 ? 8 : 7, animate: true, duration: 0.35 });
  }, [center[0], center[1], label]);

  useEffect(() => {
    const map = mapRef.current;
    const circle = circleRef.current;
    if (!map || !circle) return;

    circle.setRadius(radiusKm * 1000);
    circle.setTooltipContent(radiusKm >= 1000 ? 'No radius limit' : `${radiusKm} km roulette boundary`);
    map.fitBounds(circle.getBounds(), {
      padding: [24, 24],
      maxZoom: radiusKm <= 150 ? 10 : radiusKm <= 350 ? 8 : 7,
      animate: true,
      duration: 0.35,
    });
  }, [radiusKm]);

  return (
    <div className="radiusMapShell">
      <div className="radiusMapTopline">
        <span>LIVE RADIUS PREVIEW</span>
        <b>{radiusKm >= 1000 ? 'NO LIMIT' : `${radiusKm} KM`}</b>
      </div>
      <div ref={mapNode} className="radiusMap" aria-label={`Interactive ${label} radius map`} />
      <div className="radiusMapLegend">
        <span><i className="legendDot" /> {label} origin</span>
        <span><i className="legendCircle" /> roulette boundary</span>
      </div>
    </div>
  );
}
