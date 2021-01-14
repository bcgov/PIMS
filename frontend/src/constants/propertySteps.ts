/**
 * Land steps enum, provides a list of steps corresponding to submittig bare land.
 */
export enum LandSteps {
  IDENTIFICATION = 0,
  USAGE = 1,
  VALUATION = 2,
  ASSOCIATED_OR_REVIEW = 3,
  REVIEW = 4,
}

/**
 * Associated Land steps enum, provides a list of steps corresponding to submitting parcels associated to a building.
 */
export enum AssociatedLandSteps {
  LAND_OWNERSHIP = 0,
  IDENTIFICATION_OR_REVIEW = 1,
  USAGE = 2,
  VALUATION = 3,
  REVIEW = 4,
}

/**
 * Building steps enum, provides a list of steps corresponding to submittig a building.
 */
export enum BuildingSteps {
  IDENTIFICATION = 0,
  TENANCY = 1,
  VALUATION = 2,
  ASSOCIATED = 3,
  REVIEW = 4,
}
