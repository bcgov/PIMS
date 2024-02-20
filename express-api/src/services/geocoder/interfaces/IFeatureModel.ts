import { IGeometryModel } from '@/services/geocoder/interfaces/IGeometryModel';
import { IPropertyModel } from '@/services/geocoder/interfaces/IPropertyModel';

export interface IFeatureModel {
  type: string;
  geometry: IGeometryModel;
  properties: IPropertyModel;
}
