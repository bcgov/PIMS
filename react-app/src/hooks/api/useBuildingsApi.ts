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
export interface Building {
  Id: string;
  ClassificationId: number;
  Classification: Classification;
  AgencyId: number;
  Agency: Agency | null;
  PID?: number;
  Address1: string;
  IsSensitive: true;
  UpdatedOn: Date;
  Evaluations: Evaluation[] | null;
  Fiscals: Fiscal[] | null;
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
