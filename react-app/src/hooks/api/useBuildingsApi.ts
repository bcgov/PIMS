import { Property } from '@/interfaces/IProperty';
import { IFetch } from '../useFetch';
import { BaseEntityInterface } from '@/interfaces/IBaseEntity';
import { EvaluationKey } from '@/interfaces/IEvaluationKey';
import { FiscalKey } from '@/interfaces/IFiscalKey';
import { DeepPartial } from 'react-hook-form';

export interface BuildingEvaluation extends BaseEntityInterface {
  BuildingId: number;
  Building?: Building;
  Year: number;
  Value: number;
  EvaluationKeyId: number;
  EvaluationKey?: EvaluationKey;
  Note?: string;
}

export interface BuildingFiscal extends BaseEntityInterface {
  FiscalYear: number;
  EffectiveDate: Date;
  Value: number;
  Note?: string;
  FiscalKeyId: number;
  FiscalKey?: FiscalKey;
  BuildingId?: number;
}

export interface BuildingConstructionType extends BaseEntityInterface {
  Id: number;
  Name: string;
  IsDisabled: boolean;
  SortOrder: number;
}

export interface BuildingPredominateUse extends BaseEntityInterface {
  Id: number;
  Name: string;
  IsDisabled: boolean;
  SortOrder: number;
}

export interface PropertyType extends BaseEntityInterface {
  Id: number;
  Name: string;
  IsDisabled: boolean;
  SortOrder: number;
}

export interface Building extends Property {
  BuildingConstructionTypeId: number;
  BuildingConstructionType?: BuildingConstructionType;
  BuildingFloorCount: number;
  BuildingPredominateUseId: number;
  BuildingPredominateUse?: BuildingPredominateUse;
  BuildingTenancy?: string;
  RentableArea?: number;
  LeaseExpiry?: Date;
  OccupantName?: string;
  BuildingTenancyUpdatedOn?: Date;
  EncumbranceReason?: string;
  LeasedLandMetadata?: string;
  TotalArea?: number;
  PropertyTypeId: number;
  PropertyType?: PropertyType;
  Evaluations?: BuildingEvaluation[] | null;
  Fiscals?: BuildingFiscal[] | null;
}

type BuildingEvaluationAdd = Omit<
  BuildingEvaluation,
  'BuildingId' | 'CreatedOn' | 'CreatedById' | 'UpdatedOn' | 'UpdatedById'
>;
type BuildingFiscalAdd = Omit<
  BuildingFiscal,
  'BuildingId' | 'CreatedOn' | 'CreatedById' | 'UpdatedOn' | 'UpdatedById'
>;

export type BuildingUpdate = Partial<Building>;
export type BuildingAdd = Omit<
  Building,
  'Id' | 'CreatedOn' | 'CreatedById' | 'UpdatedOn' | 'UpdatedById' | 'Evaluations' | 'Fiscals'
> & { Evaluations: BuildingEvaluationAdd[]; Fiscals: BuildingFiscalAdd[] };

export interface IBuildingsGetParams {
  pid?: number;
  includeRelations?: boolean;
  excelExport?: boolean;
}

const useBuildingsApi = (absoluteFetch: IFetch) => {
  const addBuilding = async (building: BuildingAdd) => {
    const response = await absoluteFetch.post('/buildings', building);
    return response;
  };
  const updateBuildingById = async (id: number, building: DeepPartial<BuildingUpdate>) => {
    const response = await absoluteFetch.put(`/buildings/${id}`, building);
    return response;
  };

  const getBuildings = async (params?: IBuildingsGetParams) => {
    const noNullParam = params
      ? // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Object.fromEntries(Object.entries(params).filter(([_, v]) => v != null))
      : undefined;
    const { parsedBody } = await absoluteFetch.get('/buildings', noNullParam);
    if ((parsedBody as Record<string, any>).error) {
      return [];
    }
    return parsedBody as Building[];
  };
  const getBuildingById = async (id: number) => {
    const { parsedBody, status } = await absoluteFetch.get(`/buildings/${id}`);
    return { parsedBody: parsedBody as Building, status };
  };
  const deleteBuildingById = async (id: number) => {
    const response = await absoluteFetch.del(`/buildings/${id}`);
    return response;
  };
  return {
    addBuilding,
    updateBuildingById,
    getBuildings,
    getBuildingById,
    deleteBuildingById,
  };
};

export default useBuildingsApi;
