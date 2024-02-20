import { ICrsModel } from '@/services/geocoder/interfaces/ICrsModel';
import { IFeatureModel } from '@/services/geocoder/interfaces/IFeatureModel';

export interface IFeatureCollectionModel {
  type: string;
  queryAddress: string;
  searchTimestamp: string;
  executionTime: number;
  version: string;
  baseDataDate: string;
  crs: ICrsModel;
  interpolation: string;
  echo: string;
  locationDescripture: string;
  setback: number;
  minScore: number;
  maxResults: number;
  disclaimer: string;
  privacyStatement: string;
  copyrightNotice: string;
  copyrightLicense: string;
  features: IFeatureModel[];
}
