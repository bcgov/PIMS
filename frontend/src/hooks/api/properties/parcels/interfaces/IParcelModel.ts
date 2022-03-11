import { IEvaluationModel, IFiscalModel, IPropertyModel } from 'hooks/api';

import { IParcelBuildingModel, IParcelSubdivisionModel, ISubdivisionParcelModel } from '.';

export interface IParcelModel extends IPropertyModel {
  pid: string;
  pin?: number;
  landArea: number;
  landLegalDescription: string;
  zoning?: string;
  zoningPotential?: string;
  evaluations: IEvaluationModel[];
  fiscals: IFiscalModel[];
  buildings: IParcelBuildingModel[];
  parcels: ISubdivisionParcelModel[];
  subdivisions: IParcelSubdivisionModel[];
}
