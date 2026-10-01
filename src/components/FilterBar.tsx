import type { Dispatch, SetStateAction } from "react";
import type { Filters } from "../domain/types";
import { vibes } from "../data/tripOptions";
import { RadiusMap } from "./RadiusMap";
import { OriginPicker } from "./OriginPicker";
import type { OriginProfile } from "../data/origins";

export function FilterBar({
  filters,
  setFilters,
  count,
  states,
  origin,
  origins,
  onCityChange,
  onUseLocation,
  locating,
  locationError,
}: {
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
  count: number;
  states: string[];
  origin: OriginProfile;
  origins: OriginProfile[];
  onCityChange: (id: string) => void;
  onUseLocation: () => void;
  locating: boolean;
  locationError?: string;
}) {
  const toggle = (key: "vibes" | "states", value: string) =>
    setFilters((f) => ({
      ...f,
      [key]: f[key].includes(value)
        ? f[key].filter((x) => x !== value)
        : [...f[key], value],
    }));
  return (
    <section className="rules panel">
      <div className="sectionHead">
        <div>
          <span className="eyebrow">01 · SET THE CHAOS LEVEL</span>
          <h2>Give the roulette a few rules.</h2>
        </div>
        <span className="poolCount">{count} possible escapes</span>
      </div>
      <div className="controlRow">
        <label>
          <span>TIME</span>
          <select
            value={filters.days}
            onChange={(e) =>
              setFilters((f) => ({ ...f, days: e.target.value }))
            }
          >
            <option value="">Any trip</option>
            <option value="1-2">1–2 days</option>
            <option value="2-3">2–3 days</option>
            <option value="3-4">3–4 days</option>
            <option value="4-6">4–6 days</option>
          </select>
        </label>
        <label>
          <span>MAX DRIVE</span>
          <select
            value={filters.distance}
            onChange={(e) =>
              setFilters((f) => ({ ...f, distance: e.target.value }))
            }
          >
            <option value="any">Anywhere</option>
            <option value="3">≤ 3h</option>
            <option value="6">≤ 6h</option>
            <option value="10">≤ 10h</option>
            <option value="15">≤ 15h</option>
          </select>
        </label>
        <label className="budget">
          <span>
            {filters.budgetMax >= 25000
              ? "BUDGET · ANY"
              : `JUGAAD CEILING · ₹${filters.budgetMax.toLocaleString("en-IN")}`}
          </span>
          <input
            type="range"
            min="1000"
            max="25000"
            step="500"
            value={filters.budgetMax}
            onChange={(e) =>
              setFilters((f) => ({ ...f, budgetMax: Number(e.target.value) }))
            }
          />
          <small>
            {filters.budgetMax >= 25000
              ? "No budget ceiling applied · comfort can be higher"
              : "Minimum realistic trip spend · comfort can be higher"}
          </small>
        </label>
      </div>
      <div className="budgetExplain">
        <b>🪄 Jugaad budget</b> = the low-cost floor using cheaper
        rail/general/sleeper travel, shared stays and local transport.{" "}
        <b>Fixed tickets/permits</b> are never discounted when known. The
        destination card shows both the floor and comfort estimate.
      </div>
      <OriginPicker
        origin={origin}
        origins={origins}
        onCityChange={onCityChange}
        onUseLocation={onUseLocation}
        locating={locating}
        locationError={locationError}
      />
      <div className="radiusBlock">
        <div className="radiusCopy">
          <div>
            <span className="radiusEyebrow">
              RADIUS FROM {origin.city.toUpperCase()}
            </span>
            <h3>Draw your escape boundary.</h3>
            <p>
              Drag the slider and watch the map breathe. The roulette uses the
              same radius to decide which destinations survive.
            </p>
          </div>
          <div className="radiusValue">
            <strong>{filters.radiusKm >= 1000 ? "∞" : filters.radiusKm}</strong>
            <span>{filters.radiusKm >= 1000 ? "ALL DISTANCES" : "KM"}</span>
          </div>
        </div>
        <input
          className="radiusSlider"
          aria-label={`Radius from ${origin.city}`}
          type="range"
          min="50"
          max="1000"
          step="25"
          value={filters.radiusKm}
          onChange={(e) =>
            setFilters((f) => ({ ...f, radiusKm: Number(e.target.value) }))
          }
        />
        <div className="radiusScale">
          <span>50 km</span>
          <span>250</span>
          <span>500</span>
          <span>750</span>
          <span>∞</span>
        </div>
        <RadiusMap
          radiusKm={filters.radiusKm}
          center={[origin.lat, origin.lng]}
          label={origin.city}
        />
        <small className="radiusNote">
          The map boundary follows your selected origin. The current destination
          catalogue stores verified road-distance fields from Mumbai; non-Mumbai
          origin matching is shown visually until destination coordinates are
          added to the local dataset. It is a roulette boundary, not live
          routing.
        </small>
      </div>
      <div className="vibeBlock">
        <span>CHOOSE ONE OR MORE VIBES</span>
        <div className="chips">
          {vibes.map(([id, icon, label]) => (
            <button
              type="button"
              key={id}
              className={filters.vibes.includes(id) ? "chip selected" : "chip"}
              onClick={() => toggle("vibes", id)}
            >
              {icon} {label}
            </button>
          ))}
        </div>
      </div>
      <div className="vibeBlock">
        <span>CHOOSE STATES · MULTI-SELECT</span>
        <div className="chips stateChips">
          {states.map((state) => (
            <button
              type="button"
              key={state}
              className={
                filters.states.includes(state) ? "chip selected" : "chip"
              }
              onClick={() => toggle("states", state)}
            >
              {state}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
