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
export interface BuildingConstructionType {
  Name: string;
}
export interface BuildingPredominateUse {
  Name: string;
}
export interface BuildingOccupantType {
  Name: string;
}
export interface PropertyType {
  Name: string;
}

export type GeoPoint = {
  x: number;
  y: number;
};
export interface Building {
  Id?: string;
  Name?: string;
  Description?: string;
  BuildingConstructionTypeId: number;
  BuildingConstructionType?: BuildingConstructionType;
  BuildingFloorCount: number;
  BuildingPredominateUseId: number;
  BuildingPredominateUse: BuildingPredominateUse;
  BuildingTenancy: string;
  RentableArea: number;
  BuildingOccupantTypeId: number;
  BuildingOccupantType?: BuildingOccupantType;
  LeaseExpiry?: Date;
  OccupantName?: string;
  TransferLeaseOnSale?: boolean;
  BuildingTenancyUpdatedOn?: Date;
  EncumbranceReason?: string;
  LeasedLandMetadata?: string;
  TotalArea?: number;
  AdministrativeAreaId: number;
  AdministrativeArea?: string;
  IsVisibleToOtherAgencies?: boolean;
  Location: GeoPoint;
  Address1: string;
  Address2: string;
  ClassificationId: number;
  Classification: Classification;
  ProjectNumbers?: string;
  PropertyTypeId: number;
  PropertyType?: PropertyType;
  AgencyId: number;
  Agency?: Agency | null;
  PID?: number;
  PIN?: number;
  IsSensitive: boolean;
  Evaluations?: Evaluation[] | null;
  Fiscals?: Fiscal[] | null;
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
