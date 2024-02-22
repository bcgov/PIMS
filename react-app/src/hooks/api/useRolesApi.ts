import { IFetch } from '../useFetch';

export interface KeycloakRole {
  name: string;
}

export interface Role {
  Id: string;
  Name: string;
}

const useRolesApi = (absoluteFetch: IFetch) => {
  const getKeycloakRoles = async () => {
    const { parsedBody } = await absoluteFetch.get(`/admin/users/roles/`);
    return parsedBody as KeycloakRole[];
  };

  const getInternalRoles = async () => {
    const { parsedBody } = await absoluteFetch.get(`/admin/roles/`);
    return parsedBody as Role[];
  };

  return {
    getKeycloakRoles,
    getInternalRoles,
  };
};

export default useRolesApi;
