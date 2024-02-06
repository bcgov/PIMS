import { IFetch } from '../useFetch';

const useUsersApi = (absoluteFetch: IFetch) => {
  const getLatestAccessRequest = async () => {
    const { parsedBody } = await absoluteFetch.get(`/users/access/requests`);
    return parsedBody;
  };
  return {
    getLatestAccessRequest,
  };
};

export default useUsersApi;
