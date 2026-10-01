import { useMemo, useState } from "react";
import { destinationRepository } from "./repositories/destinationRepository";
import type { Filters, Destination } from "./domain/types";
import { FilterBar } from "./components/FilterBar";
import { Wheel } from "./components/Wheel";
import { DestinationCard } from "./components/DestinationCard";
import { TripBuilder } from "./components/TripBuilder";
import { useRoulette } from "./hooks/useRoulette";
import {
  defaultOrigin,
  originProfiles,
  type OriginProfile,
} from "./data/origins";
import { ExplorePage } from "./components/ExplorePage";
import "./styles.css";

const initial: Filters = {
  days: "",
  vibes: [],
  distance: "any",
  region: "",
  budgetMax: 25000,
  states: [],
  radiusKm: 1000,
};

function DestinationRoute({ destination }: { destination: Destination }) {
  return (
    <main>
      <header>
        <div className="brand">
          ROAM<span>SPIN</span>
        </div>
        <a className="backLink" href="/">
          ← Back to roulette
        </a>
      </header>
      <section className="destinationRoute panel">
        <span className="eyebrow">DESTINATION FILE · {destination.id}</span>
        <DestinationCard d={destination} />
        <a
          className="routeAction"
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${destination.name}, ${destination.state}, India`)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          📍 Open location in Maps ↗
        </a>
      </section>
    </main>
  );
}

export default function App() {
  const path = window.location.pathname;
  if (path === "/explore" || path === "/explore/") return <ExplorePage />;
  const routeMatch = path.match(/^\/destination\/([^/]+)\/?$/);
  if (routeMatch) {
    const destination = destinationRepository.byId(routeMatch[1]);
    if (destination) return <DestinationRoute destination={destination} />;
  }

  const [filters, setFilters] = useState(initial);
  const [mumbaiOnly, setMumbaiOnly] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [origin, setOrigin] = useState<OriginProfile>(defaultOrigin);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");

  const all = destinationRepository.all();
  const states = destinationRepository.states();
  const pool = useMemo(
    () =>
      destinationRepository
        .filter(filters)
        .filter((d) => (mumbaiOnly ? d.isMumbaiShortlist : true)),
    [filters, mumbaiOnly],
  );
  const game = useRoulette(pool);
  const visiblePool = showAll ? pool : pool.slice(0, 120);

  const handleCityChange = (id: string) => {
    const next = originProfiles.find((x) => x.id === id);
    if (!next) return;
    setLocationError("");
    setOrigin(next);
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(
        "This browser does not provide location access. Pick a city instead.",
      );
      return;
    }
    setLocating(true);
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setOrigin({
          id: "browser-location",
          city: "Your location",
          state: "Browser GPS",
          lat: coords.latitude,
          lng: coords.longitude,
        });
        setLocating(false);
      },
      (error) => {
        setLocating(false);
        setLocationError(
          error.code === error.PERMISSION_DENIED
            ? "Location permission was denied. You can still choose a city."
            : "Could not read your location. Try choosing a city.",
        );
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  };

  return (
    <main>
      <header>
        <div className="brand">
          ROAM<span>SPIN</span>
        </div>
        <nav className="topNav">
          <a href="/explore">Explore all destinations</a>
          <span className="topline">OCTOBER LONG WEEKEND · 2026</span>
        </nav>
      </header>
      <section className="hero">
        <div className="heroCopy">
          <span className="eyebrow">THREE FRIENDS · ZERO DEMOCRACY</span>
          <h1>
            Where are we
            <br />
            <em>going?</em>
          </h1>
          <p>
            Put the arguments in a box. Give us a few rules. We’ll choose the
            escape.
          </p>
          <div className="heroActions">
            <a href="#rules">Set the rules ↓</a>
            <span>🎲 {all.length} destinations loaded</span>
          </div>
        </div>
        <div className="heroOrb">
          <div className="orbit one" />
          <div className="orbit two" />
          <span>?</span>
          <small>
            NO
            <br />
            PEEK
          </small>
        </div>
      </section>
      <section className="how">
        <div>
          <b>01</b>
          <span>SET RULES</span>
        </div>
        <div>
          <b>02</b>
          <span>HIDE DESTINATIONS</span>
        </div>
        <div>
          <b>03</b>
          <span>SPIN</span>
        </div>
        <div>
          <b>04</b>
          <span>BUILD THE TRIP</span>
        </div>
      </section>
      <div id="rules">
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          count={pool.length}
          states={states}
          origin={origin}
          origins={originProfiles}
          onCityChange={handleCityChange}
          onUseLocation={handleUseLocation}
          locating={locating}
          locationError={locationError}
        />
      </div>
      <div className="scope">
        <button
          className={mumbaiOnly ? "activeTab" : ""}
          onClick={() => setMumbaiOnly(true)}
        >
          📍 Local-ready pool
        </button>
        <button
          className={!mumbaiOnly ? "activeTab" : ""}
          onClick={() => setMumbaiOnly(false)}
        >
          🇮🇳 Whole India
        </button>
        <span>
          {pool.length} matches · origin: {origin.city} ·{" "}
          {filters.budgetMax >= 25000
            ? "budget: any"
            : `jugaad ≤ ₹${filters.budgetMax.toLocaleString("en-IN")}`}{" "}
          ·{" "}
          {filters.radiusKm >= 1000
            ? "all radii"
            : `${filters.radiusKm} km radius`}
        </span>
      </div>
      <section className="game panel">
        <Wheel
          items={visiblePool}
          rotation={game.rotation}
          spinning={game.spinning}
          phase={game.phase}
          onSpin={game.spin}
        />
        {game.winner && (
          <div className="reveal">
            <div className="confetti">✦ ✦ ✦</div>
            <DestinationCard d={game.winner} onReroll={game.spin} />
          </div>
        )}
        {!game.winner && !game.spinning && pool.length === 0 && (
          <div className="empty">
            Nothing survives those rules. Loosen one filter and spin again.
          </div>
        )}
      </section>
      {pool.length > 120 && !showAll && (
        <button className="loadMore" onClick={() => setShowAll(true)}>
          Load all {pool.length} candidates
        </button>
      )}
      {game.winner && <TripBuilder destination={game.winner} />}
      {game.history.length > 1 && (
        <section className="history">
          <span className="eyebrow">YOUR SPIN HISTORY</span>
          <div>
            {game.history.slice(1).map((d) => (
              <a href={`/destination/${d.id}`} key={d.id}>
                {d.name}
              </a>
            ))}
          </div>
        </section>
      )}
      <footer>
        Local-first · {all.length} destinations · no account · no database ·
        location stays in your browser · planning estimates only ·{" "}
        <a href="/explore">browse the catalogue</a>
      </footer>
    </main>
  );
}
