import { IBaseModel } from 'hooks/api';

export interface IParcelSubdivisionModel extends IBaseModel {
  id: number;
  pid: string;
  pin?: number;
}
