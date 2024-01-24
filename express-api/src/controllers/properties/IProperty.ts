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
  agencyId?: string | null;
  location: Point;
  boundary?: Geometry;
  isSensitive: boolean;
  isVisibleToOtherAgencies: boolean;
  administrativeArea: number;
  address1?: string;
  address2?: string;
  postal?: string;
  siteId?: string;
}
