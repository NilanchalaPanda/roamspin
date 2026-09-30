/** Local-first persistence schema. No database is connected today. */
export type DestinationRow = {
  id: string;
  name: string;
  state: string;
  country: string;
  region: string;
  kind: string;
  tags: string[];
  recommendedDays: string;
  estimatedDriveHoursFromMumbai: number;
  estimatedRoadDistanceKmFromMumbai: number;
  estimatedBudgetPerPersonINR: number;
  jugaadBudgetPerPersonINR: number;
  comfortBudgetPerPersonINR: number;
  fixedCostPerPersonINR: number;
  description: string;
  sourceType: string;
  verifiedAt: string;
  isMumbaiShortlist: boolean;
  planningNote: string;
  budgetNote?: string;
  sourceUrls?: string[];
};

export type UserPreferencesRow = {
  id: string;
  displayName?: string;
  homeCity: string;
  preferredVibes: string[];
  preferredStates: string[];
  radiusKm?: number;
  budgetCeilingINR?: number;
  preferredTripLength?: string;
  createdAt: string;
  updatedAt: string;
};

export type SpinHistoryRow = {
  id: string;
  userId?: string;
  destinationId: string;
  filters: Record<string, string | string[] | number>;
  createdAt: string;
};

export const LOCAL_SCHEMA = {
  destinations: 'src/data/destinations.json',
  userPreferences: 'not collected yet',
  spinHistory: 'not persisted yet',
} as const;
