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
export interface Parcel {
  Id: string;
  PID: number;
  PIN: number;
  ClassificationId: number;
  Classification: {
    Name: 'Core operational';
    Id: 0;
  };
  AgencyId: 1;
  Agency: Agency | null;
  Address1: string;
  ProjectNumbers: string;
  Corporation: string;
  Ownership: 50;
  IsSensitive: true;
  UpdatedOn: Date;
  Evaluations: Evaluation | null;
  Fiscals: Fiscal | null;
}

const useParcelsApi = (absoluteFetch: IFetch) => {
  const getParcels = async () => {
    const { parsedBody } = await absoluteFetch.get('/parcels');
    return parsedBody;
  };
  const getParcelById = async (id: number) => {
    const { parsedBody } = await absoluteFetch.get(`/parcels/${id}`);
    return parsedBody;
  };
  return {
    getParcels,
    getParcelById,
  };
};

export default useParcelsApi;
