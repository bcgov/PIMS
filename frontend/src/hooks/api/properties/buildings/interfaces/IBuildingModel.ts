import { IEvaluationModel, IFiscalModel, IPropertyModel } from 'hooks/api';

import { IBuildingParcelModel, ILeasedLandMetadataModel } from '.';

export interface IBuildingModel extends IPropertyModel {
  parcelId: number;
  buildingConstructionTypeId: number;
  buildingConstructionType: string;
  buildingPredominateUseId: number;
  buildingPredominateUse: string;
  buildingOccupantTypeId: number;
  buildingOccupantType: string;
  leaseExpiry?: Date;
  occupantName?: string;
  transferLeaseOnSale: boolean;
  buildingTenancy?: string;
  rentableArea: number;
  totalArea: number;
  leasedLandMetadata: ILeasedLandMetadataModel[];
  parcels: IBuildingParcelModel[];
  evaluations: IEvaluationModel[];
  fiscals: IFiscalModel[];
}
