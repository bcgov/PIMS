import { UUID } from 'crypto';

export interface IClaim {
  createdOn?: string;
  updatedOn?: string;
  updatedByName?: string;
  updatedByEmail?: string;
  id?: UUID;
  name: string;
  keycloakRoleId: UUID;
  description: string;
  isDisabled: boolean;
}
