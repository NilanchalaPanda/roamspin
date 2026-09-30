import type { OriginProfile } from '../data/origins';

export function OriginPicker({
  origin,
  origins,
  onCityChange,
  onUseLocation,
  locating,
  locationError,
}: {
  origin: OriginProfile;
  origins: OriginProfile[];
  onCityChange: (id: string) => void;
  onUseLocation: () => void;
  locating: boolean;
  locationError?: string;
}) {
  return <div className="originPicker">
    <div className="originCopy">
      <span className="radiusEyebrow">STARTING POINT</span>
      <h3>Where are you escaping from?</h3>
      <p>Pick a city for a privacy-friendly default, or let the browser use your current location.</p>
    </div>
    <div className="originControls">
      <select value={origin.id} onChange={e => onCityChange(e.target.value)} aria-label="Choose your city">
        {origins.map(city => <option key={city.id} value={city.id}>{city.city}, {city.state}</option>)}
      </select>
      <button type="button" className="locationBtn" onClick={onUseLocation} disabled={locating}>
        {locating ? 'Finding you…' : '📍 Use my location'}
      </button>
    </div>
    <div className="originStatus">
      <span>MAP ORIGIN</span><b>{origin.city}, {origin.state}</b>
      {locationError && <em>{locationError}</em>}
    </div>
  </div>;
}
