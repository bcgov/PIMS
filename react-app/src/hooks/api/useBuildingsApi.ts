import { IFetch } from '../useFetch';
import { Agency } from './useAgencyApi';

// const buildings1 = [
//   {
//     Id: 1,
//     ClassificationId: 0,
//     Classification: {
//       Name: 'Core operational',
//       Id: 0,
//     },
//     Address1: '2345 Example St.',
//     AgencyId: 1,
//     Agency: { Name: 'Smith & Weston' },
//     PID: 111333444,
//     IsSensitive: true,
//     UpdatedOn: new Date(),
//     Evaluations: [{ Value: 99888, Date: new Date() }],
//     Fiscals: [{ Value: 1235000, FiscalYear: 2024 }],
//   },
//   {
//     Id: 2,
//     ClassificationId: 5,
//     Classification: {
//       Name: 'Disposed',
//       Id: 5,
//     },
//     Address1: '6432 Nullabel Ln.',
//     AgencyId: 1,
//     Agency: { Name: 'Smith & Weston' },
//     PID: 676555444,
//     IsSensitive: false,
//     UpdatedOn: new Date(),
//     Evaluations: [{ Value: 999988, Date: new Date() }],
//     Fiscals: [{ Value: 1235000, FiscalYear: 2024 }],
//   },
// ];
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
  PID: number;
  Address1: string;
  IsSensitive: true;
  UpdatedOn: Date;
  Evaluations: Evaluation[] | null;
  Fiscals: Fiscal[] | null;
}

const useBuildingsApi = (absoluteFetch: IFetch) => {
  const addBuilding = async () => {
    const { parsedBody } = await absoluteFetch.post('/buildings');
    return parsedBody as Building;
  };
  const updateBuilding = async () => {
    const { parsedBody } = await absoluteFetch.put('/buildings');
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
    updateBuilding,
    getBuildings,
    getBuildingById,
    deleteBuildingById,
  };
};

export default useBuildingsApi;
