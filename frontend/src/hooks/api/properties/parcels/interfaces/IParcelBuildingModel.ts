import { IEvaluationModel, IFiscalModel, IPropertyModel } from 'hooks/api';

export interface IParcelBuildingModel extends IPropertyModel {
  parcelId: number;
  buildingConstructionTypeId: number;
  buildingConstructionType: string;
  buildingFloorCount: number;
  buildingPredominateUseId: number;
  buildingPredominateUse: string;
  buildingOccupantTypeId: number;
  buildingOccupantType: string;
  leaseExpiry?: Date;
  occupantName?: string;
  transferLeaseOnSale: boolean;
  buildingTenancy?: string;
  rentableArea: number;
  evaluations: IEvaluationModel[];
  fiscals: IFiscalModel[];
}
