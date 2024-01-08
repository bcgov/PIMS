import { UUID } from 'crypto';
import { IBaseEntity } from '@/controllers/common/IBaseEntity';

export interface IRole extends IBaseEntity {
  id: UUID;
  name: string;
  isDisabled: boolean;
  isVisible: boolean;
  sortOrder: number;
  type: string;
  description: string;
}
