// Confirmed that the fields in attributes are arrays of length 1;
export interface IKeycloakUser {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  attributes: {
    display_name: string[];
    idir_user_guid: string[];
    idir_username: string[];
  };
}

export interface IKeycloakUsersResponse {
  data: IKeycloakUser[];
}
