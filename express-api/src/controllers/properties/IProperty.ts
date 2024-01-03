import { Geometry, Point } from 'typeorm';

export interface IProperty {
  id: number;
  propertyType: string;
  propertyTypeId: number;
  projectNumbers: string[];
  name: string;
  description: string;
  classificationId: number;
  encumbranceReason: string;
  agencyId?: number | null;
  addressId: number;
  location: Point;
  boundary: Geometry;
  isSensitive: boolean;
  isVisibleToOtherAgencies: boolean;
}
