import { IEvaluationModel, IFiscalModel, IPropertyModel } from 'hooks/api';

export interface IProjectBuildingModel extends IPropertyModel {
  parcelId: number;
  subAgency?: string;
  buildingConstructionTypeId: number;
  buildingConstructionType: string;
  buildingPredominateUseId: number;
  buildingPredominateUse: string;
  buildingOccupantTypeId: number;
  buildingOccupantType: string;
  buildingFloorCount: number;
  leaseExpiry?: Date;
  occupantName?: string;
  transferLeaseOnSale: boolean;
  buildingTenancy?: string;
  rentableArea: number;
  landArea: number;
  zoning?: string;
  zoningPotential?: string;
  evaluations: IEvaluationModel[];
  fiscals: IFiscalModel[];
}
