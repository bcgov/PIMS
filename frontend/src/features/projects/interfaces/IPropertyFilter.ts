/**
 * IPropertyFilter interface, provides a model for querying the API for properties.
 */
export interface IPropertyFilter {
  page: number;
  quantity: number;
  pid?: string;
  address?: string;
  administrativeArea?: string;
  projectNumber?: string;
  ignorePropertiesInProjects?: boolean;
  inSurplusPropertyProgram?: boolean;
  classificationId?: number;
  agencies?: number | number[];
  minLandArea?: number;
  maxLandArea?: number;
  minLotArea?: number;
  maxLotArea?: number;
  all?: boolean;
}
