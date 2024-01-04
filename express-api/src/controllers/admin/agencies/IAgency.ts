import { UUID } from 'crypto';
import { IBaseEntity } from '@/controllers/baseEntity';

export interface IAgency extends IBaseEntity {
  id?: UUID;
  name: string;
  isDisabled: boolean;
  isVisible: boolean;
  sortOrder: number;
  type: string;
  code: string;
  parentId: UUID;
  description: string;
}
