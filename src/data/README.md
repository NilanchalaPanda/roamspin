# Local destination data

`destinations.json` and `destinations.csv` are the local-first catalogue used by the React repository.

Current catalogue: 755 destinations across Indian states/regions, including 337 marked as Mumbai-ready planning candidates.

The dataset is a curated aggregation of destination names and planning metadata. Official tourism portals are used as provenance where available; it is intentionally **not** presented as a literal scrape of every travel website. Estimates for drive time and per-person budget are planning heuristics, not live quotes.

## Schema

- `id`: stable local identifier
- `name`, `state`, `country`, `region`: location identity
- `kind`, `tags`: discovery facets
- `recommendedDays`: suggested trip length
- `estimatedDriveHoursFromMumbai`: rough road-trip estimate
- `estimatedBudgetPerPersonINR`: rough per-person trip budget
- `description`: short discovery copy
- `sourceType`, `sourceUrls`, `verifiedAt`: provenance metadata
- `isMumbaiShortlist`: whether the destination is included in the Mumbai-ready pool
- `planningNote`: safety/accuracy caveat for planning estimates


### Budget model
`jugaadBudgetPerPersonINR` is the local low-cost floor, while `comfortBudgetPerPersonINR` is the existing comfort estimate. `fixedCostPerPersonINR` represents known unavoidable ticket/permit costs and is never reduced by the jugaad model. Radius is currently an estimated road-distance radius from Mumbai.
