import { IEvaluationModel, IFiscalModel, IPropertyModel } from 'hooks/api';
import { IParcelBuildingModel, ISubdivisionParcelModel } from 'hooks/api/properties/parcels';

export interface IProjectParcelModel extends IPropertyModel {
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
}
