import { IBaseEntity } from '@/controllers/common/IBaseEntity';
import { IEvaluation } from '@/controllers/properties/IEvaluation';
import { IFiscal } from '@/controllers/properties/IFiscal';
import { Point } from 'typeorm';

export interface IProperty extends IBaseEntity {
  id: number;
  name?: string;
  description?: string;
  classificationId: number;
  classification: string;
  encumbranceReason?: string;
  agencyId?: number;
  agency?: string;
  subAgency?: string;
  location: Point;
  isSensitive: boolean;
  isVisibleToOtherAgencies: boolean;
  administrativeAreaId: number;
  administrativeArea: string;
  regionalDistrict: string;
  province: string;
  address1?: string;
  address2?: string;
  postal?: string;
  siteId?: string;
  evaluations?: IEvaluation[];
  fiscals?: IFiscal[];
  projectNumbers?: string[];
  projectWorkflow?: string;
  projectStatus?: string;
}
