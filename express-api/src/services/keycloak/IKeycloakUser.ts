// Confirmed that the fields in attributes are arrays of length 1;
/**
 * @interface
 * @description User object returned from Keycloak.
 */
export interface IKeycloakUser {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  attributes: {
    display_name: [string];
    idir_user_guid?: [string];
    idir_username?: [string];
    bceid_business_guid?: [string];
    bceid_business_name?: [string];
    bceid_user_guid?: [string];
    bceid_username?: [string];
  };
}

export interface IKeycloakUsersResponse {
  data: IKeycloakUser[];
}
