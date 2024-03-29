import { Agency } from '@/hooks/api/useAgencyApi';
import { BaseEntityInterface } from '@/interfaces/IBaseEntity';

export interface PropertyClassification extends BaseEntityInterface {
  Name: string;
  Id: number;
  IsDisabled: boolean;
  SortOrder: number;
  IsVisible: boolean;
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
