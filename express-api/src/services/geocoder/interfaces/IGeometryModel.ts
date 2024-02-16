import { ICrsModel } from '@/services/geocoder/interfaces/ICrsModel';

export interface IGeometryModel {
  type: string;
  crs: ICrsModel;
  coordinates: number[];
}
