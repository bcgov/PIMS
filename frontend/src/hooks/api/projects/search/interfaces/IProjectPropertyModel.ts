import { IBaseModel } from 'hooks/api/interfaces';
import { PropertyType } from 'hooks/api/properties';

export interface IProjectPropertyModel extends IBaseModel {
  id: number;
  parcelId: number;
  propertyType: PropertyType;
  name: string;
  classification: string;
  agencyId: number;
  agency: string;
  agencyCode: string;
  subAgency: string;
  address: string;
  administrativeArea: string;
  netBook: number;
  assessed: number;
  market: number;
  landArea: number;
  zoning?: string | null;
  zoningPotential?: string | null;
}
