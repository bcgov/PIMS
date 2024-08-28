/**
 * @enum
 * These must match the role names in Keycloak exactly.
 */
export enum Roles {
  ADMIN = 'Administrator',
  GENERAL_USER = 'General User',
  AUDITOR = 'Auditor',
}

export interface KeycloakRole {
  name: string;
}

export interface Role {
  Id: string;
  Name: string;
}
