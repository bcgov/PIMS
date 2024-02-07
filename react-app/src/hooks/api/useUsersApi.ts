import { IFetch } from '../useFetch';

const useUsersApi = (absoluteFetch: IFetch) => {
  const getLatestAccessRequest = async () => {
    const { parsedBody } = await absoluteFetch.get(`/users/access/requests`);
    return parsedBody;
  };

  const getAllUsers = async () => {
    const { parsedBody } = await absoluteFetch.get('/admin/users');
    return parsedBody;
  };
  return {
    getLatestAccessRequest,
    getAllUsers,
  };
};

export default useUsersApi;
