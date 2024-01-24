import { IProperty } from '@/controllers/properties/IProperty';
import { IBaseEntity } from '@/controllers/common/IBaseEntity';
import { IBuilding } from '@/controllers/buildings/IBuilding';
/**
 * Some of these can probably be separated out elsewhere later, but I think this is fine for now.
 * Was uncertain whether ISubdivision or ISubParcel are meant to be just a selection from IParcel or their own interfaces.
 */

export interface ISubParcel extends IBaseEntity {
  id: number;
  pid: string;
  pin: number;
}

export interface ISubdivision extends IBaseEntity {
  id: number;
  pid: string;
  pin: number;
}

export interface IParcel extends IProperty {
  propertyType: 'Land' | 'Subdivision';
  pid: string;
  pin?: number;
  landArea?: number;
  landLegalDescription?: string;
  zoning?: string;
  zoningPotential?: string;
  buildings?: IBuilding[];
  parentParcelPID?: number;
  subdivisionPids?: string[];
}
