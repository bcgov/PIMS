import { IBaseModel } from 'hooks/api/interfaces';
import { PropertyTypeName } from 'hooks/api/properties';

import { IProjectBuildingModel, IProjectParcelModel } from '.';

export interface IProjectPropertyModel extends IBaseModel {
  id: number;
  projectId: number;
  propertyType: PropertyTypeName;
  parcelId?: number;
  parcel?: IProjectParcelModel;
  buildingId?: number;
  building?: IProjectBuildingModel;
}
