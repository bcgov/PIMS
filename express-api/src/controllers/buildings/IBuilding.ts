import { IParcel } from '@/controllers/parcels/IParcel';
import { IProperty } from '@/controllers/properties/IProperty';

export interface IBuilding extends IProperty {
  propertyType: 'Building';
  parcels?: IParcel[];
  buildingConstructionTypeId?: number;
  buildingConstructionType?: string;
  buildingFloorCount?: number;
  buildingPredominateUseId?: number;
  buildingPredominateUse?: string;
  buildingOccupantTypeId?: number;
  buildingOccupantType?: string;
  leaseExpiry?: string;
  occupantName?: string;
  transferLeaseOnSale?: boolean;
  buildingTenancy?: string;
  rentableArea?: number;
}
