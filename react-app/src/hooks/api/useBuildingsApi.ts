import { Property } from '@/interfaces/IProperty';
import { IFetch } from '../useFetch';
import { BaseEntityInterface } from '@/interfaces/IBaseEntity';
import { EvaluationKey } from '@/interfaces/IEvaluationKey';
import { FiscalKey } from '@/interfaces/IFiscalKey';

export interface BuildingEvaluation extends BaseEntityInterface {
  BuildingId: number;
  Building?: Building;
  Year: number;
  Value: string;
  EvaluationKeyId: number;
  EvaluationKey?: EvaluationKey;
  Note?: string;
}

export interface BuildingFiscal extends BaseEntityInterface {
  FiscalYear: number;
  EffectiveDate: Date;
  Value: string;
  Note?: string;
  FiscalKeyId: number;
  FiscalKey?: FiscalKey;
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
  includeRelations: boolean;
}

const useBuildingsApi = (absoluteFetch: IFetch) => {
  const addBuilding = async (building: BuildingAdd) => {
    const { parsedBody, status } = await absoluteFetch.post('/buildings', building);
    return { parsedBody, status };
  };
  const updateBuildingById = async (id: number, building: BuildingUpdate) => {
    const { parsedBody } = await absoluteFetch.put(`/buildings/${id}`, building);
    return parsedBody as Building;
  };

  const getBuildings = async (params?: IBuildingsGetParams) => {
    const noNullParam = params
      ? // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Object.fromEntries(Object.entries(params).filter(([_, v]) => v != null))
      : undefined;
    const { parsedBody } = await absoluteFetch.get('/buildings', noNullParam);
    if (parsedBody.error) {
      return [];
    }
    return parsedBody as Building[];
  };
  const getBuildingById = async (id: number) => {
    const { parsedBody } = await absoluteFetch.get(`/buildings/${id}`);
    return parsedBody as Building;
  };
  const deleteBuildingById = async (id: number) => {
    const { parsedBody } = await absoluteFetch.del(`/buildings/${id}`);
    return parsedBody as Building;
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
