import { Property } from '@/interfaces/IProperty';
import { IFetch } from '../useFetch';
import { BaseEntityInterface } from '@/interfaces/IBaseEntity';
import { EvaluationKey } from '@/interfaces/IEvaluationKey';
import { FiscalKey } from '@/interfaces/IFiscalKey';

export interface ParcelEvaluation extends BaseEntityInterface {
  ParcelId: number;
  Parcel?: Parcel;
  Year: number;
  Value: number;
  Firm?: string;
  EvalutationKeyId: number;
  EvaluationKey?: EvaluationKey;
  Note?: string;
}

export interface ParcelFiscal extends BaseEntityInterface {
  FiscalYear: number;
  EffectiveDate: Date;
  Value: number;
  Note?: string;
  FiscalKeyId: number;
  FiscalKey?: FiscalKey;
}

export interface Parcel extends Property {
  Evaluations?: ParcelEvaluation[] | null;
  Fiscals?: ParcelFiscal[] | null;
  LandArea?: number;
  LandLegalDescription?: string;
  Zoning?: string;
  ZoningPotential?: string;
  ParentParcelId?: number;
  ParentParcel?: Parcel;
}

export type ParcelUpdate = Partial<Parcel>;
export type ParcelAdd = Omit<
  Parcel,
  'Id' | 'CreatedOn' | 'CreatedById' | 'UpdatedOn' | 'UpdatedById'
>;

const useParcelsApi = (absoluteFetch: IFetch) => {
  const addParcel = async (parcel: ParcelAdd) => {
    const { parsedBody } = await absoluteFetch.post('/parcels', parcel);
    return parsedBody as Parcel;
  };
  const updateParcelById = async (id: number, parcel: ParcelUpdate) => {
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
  const getParcelsWithRelations = async () => {
    const { parsedBody } = await absoluteFetch.get('/parcels?includeRelations=true');
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
    getParcelsWithRelations,
    getParcelById,
    deleteParcelById,
  };
};

export default useParcelsApi;
