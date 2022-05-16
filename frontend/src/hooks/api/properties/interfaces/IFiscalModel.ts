import { FiscalKeyName } from 'hooks/api/properties';

export interface IFiscalModel {
  parcelId?: number;
  buildingId?: number;
  fiscalYear: number;
  effectiveDate?: Date;
  key: FiscalKeyName;
  value: number;
  note?: string;
}
