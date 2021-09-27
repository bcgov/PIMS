import { IApiProperty } from '.';

export interface IProjectProperty {
  id?: number;
  projectNumber?: string;
  propertyType: string;
  parcelId?: number;
  parcel?: IApiProperty;
  buildingId?: number;
  building?: IApiProperty;
}
