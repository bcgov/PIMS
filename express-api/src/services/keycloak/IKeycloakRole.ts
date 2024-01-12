/**
 * @interface
 * @param {string} name Name of role.
 * @param {boolean} composite (Optional) Is composed of other roles.
 */
export interface IKeycloakRole {
  name: string;
  composite?: boolean;
}

/**
 * @interface
 * @param {IKeycloakRole[]} data A list of Keycloak roles.
 */
export interface IKeycloakRolesResponse {
  data: IKeycloakRole[];
}
