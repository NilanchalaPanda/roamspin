import data from "../data/destinations.json";
import type { Destination, Filters } from "../domain/types";

const destinations = data as Destination[];

const selectedMaxDays: Record<string, number> = {
  "1-2": 2,
  "2-3": 3,
  "3-4": 4,
  "4-5": 5,
  "4-6": 6,
};

function destinationFitsTripLength(
  recommendedDays: string,
  selectedDays: string,
) {
  if (!selectedDays) return true;

  const maxDays = selectedMaxDays[selectedDays];
  if (!maxDays) return true;

  // Treat the selected timeframe as the amount of time the group has,
  // not as an exact label match. A 1–2 day trip can include a 1–2 day
  // destination; a 4–6 day trip can include 1–2, 2–3, 3–4 and 4–5 day trips.
  const match = recommendedDays.match(/^(\d+)(?:-(\d+))?$/);
  if (!match) return false;

  const destinationMaxDays = Number(match[2] ?? match[1]);
  return destinationMaxDays <= maxDays;
}

export const destinationRepository = {
  all: () => destinations,
  byId: (id: string) => destinations.find((d) => d.id === id),
  states: () => [...new Set(destinations.map((d) => d.state))].sort(),
  filter: (f: Filters) =>
    destinations.filter((d) => {
      const days = destinationFitsTripLength(d.recommendedDays, f.days);
      const driveHours =
        f.distance === "any"
          ? true
          : d.estimatedDriveHoursFromMumbai <= Number(f.distance);

      // Budget checks the realistic minimum (jugaad) rather than the comfort estimate.
      const budget = d.jugaadBudgetPerPersonINR <= f.budgetMax;
      const vibes = f.vibes.length
        ? f.vibes.some((v) => d.tags.includes(v))
        : true;
      const states = f.states.length ? f.states.includes(d.state) : true;
      const radius =
        f.radiusKm >= 1000
          ? true
          : d.estimatedRoadDistanceKmFromMumbai <= f.radiusKm;

      return days && driveHours && budget && vibes && states && radius;
    }),
};
