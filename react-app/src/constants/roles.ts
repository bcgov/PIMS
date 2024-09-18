/**
 * @enum
 * These must match the role names in Keycloak exactly.
 */
export enum Roles {
  ADMIN = '00000000-0000-0000-0000-000000000000',
  GENERAL_USER = '00000000-0000-0000-0000-000000000001',
  AUDITOR = '00000000-0000-0000-0000-000000000002',
}

export interface KeycloakRole {
  name: string;
}

export interface Role {
  Id: string;
  Name: string;
}
