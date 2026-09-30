import data from '../data/destinations.json';
import type { Destination, Filters } from '../domain/types';

const destinations = data as Destination[];

export const destinationRepository = {
  all: () => destinations,
  byId: (id: string) => destinations.find(d => d.id === id),
  states: () => [...new Set(destinations.map(d => d.state))].sort(),
  filter: (f: Filters) => destinations.filter(d => {
    const days = f.days ? d.recommendedDays === f.days : true;
    const driveHours = f.distance === 'any' ? true : d.estimatedDriveHoursFromMumbai <= Number(f.distance);
    // Budget checks the realistic minimum (jugaad) rather than the comfort estimate.
    // Fixed costs are already included in the minimum floor when present.
    const budget = d.jugaadBudgetPerPersonINR <= f.budgetMax;
    const vibes = f.vibes.length ? f.vibes.some(v => d.tags.includes(v)) : true;
    const states = f.states.length ? f.states.includes(d.state) : true;
    const radius = f.radiusKm >= 1000 ? true : d.estimatedRoadDistanceKmFromMumbai <= f.radiusKm;
    return days && driveHours && budget && vibes && states && radius;
  }),
};
