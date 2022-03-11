import { PropertyType } from 'hooks/api/properties';

export interface IProjectPropertyForm {
  id: number;
  propertyId: number;
  propertyTypeId: PropertyType;
  projectNumbers: string[];
  agencyCode: string;
  name: string;
  address: string;
  classificationId: number;
  zoning: string | '';
  zoningPotential: string | '';
  netBook: number | '';
  assessedLand: number | '';
  assessedLandYear: number | '';
  assessedImprovements: number | '';
}
