import { BaseEntityInterface } from '@/interfaces/IBaseEntity';

export interface EvaluationKey extends BaseEntityInterface {
  Id: number;
  Name: string;
  Description?: string;
}
