import { Property } from '@/interfaces/IProperty';
import { IFetch } from '../useFetch';
import { BaseEntityInterface } from '@/interfaces/IBaseEntity';
export interface EvaluationKey extends BaseEntityInterface {
  Id: number;
  Name: string;
  Description?: string;
}
export interface BuildingEvaluation extends BaseEntityInterface {
  BuildingId: number;
  Building?: Building;
  Value: number;
  EvalutationKeyId: number;
  EvaluationKey?: EvaluationKey;
  Note?: string;
}
export interface FiscalKey extends BaseEntityInterface {
  Id: number;
  Name: string;
  Description?: string;
}
export interface BuildingFiscal extends BaseEntityInterface {
  FiscalYear: number;
  EffectiveDate: Date;
  Value: number;
  Note?: string;
  FiscalKeyId: number;
  FiscalKey?: FiscalKey;
}
export interface BuildingConstructionType {
  Id: number;
  Name: string;
  IsDisabled: boolean;
  SortOrder: number;
}
export interface BuildingPredominateUse {
  Id: number;
  Name: string;
  IsDisabled: boolean;
  SortOrder: number;
}
export interface BuildingOccupantType {
  Id: number;
  Name: string;
  IsDisabled: boolean;
  SortOrder: number;
}
export interface PropertyType {
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
  BuildingOccupantTypeId: number;
  BuildingOccupantType?: BuildingOccupantType;
  LeaseExpiry?: Date;
  OccupantName?: string;
  TransferLeaseOnSale?: boolean;
  BuildingTenancyUpdatedOn?: Date;
  EncumbranceReason?: string;
  LeasedLandMetadata?: string;
  TotalArea?: number;
  PropertyTypeId: number;
  PropertyType?: PropertyType;
  Evaluations?: BuildingEvaluation[] | null;
  Fiscals?: BuildingFiscal[] | null;
}

const useBuildingsApi = (absoluteFetch: IFetch) => {
  const addBuilding = async (building: Building) => {
    const { parsedBody } = await absoluteFetch.post('/buildings', building);
    return parsedBody as Building;
  };
  const updateBuildingById = async (id: number, building: Partial<Building>) => {
    const { parsedBody } = await absoluteFetch.put(`/buildings/${id}`, building);
    return parsedBody as Building;
  };
  const getBuildings = async () => {
    const { parsedBody } = await absoluteFetch.get('/buildings');
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
