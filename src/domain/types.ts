export type Destination = {
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

export type Filters = {
  days: string;
  vibes: string[];
  distance: string;
  region: string;
  budgetMax: number;
  states: string[];
  radiusKm: number;
};

export type TripPlan = {
  destination: Destination;
  stay: string;
  activity: string;
  food: string;
  rule: string;
};
