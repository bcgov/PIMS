import { IParcelModel } from 'hooks/api/properties/parcels';

export interface IBuildingParcelModel extends IParcelModel {
  buildingId: number;
}
