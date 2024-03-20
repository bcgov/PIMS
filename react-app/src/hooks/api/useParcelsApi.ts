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
export interface Parcel {
  Id: string;
  PID?: number;
  PIN?: number;
  ClassificationId: number;
  Classification: Classification;
  AgencyId: number;
  Agency: Agency | null;
  Address1: string;
  ProjectNumbers: string;
  Corporation: string;
  Ownership: string;
  IsSensitive: true;
  UpdatedOn: Date;
  Evaluations?: Evaluation[] | null;
  Fiscals?: Fiscal[] | null;
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
