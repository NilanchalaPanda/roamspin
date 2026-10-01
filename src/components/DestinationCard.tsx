import type { Destination } from "../domain/types";

function mapsUrl(destination: Destination) {
  const query = `${destination.name}, ${destination.state}, India`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function DestinationCard({
  d,
  onReroll,
}: {
  d: Destination;
  onReroll?: () => void;
}) {
  return (
    <article className="winnerCard">
      <div className="winnerTop">
        <span className="eyebrow">🎉 YOUR ESCAPE IS…</span>
        <span className="stamp">#{d.id.replace("dest_", "")}</span>
      </div>
      <h2>{d.name}</h2>
      <p className="location">
        {d.state} · {d.region} India
      </p>
      <p>{d.description}</p>
      <div className="stats">
        <div>
          <b>🗓 {d.recommendedDays}</b>
          <small>ideal trip</small>
        </div>
        <div>
          <b>🚗 {d.estimatedRoadDistanceKmFromMumbai} km</b>
          <small>road distance*</small>
        </div>
        <div>
          <b>
            ₹{d.jugaadBudgetPerPersonINR.toLocaleString("en-IN")}–₹
            {d.comfortBudgetPerPersonINR.toLocaleString("en-IN")}
          </b>
          <small>jugaad → comfort</small>
        </div>
      </div>
      <div className="costBreakdown">
        <span>
          🔒 Fixed known costs{" "}
          <b>₹{d.fixedCostPerPersonINR.toLocaleString("en-IN")}</b>
        </span>
        <span>
          🪄 Low-cost floor{" "}
          <b>₹{d.jugaadBudgetPerPersonINR.toLocaleString("en-IN")}</b>
        </span>
        <span>
          🛋️ Comfort plan{" "}
          <b>₹{d.comfortBudgetPerPersonINR.toLocaleString("en-IN")}</b>
        </span>
      </div>
      <div className="tags">
        {d.tags.map((t) => (
          <span key={t}>#{t}</span>
        ))}
      </div>
      <div className="cardActions">
        <a
          className="ghostBtn linkBtn"
          href={`/destination/${d.id}`}
          aria-label={`Open ${d.name} destination details`}
        >
          Open destination ↗
        </a>
        <a
          className="ghostBtn linkBtn locationLink"
          href={mapsUrl(d)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${d.name} in Google Maps`}
        >
          📍 Open location ↗
        </a>
        {onReroll && (
          <button className="ghostBtn" onClick={onReroll}>
            Not feeling it? Reroll ↻
          </button>
        )}
      </div>
      <small className="fineprint">
        *Road distance and budgets are planning estimates, not live fares.
        Fixed-cost data is separated from flexible travel spend.
      </small>
    </article>
  );
}
