import { UUID } from 'crypto';
import { IBaseEntity } from '@/controllers/baseEntity';

export interface IClaim extends IBaseEntity {
  id?: UUID;
  name: string;
  keycloakRoleId: UUID;
  description: string;
  isDisabled: boolean;
}
