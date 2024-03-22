import { User } from '@/hooks/api/useUsersApi';
import { UUID } from 'crypto';

export interface BaseEntityInterface {
  CreatedById: UUID;
  CreatedBy?: User;
  CreatedOn: Date;
  UpdatedById?: UUID;
  UpdatedBy?: User;
  UpdatedOn?: Date;
}
