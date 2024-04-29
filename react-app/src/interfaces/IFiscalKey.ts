import { BaseEntityInterface } from '@/interfaces/IBaseEntity';

export interface FiscalKey extends BaseEntityInterface {
  Id: number;
  Name: string;
  Description?: string;
}
