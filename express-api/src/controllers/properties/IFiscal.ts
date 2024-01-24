import { IBaseEntity } from "@/controllers/common/IBaseEntity";

export interface IFiscal extends IBaseEntity {
  parcelId: number;
  fiscalYear: number;
  effectiveDate: string;
  key: string;
  value: number;
  note: string;
}
