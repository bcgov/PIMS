import { Agency } from '@/hooks/api/useAgencyApi';
import { RegionalDistrict } from '@/hooks/api/useLookupApi';
import { BaseEntityInterface } from '@/interfaces/IBaseEntity';

export interface PropertyClassification extends BaseEntityInterface {
  Name: string;
  Id: number;
  IsDisabled: boolean;
  SortOrder: number;
  IsVisible: boolean;
}

interface AdministrativeArea {
  Id: number;
  Name: string;
  RegionalDistrict: RegionalDistrict;
}

export type GeoPoint = {
  x: number;
  y: number;
};

export interface Property extends BaseEntityInterface {
  Id: number;
  Name?: string;
  Description?: string;
  ClassificationId: number;
  Classification?: PropertyClassification;
  AgencyId: number;
  Agency?: Agency | null;
  AdministrativeAreaId: number;
  AdministrativeArea?: AdministrativeArea;
  Address1?: string;
  Address2?: string;
  Postal?: string;
  ProjectNumbers?: string;
  IsSensitive: boolean;
  IsVisibleToOtherAgencies: boolean;
  Location: GeoPoint;
  PID?: number;
  PIN?: number;
  SiteID?: string;
}
