/**
 * @interface
 * @description Role object returned from Keycloak. Composite field indicates if it is composed of other roles.
 * @param {string} name Name of role.
 * @param {boolean} composite (Optional) Is composed of other roles.
 */
export interface IKeycloakRole {
  name: string;
  id: string;
  composite?: boolean;
}

/**
 * @interface
 * @param {IKeycloakRole[]} data A list of Keycloak roles.
 */
export interface IKeycloakRolesResponse {
  data: IKeycloakRole[];
}
