import { CommonFiltering } from '@/interfaces/ICommonFiltering';
import { FetchResponse, IFetch } from '../useFetch';
import { Agency } from './useAgencyApi';
import { Role } from '@/constants/roles';

export interface User {
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
  const getSelf = async (): Promise<User> => {
    const a = await absoluteFetch.get(`/users/self`);
    return a.parsedBody as User;
  };
  const submitAccessRequest = async (request: AccessRequest): Promise<FetchResponse> => {
    const response = await absoluteFetch.post(`/users/access/requests`, request);
    return response;
  };
  const getAllUsers = async (sort: CommonFiltering, signal?: AbortSignal) => {
    const { parsedBody } = await absoluteFetch.get('/users', sort, { signal });
    if ((parsedBody as Record<string, any>).error) {
      return [] as User[];
    }
    return parsedBody as User[];
  };
  const getUserById = async (userId: string): Promise<User> => {
    const { parsedBody } = await absoluteFetch.get(`/users/${userId}`);
    return parsedBody as User;
  };
  const updateUser = async (userId: string, user: Partial<User>) => {
    const response = await absoluteFetch.put(`/users/${userId}`, user);
    return response;
  };
  const getUsersAgencyIds = async (username: string): Promise<number[]> => {
    const { parsedBody } = await absoluteFetch.get(`/users/agencies/${username}`);
    return parsedBody as number[];
  };
  return {
    getSelf,
    submitAccessRequest,
    getAllUsers,
    getUserById,
    updateUser,
    getUsersAgencyIds,
  };
};

export default useUsersApi;
