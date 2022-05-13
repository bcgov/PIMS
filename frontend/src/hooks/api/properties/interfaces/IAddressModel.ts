import { IBaseModel } from 'hooks/api';

export interface IAddressModel extends IBaseModel {
  id: number;
  line1: string;
  line2?: string;
  administrativeArea: string;
  provinceId: string;
  province: string;
  postal?: string;
}
