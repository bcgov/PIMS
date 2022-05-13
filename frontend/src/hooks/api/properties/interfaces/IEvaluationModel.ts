import { EvaluationKeyName } from 'hooks/api';

export interface IEvaluationModel {
  parcelId?: number;
  buildingId?: number;
  date: Date;
  key: EvaluationKeyName;
  value: number;
  note?: string;
  firm?: string;
}
