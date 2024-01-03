import { UUID } from 'crypto';
import { IBaseEntity } from '@/controllers/baseEntity';

export interface IRole extends IBaseEntity {
  id: UUID;
  name: string;
  isDisabled: boolean;
  isVisible: boolean;
  sortOrder: number;
  type: string;
  description: string;
}
