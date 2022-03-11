import { ISearchFilter } from '.';

export interface ISearchAllFilter extends ISearchFilter {
  pid?: string;
  zoning?: string;
  zoningPotential?: string;
  minLandArea?: number;
  maxLandArea?: number;
  constructionTypeId?: number;
  predominateUseId?: number;
  floorCount?: number;
  tenancy?: string;
  minRentableArea?: number;
  maxRentableArea?: number;
  includeAllProperties?: boolean;
}
