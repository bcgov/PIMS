import { IBaseEntity } from "@/controllers/common/IBaseEntity";

export interface IEvaluation extends IBaseEntity {
  parcelId: number;
  date: string;
  key: string;
  value: number;
  note: string;
  firm: string;
}
