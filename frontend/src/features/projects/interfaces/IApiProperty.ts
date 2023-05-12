import { IAddress, IBuilding, IEvaluation, IFiscal } from 'actions/parcelsActions';

import { IParentParcel } from '.';

export interface IApiProperty {
  id: number;
  parcelId?: number;
  buildingId?: number;
  buildingTenancy?: string;
  propertyTypeId: number;
  pid?: string;
  pin?: number | '';
  projectNumbers: string[];
  latitude: number;
  longitude: number;
  classification?: string;
  classificationId: number;
  name: string;
  description: string;
  address?: IAddress;
  landArea: number;
  landLegalDescription: string;
  zoning: string;
  zoningPotential: string;
  agency?: string;
  subAgency?: string;
  agencyId: number;
  isSensitive: boolean;
  buildings: IBuilding[];
  evaluations: IEvaluation[];
  fiscals: IFiscal[];
  rowVersion?: string;
  parcels?: IParentParcel[];
}
