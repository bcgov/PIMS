import { UUID } from 'crypto';

/**
 * @interface
 * @description Defines the user object returned from the API.
 */
export interface IUser {
  createdOn: string;
  updatedOn: string;
  updatedByName: string;
  updatedByEmail: string;
  id: UUID;
  keycloakid: UUID;
  username: string;
  position: string;
  displayName: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  isDisabled: true;
  emailVerified: true;
  note: string;
  lastLogin: string;
  agency: string;
  roles: string; // TODO: Are Agency and Roles going to be singular or multiple?
}
