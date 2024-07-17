import { IFaultModel } from '@/services/geocoder/interfaces/IFaultModel';

export interface IPropertyModel {
  fullAddress: string;
  score: number;
  matchPrecision: string;
  precisionPoints: number;
  faults: IFaultModel[];
  siteName: string;
  unitDesignator: string;
  unitNumber: string;
  unitNumberSuffix: string;
  civicNumber: string;
  civicNumberSuffix: string;
  streetName: string;
  streetType: string;
  isStreetTypePrefix: string;
  streetDirection: string;
  isStreetDirectionPrefix: string;
  streetQualifier: string;
  localityName: string;
  localityType: string;
  electoralArea: string;
  provinceCode: string;
  locationPositionalAccuracy: string;
  locationDescriptor: string;
  siteID: string;
  blockID: string;
  fullSiteDescriptor: string;
  accessNotes: string;
  siteStatus: string;
  siteRetireDate: string;
  changeDate: string;
  isOfficial: string;
}
