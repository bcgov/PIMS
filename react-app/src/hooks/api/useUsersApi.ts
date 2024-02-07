import { IFetch } from '../useFetch';

export interface User { //temp interface, should standardize somehow
  Id: string;
  Username: string;
  FirstName: string;
  KeycloakUserId: string;
}

const useUsersApi = (absoluteFetch: IFetch) => {
  const getLatestAccessRequest = async () => {
    const { parsedBody } = await absoluteFetch.get(`/users/access/requests`);
    return parsedBody;
  };
  const getSelf = async (): Promise<User> => {
    const { parsedBody } = await absoluteFetch.get(`/users/self`);
    return parsedBody as User;
  }
  return {
    getLatestAccessRequest,
    getSelf,
  };
};

export default useUsersApi;
