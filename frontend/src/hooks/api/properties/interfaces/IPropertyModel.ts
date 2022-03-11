import { IAddressModel, IBaseModel, PropertyType } from 'hooks/api';

export interface IPropertyModel extends IBaseModel {
  id: number;
  propertyTypeId: PropertyType;
  name: string;
  description?: string;
  agencyId?: number;
  agency?: string;
  agencyFullName?: string;
  subAgency?: string;
  subAgencyFullName?: string;
  address: IAddressModel;
  latitude: number;
  longitude: number;
  classificationId: number;
  classification: string;
  encumbranceReason?: string;
  projectNumbers: string[];
  projectWorkflow?: string;
  projectStatus?: string;
  isSensitive: boolean;
  isVisibleToOtherAgencies: boolean;
}
