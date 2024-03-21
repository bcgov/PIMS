import { IFetch } from '../useFetch';
import { Agency } from './useAgencyApi';

export interface Evaluation {
  Date: Date;
  Value: number;
}

export interface Fiscal {
  FiscalYear: number;
  EffectiveDate: Date;
  Value: number;
}

export interface Classification {
  Name: string;
}

export type GeoPoint = {
  x: number;
  y: number;
};

export interface Parcel {
  Id?: string; // Optional because we don't submit this for new parcels.
  PID?: number;
  PIN?: number;
  Name: string;
  Description?: string;
  ClassificationId: number;
  Classification?: Classification;
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
  Evaluations?: Evaluation[] | null;
  Fiscals?: Fiscal[] | null;
  SiteID?: string;
  LandArea?: number;
  LandLegalDescription?: string;
  Zoning?: string;
  ZoningPotential?: string;
  ParentParcelId?: number;
}

const useParcelsApi = (absoluteFetch: IFetch) => {
  const addParcel = async (parcel: Parcel) => {
    const { parsedBody } = await absoluteFetch.post('/parcels', parcel);
    return parsedBody as Parcel;
  };
  const updateParcelById = async (id: number, parcel: Partial<Parcel>) => {
    const { parsedBody } = await absoluteFetch.put(`/parcels/${id}`, parcel);
    return parsedBody as Parcel;
  };
  const getParcels = async () => {
    const { parsedBody } = await absoluteFetch.get('/parcels');
    if (parsedBody.error) {
      return [];
    }
    return parsedBody as Parcel[];
  };
  const getParcelById = async (id: number) => {
    const { parsedBody } = await absoluteFetch.get(`/parcels/${id}`);
    return parsedBody as Parcel;
  };
  const deleteParcelById = async (id: number) => {
    const { parsedBody } = await absoluteFetch.del(`/parcels/${id}`);
    return parsedBody as Parcel;
  };
  return {
    addParcel,
    updateParcelById,
    getParcels,
    getParcelById,
    deleteParcelById,
  };
};

export default useParcelsApi;
