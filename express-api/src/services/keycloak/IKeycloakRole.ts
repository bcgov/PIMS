export interface IKeycloakRole {
  name: string;
  composite?: boolean;
}

export interface IKeycloakRolesResponse {
  data: IKeycloakRole[];
}
