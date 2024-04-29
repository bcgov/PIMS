import { UUID } from 'crypto';
import { IBaseEntity } from '@/controllers/common/IBaseEntity';

export interface IUser extends IBaseEntity {
  id: UUID;
  displayName: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  username: string;
  position: string;
}
