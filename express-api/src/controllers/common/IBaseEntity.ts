import { UUID } from 'crypto';

export interface IBaseEntity {
  createdOn: string;
  updatedOn: string;
  createdById: UUID;
  updatedById: UUID;
}
