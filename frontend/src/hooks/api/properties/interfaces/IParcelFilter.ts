import { IPropertyFilter } from '.';

export interface IParcelFilter extends IPropertyFilter {
  pid?: string;
  pin?: string;
  zoning?: string;
  zoningPotential?: string;
  minLandArea?: number;
  maxLandArea?: number;
}
