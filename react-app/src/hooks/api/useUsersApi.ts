import { IFetch } from '../useFetch';
import { Agency } from './useAgencyApi';
import { KeycloakRole, Role } from './useRolesApi';

export interface User {
  //temp interface, should standardize somehow
  Id: string;
  Username: string;
  FirstName: string;
  LastName: string;
  KeycloakUserId: string;
  Status: string;
  Email: string;
  LastLogin: Date;
  CreatedOn: Date;
  DisplayName: string;
  AgencyId: number | null;
  Agency: Agency | null;
  Position: string;
  RoleId: string;
  Role: Role;
}

export interface AccessRequest {
  Position?: string;
  AgencyId: string;
  Note?: string;
}

const useUsersApi = (absoluteFetch: IFetch) => {
  const getLatestAccessRequest = async () => {
    const { parsedBody } = await absoluteFetch.get(`/users/access/requests`);
    return parsedBody;
  };
  const getSelf = async (): Promise<User> => {
    const a = await absoluteFetch.get(`/users/self`);
    return a.parsedBody as User;
  };
  const submitAccessRequest = async (request: AccessRequest): Promise<User> => {
    const { parsedBody } = await absoluteFetch.post(`/users/access/requests`, request);
    return parsedBody as User;
  };
  const getAllUsers = async () => {
    const { parsedBody } = await absoluteFetch.get('/users');
    if (parsedBody.error) {
      return [];
    }
    return parsedBody;
  };
  const getUserById = async (userId: string): Promise<User> => {
    const { parsedBody } = await absoluteFetch.get(`/users/${userId}`);
    return parsedBody as User;
  };
  const updateUser = async (userId: string, user: Partial<User>) => {
    const response = await absoluteFetch.put(`/users/${userId}`, user);
    return response;
  };
  const updateUserRole = async (username: string, role: string) => {
    const { parsedBody } = await absoluteFetch.put(`/users/roles/${username}`, [role]);
    return parsedBody as KeycloakRole[];
  };
  const deleteUser = async (userId: string) => {
    const { parsedBody } = await absoluteFetch.del(`/users/${userId}`, { Id: userId });
    return parsedBody;
  };
  return {
    getLatestAccessRequest,
    getSelf,
    submitAccessRequest,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    updateUserRole,
  };
};

export default useUsersApi;
